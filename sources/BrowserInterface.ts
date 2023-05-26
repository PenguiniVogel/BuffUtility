/**
 * The global content_script space,
 * necessary because in chrome you can find it with <code>self</code>
 * but in firefox you require this reference
 */
const _globalScope = this;

/**
 * Module to manage communication between content and background scripts
 */
/** */
module BrowserInterface {

    DEBUG && console.debug('[BuffUtility] Module.BrowserInterface');

    export interface Manifest {
        version: string
    }

    /**
     * Represents a browser environment with matched functions
     */
    interface BrowserEnvironment<TStorage extends Storage.Space> {
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

            /**
             * Get the manifest
             */
            getManifest(): Manifest
        },
        storage: {
            local: TStorage
            sync: TStorage,
            session: TStorage
        }
    }

    export const enum DelegationMethod {
        SCHEMA_HELPER_FIND = 'SchemaHelper_find',
        BUFF_SCHEMA_GET = 'BuffSchema_get',
        BUFF_BARGAIN_FETCH = 'BuffBargain_fetch',
        CURRENCY_CACHE_GET = 'CurrencyCache_get'
    }

    export interface BaseDelegation {
        method: DelegationMethod,
        async?: boolean,
        parameters: {
            [key: string]: any
        }
    }

    export interface SchemaHelperFindDelegation extends BaseDelegation {
        method: DelegationMethod.SCHEMA_HELPER_FIND,
        parameters: {
            name: string,
            weaponOnly: boolean,
            isVanilla: boolean,
            reduceInformation: boolean
        }
    }

    export interface BuffSchemaGetIdOrNameDelegation extends BaseDelegation {
        method: DelegationMethod.BUFF_SCHEMA_GET,
        parameters: {
            name: string
        }
    }

    export interface BuffBargainFetchDelegation extends BaseDelegation {
        method: DelegationMethod.BUFF_BARGAIN_FETCH,
        parameters: {
            classId: string,
            instanceId: string,
            assetId: string,
            orderId: string
        }
    }

    export interface CurrencyCacheGet extends BaseDelegation {
        method: DelegationMethod.CURRENCY_CACHE_GET,
        parameters: { }
    }

    export interface MessageResponse<T> {
        received: boolean,
        type: string,
        data: T
    }

    declare var chrome: BrowserEnvironment<Storage.CallbackSpace>;
    declare var browser: BrowserEnvironment<Storage.PromiseSpace>;

    let environment: 'chrome' | 'browser' = null;

    let browserEnvironment: BrowserEnvironment<any>;

    /**
     * Initialize the environment, mapping the current respective browser
     *
     * @private
     */
    function initializeBrowserEnvironment(): BrowserEnvironment<any> {
        if (browserEnvironment) {
            return browserEnvironment;
        }

        // check for firefox first
        if ('browser' in _globalScope || 'browser' in self) {
            environment = 'browser';
            browserEnvironment = browser;

            return browserEnvironment;
        }

        // check for chrome
        if ('chrome' in self) {
            environment = 'chrome';
            browserEnvironment = chrome;

            return browserEnvironment;
        }

        throw new Error('[BrowserInterface] Neither chrome or browser was found in global, this browser is not supported.');
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
     * Get the extension manifest
     */
    export function getManifest(): Manifest {
        return browserEnvironment.runtime.getManifest();
    }

    /**
     * Module to manage storage options
     */
    /** */
    export module Storage {

        export interface Space {
            set: Function,
            get: Function,
            clear: Function,
            getBytesInUse: Function
        }

        export interface CallbackSpace extends Space {
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
            get<T>(keys: string[], callback: (result: { [key: string]: T }) => void): void,

            /**
             * Removes all items from storage
             *
             * @param callback
             */
            clear(callback?: () => void),

            /**
             * Get all bytes in use
             *
             * @param callback
             */
            getBytesInUse(callback: (bytesInUse: number) => void)
        }

        export interface PromiseSpace extends Space {
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

            /**
             * Removes all items from storage
             */
            clear(): Promise<void>,

            /**
             * Get all bytes in use
             */
            getBytesInUse(): Promise<number>
        }

        export const enum Area {
            LOCAL = 'local',
            SYNC = 'sync',
            SESSION = 'session'
        }

        /**
         * Set data
         *
         * @param data
         * @param fromSpace
         */
        export async function set(data: { [key: string]: any }, fromSpace: Area = Area.SYNC): Promise<void> {
            return await new Promise<void>((resolve, _) => {
                switch (environment) {
                    case 'chrome':
                        chrome.storage[fromSpace].set(data, () => resolve());
                        break;
                    case 'browser':
                        browser.storage[fromSpace].set(data).then(_ => resolve());
                        break;
                }
            });
        }

        /**
         * Get data
         *
         * @param key
         * @param storageArea
         */
        export async function get<T>(key: string, storageArea: Area = Area.SYNC): Promise<T> {
            let result = await getAll<T>([key], storageArea);
            return (result ?? {})[key];
        }

        /**
         * Get data
         *
         * @param keys
         * @param storageArea
         */
        export async function getAll<T>(keys: string[], storageArea: Area = Area.SYNC): Promise<{ [key: string]: T }> {
            return await new Promise<{ [key: string]: T }>((resolve, _) => {
                switch (environment) {
                    case 'chrome':
                        chrome.storage[storageArea].get<T>(keys, (result) => resolve(result));
                        break;
                    case 'browser':
                        browser.storage[storageArea].get<T>(keys)
                            .then(result => resolve(result))
                            .catch(_ => resolve(null));
                        break;
                }
            });
        }

        /**
         * Removes all items from storage
         *
         * @param storageArea
         */
        export async function clear(storageArea: Area = Area.SYNC): Promise<void> {
            return await new Promise<void>((resolve, _) => {
                switch (environment) {
                    case 'chrome':
                        chrome.storage[storageArea].clear(() => resolve());
                        break;
                    case 'browser':
                        browser.storage[storageArea].clear()
                            .then(result => resolve(result))
                            .catch(_ => resolve(null));
                        break;
                }
            });
        }

        /**
         * Get bytes in use from the specified area
         *
         * @param storageArea
         */
        export async function getBytesInUse(storageArea: Area = Area.SYNC): Promise<number> {
            return await new Promise<number>((resolve, _) => {
                switch (environment) {
                    case 'chrome':
                        chrome.storage[storageArea].getBytesInUse((bytesInUse) => resolve(bytesInUse));
                        break;
                    case 'browser':
                        browser.storage[storageArea].getBytesInUse()
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
