/**
 * Module to manage communication between content and background scripts
 */
/** */
module BrowserInterface {

    DEBUG && console.debug('Start.BrowserInterface');

    /**
     * Represents a browser environment with matched functions
     */
    interface BrowserEnvironment {
        runtime: {
            /**
             * The extension id
             */
            id?: string,

            /**
             * onMessage event
             */
            onMessage: {
                /**
                 * Add a listener to the event
                 *
                 * @param handler
                 */
                addListener(handler: (request: any, sender: any, sendResponse: (data: any) => void) => void): void,
            },
            /**
             * Send a message to the background script (Firefox) / service worker (Chrome)
             *
             * @param data
             * @param response
             */
            sendMessage(data: any, response: (data: any) => void): void,
        }
    }

    interface ChromeEnvironment extends BrowserEnvironment {
        storage: {
            sync: {
                /**
                 * Set an item in sync storage
                 *
                 * @param data
                 * @param callback
                 */
                set(data: { [key: string]: any }, callback: () => void): void,

                /**
                 * Get an item from sync storage
                 *
                 * @param keys
                 * @param callback
                 */
                get<T>(keys: string[], callback: (result: { [key: string]: T }) => void): void
            }
        }
    }

    interface FirefoxEnvironment extends BrowserEnvironment {
        storage: {
            sync: {
                /**
                 * Set an item in sync storage
                 *
                 * @param data
                 */
                set(data: { [key: string]: any }): Promise<void>,

                /**
                 * Get an item from sync storage
                 *
                 * @param keys
                 */
                get<T>(keys: string[]): Promise<{ [key: string]: T }>
            }
        }
    }

    declare var chrome: ChromeEnvironment;
    declare var browser: FirefoxEnvironment;

    let environment: 'chrome' | 'browser' = null;

    export const enum DelegationMethod {
        SchemaHelper_find = 'SchemaHelper_find',
        BuffSchema_get = 'BuffSchema_get',
        BuffBargain_fetch = 'BuffBargain_fetch',
        CurrencyCache_get = 'CurrencyCache_get'
    }

    export interface BaseDelegation {
        method: DelegationMethod,
        async?: boolean,
        parameters: {
            [key: string]: any
        }
    }

    export interface SchemaHelperFindDelegation extends BaseDelegation {
        method: DelegationMethod.SchemaHelper_find,
        parameters: {
            name: string,
            weaponOnly: boolean,
            isVanilla: boolean,
            reduceInformation: boolean
        }
    }

    export interface BuffSchemaGetIdDelegation extends BaseDelegation {
        method: DelegationMethod.BuffSchema_get,
        parameters: {
            name: string
        }
    }

    export interface BuffBargainFetchDelegation extends BaseDelegation {
        method: DelegationMethod.BuffBargain_fetch,
        parameters: {
            classId: string,
            instanceId: string,
            assetId: string,
            orderId: string
        }
    }

    export interface CurrencyCacheGet extends BaseDelegation {
        method: DelegationMethod.CurrencyCache_get,
        parameters: {
            currencyName: string
        }
    }

    export interface MessageResponse<T> {
        received: boolean,
        type: string,
        data: T
    }

    let browserEnvironment: BrowserEnvironment;

    /**
     * Initialize the environment, mapping the current respective browser
     *
     * @private
     */
    function initializeBrowserEnvironment(): BrowserEnvironment {
        if (browserEnvironment) {
            return browserEnvironment;
        }

        if ('chrome' in self) {
            environment = 'chrome';
            browserEnvironment = chrome;

            return browserEnvironment;
        }

        if ('browser' in self) {
            environment = 'browser';
            browserEnvironment = browser;

            return browserEnvironment;
        }

        throw new Error('[BrowserInterface] Neither chrome or browser was found in global, this browser is not supported.');
    }

    /**
     * Get the current associated environment
     */
    export function getEnvironment(): BrowserEnvironment {
        return browserEnvironment;
    }

    /**
     * Add a listener to the onMessage event
     *
     * @param handler
     */
    export function addListener(handler: (request: BaseDelegation, sender: any, sendResponse: (data: MessageResponse<any>) => void) => boolean): void {
        browserEnvironment.runtime.onMessage.addListener(handler);
    }

    /**
     * Send a message to the background script / worker
     *
     * @param data
     */
    export async function sendMessage<T>(data: any): Promise<MessageResponse<T>> {
        return await new Promise<MessageResponse<T>>((resolve, reject) => {
            if (isAvailable()) {
                browserEnvironment.runtime.sendMessage(data, (data) => {
                    resolve(data);
                });
            } else {
                reject('[BrowserInterface] Extension context was not available.');
            }
        });
    }

    /**
     * Delegate an operation to the background script / worker
     *
     * @param delegate
     */
    export async function delegate<T extends BaseDelegation, R>(delegate: T): Promise<MessageResponse<R>> {
        return await new Promise<MessageResponse<R>>((resolve, _) => {
            sendMessage<R>(delegate)
                .then(result => resolve(result))
                .catch(error => console.debug('[BrowserInterface.delegate] Failed.', error));
        });
    }

    /**
     * Get the status if the extension context is available
     */
    export function isAvailable(): boolean {
        return !!(browserEnvironment?.runtime?.id);
    }

    /**
     * Start the ping system to upkeep the background worker and stop it from dying randomly
     */
    export function setupPingSystem(): void {
        function _ping(): void {
            sendMessage({ ping: Date.now() })
                .then(_ => setTimeout(() => _ping(), 15_000))
                .catch(error => {
                    console.debug('[BrowserInterface.ping] Failed.', error);
                    setTimeout(() => _ping(), 15_000);
                });
        }

        _ping();
    }

    /**
     * Module to manage storage options
     */
    /** */
    export module Storage {

        /**
         * Set data
         *
         * @param data
         */
        export async function set(data: { [key: string]: any }): Promise<void> {
            return await new Promise<void>((resolve, _) => {
                switch (environment) {
                    case 'chrome':
                        chrome.storage.sync.set(data, () => resolve());
                        break;
                    case 'browser':
                        browser.storage.sync.set(data).then(_ => resolve());
                        break;
                }
            });
        }

        /**
         * Get data
         *
         * @param key
         */
        export async function get<T>(key: string): Promise<T> {
            let result = await getAll<T>([key]);
            return (result ?? {})[key];
        }

        /**
         * Get data
         *
         * @param keys
         */
        export async function getAll<T>(keys: string[]): Promise<{ [key: string]: T }> {
            return await new Promise<{ [key: string]: T }>((resolve, _) => {
                switch (environment) {
                    case 'chrome':
                        chrome.storage.sync.get<T>(keys, (result) => resolve(result));
                        break;
                    case 'browser':
                        browser.storage.sync.get<T>(keys)
                            .then(result => resolve(result))
                            .catch(_ => resolve(null));
                        break;
                }
            });
        }

    }

    // initialize environment once loaded
    initializeBrowserEnvironment();

}
