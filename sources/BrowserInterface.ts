/**
 * Represents a browser environment with matched functions
 */
declare interface BrowserEnvironment {
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
            addListener(handler: (request: any, sender: any, sendResponse: (data: any) => void) => void): void
        },
        /**
         * Send a message to the background script (Firefox) / service worker (Chrome)
         *
         * @param data
         * @param response
         */
        sendMessage(data: any, response: (data: any) => void): void
    }
}

declare var chrome: BrowserEnvironment;
declare var browser: BrowserEnvironment;

/**
 * Module to manage communication between content and background scripts
 */
/** */
module BrowserInterface {

    export const enum DelegationMethod {
        SchemaHelper_find = 'SchemaHelper_find',
        BuffSchema_get = 'BuffSchema_get',
        BuffBargain_fetch = 'BuffBargain_fetch'
    }

    export interface UnknownDelegation {
        method: DelegationMethod,
        async?: boolean,
        parameters: {
            [key: string]: any
        }
    }

    export interface SchemaHelperFindDelegation extends UnknownDelegation {
        method: DelegationMethod.SchemaHelper_find,
        parameters: {
            name: string,
            weaponOnly: boolean,
            isVanilla: boolean,
            reduceInformation: boolean
        }
    }

    export interface BuffSchemaGetIdDelegation extends UnknownDelegation {
        method: DelegationMethod.BuffSchema_get,
        parameters: {
            name: string
        }
    }

    export interface BuffBargainFetchDelegation extends UnknownDelegation {
        method: DelegationMethod.BuffBargain_fetch,
        parameters: {
            classId: string,
            instanceId: string,
            assetId: string,
            orderId: string
        }
    }

    export interface MessageResponse<T> {
        received: boolean,
        type: string,
        data: T
    }

    let browserEnvironment: BrowserEnvironment;

    function initializeBrowserEnvironment(): BrowserEnvironment {
        if (browserEnvironment) {
            return browserEnvironment;
        }

        if ('chrome' in self) {
            browserEnvironment = chrome;
            return browserEnvironment;
        }

        if ('browser' in self) {
            browserEnvironment = browser;
            return browserEnvironment;
        }

        throw new Error('[BrowserInterface] Neither chrome or browser was found in global, this browser is not supported.');
    }

    export function addListener(handler: (request: UnknownDelegation, sender: any, sendResponse: (data: MessageResponse<any>) => void) => boolean): void {
        browserEnvironment.runtime.onMessage.addListener(handler);
    }

    export async function sendMessage<T>(data: any): Promise<MessageResponse<T>> {
        return await new Promise<MessageResponse<T>>((resolve, _) => {
            browserEnvironment.runtime.sendMessage(data, (data) => {
                resolve(data);
            });
        });
    }

    export async function delegate<T extends UnknownDelegation, R>(delegate: T): Promise<MessageResponse<R>> {
        return await new Promise<MessageResponse<R>>((resolve, _) => {
            browserEnvironment.runtime.sendMessage(delegate, (data) => {
                resolve(data);
            });
        });
    }

    export function setupPingSystem(): void {
        function _ping(): void {
            browserEnvironment.runtime.sendMessage({ ping: Date.now() }, (data) => {
                // ping again after 15 seconds, inactive state arises after 30
                setTimeout(() => _ping(), 15_000);
            });
        }

        _ping();
    }

    initializeBrowserEnvironment();

}
