declare module CurrencyHelper {

    export interface Data {
        'date': string,
        'rates': {
            [name: string]: [number, number]
        }
    }

    export function initialize(): void;

    export function getData(): Data;

}
