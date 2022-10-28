/**
 * Module to manage communication between content and background scripts
 */
/** */
module BrowserInterface {

    export const enum DelegationMethod {
        SchemaHelper_find,
        BuffSchema_get
    }

    export interface UnknownDelegation {
        method: DelegationMethod,
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

    export type BrowserEnvironment = {
        runtime: {
            onMessage: {
                addListener(handler: (request: any, sender: any, sendResponse: (data: any) => void) => void): void
            },
            sendMessage(data: any, response: (data: any) => void): void
        }
    };

    declare var chrome: BrowserEnvironment;
    declare var browser: BrowserEnvironment;

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

    export function addListener(handler: (request: any, sender: any, sendResponse: (data: any) => void) => void): void {
        browserEnvironment.runtime.onMessage.addListener(handler);
    }

    export function sendMessage(data: any, response: (data: any) => void): void {
        browserEnvironment.runtime.sendMessage(data, response);
    }

    export async function sendMessageAsync<T>(data: any): Promise<T> {
        return await <PromiseLike<T>>{
            then(resolve, _) {
                browserEnvironment.runtime.sendMessage(data, (data) => {
                    resolve(data);
                });
            }
        };
    }

    export async function delegate<T extends UnknownDelegation, R>(delegate: T): Promise<R> {
        return await sendMessageAsync(delegate);
    }

    initializeBrowserEnvironment();

}