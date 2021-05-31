/**
 * Author: Felix Vogel
 */
/** */
module Util {

    export const SYMBOL_YUAN = '¥';
    export const SYMBOL_ARROW_UP = '▲';
    export const SYMBOL_ARROW_DOWN = '▼';

    export function parseJson<T extends object>(_in: XMLHttpRequest | string): T {
        let result: T;

        if (typeof _in == 'string') {
            return JSON.parse(_in);
        }

        result = JSON.parse(_in.responseText);

        return result;
    }

    export function getGoodsId(_in: string): string {
        return (/goods_id=\d+/.exec(_in)[0] ?? 'goods_id=-1').substr('goods_id='.length);
    }

}
