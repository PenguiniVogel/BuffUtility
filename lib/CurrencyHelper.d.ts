/**
 * Author: Felix Vogel
 */
/** */
declare module CurrencyHelper {

    export interface Data {
        'date': string,
        'rates': {
            [name: string]: [number, number]
        },
        'symbols': {
            [name: string]: string
        }
    }

    export function initialize(): void;

    export function getData(): Data;

}
