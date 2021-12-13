/**
 * Author: Felix Vogel
 */
/** */
module Util {

    export function convertCNY(cny: number): string {
        const { selected_currency, custom_currency_rate, custom_currency_name } = ExtensionSettings.settings;

        if (selected_currency == GlobalConstants.BUFF_UTILITY_CUSTOM_CURRENCY) {
            const rate = 1 / Math.max(0.0001, custom_currency_rate);

            function countLeadingZeros(inStr: string): number {
                let count = 0;

                for (let i = 0, l = inStr.length; i < l; i ++) {
                    if (inStr[i] != '0') {
                        break;
                    }

                    count ++;
                }

                return count + Math.max(Math.floor(count / 2), 2);
            }

            let split = `${rate}`.split('.')[1];
            const fixPoint = split[0] != '0' ? 2 : countLeadingZeros(split[1]);

            return `<e title="${GlobalConstants.SYMBOL_YUAN}1 = ${custom_currency_name} ${rate.toFixed(fixPoint)}">CC </e>${(cny * rate).toFixed(fixPoint)}`;
        } else {
            const { rates, symbols } = CurrencyHelper.getData();
            // const selectedRate: [number, number] = rates[selected_currency];
            const [ rate, fixPoint ] = rates[selected_currency];
            const symbol = symbols[selected_currency].length == 0 ? '?' : symbols[selected_currency];

            return `<e title="${GlobalConstants.SYMBOL_YUAN}1 = ${symbol}${rate.toFixed(fixPoint)}">${symbol} </e>${(cny * rate).toFixed(fixPoint)}`;
        }
    }

    /**
     * This will try to parse the given data string into JSON or return object of choice
     *
     * @param data
     */
    export function tryParseJson<T>(data: string | object): T {
        if (typeof data == 'object') {
            return <T><unknown>data;
        }

        if (!data || data.length < 2) {
            return null;
        }

        let result = null;

        try {
            result = JSON.parse(data);
        } catch (e) {
            // string might be encoded?
            try {
                result = JSON.parse(decodeURIComponent(data));
            } catch (e) { }
        }

        return <T>result;
    }

    // --- HTMLBuilder

    export interface TagOptions {
        id?: string;
        class?: string;
        style?: { [key: string]: string };
        attributes?: { [key: string]: string };
        content?: string | string[];
    }

    /**
     * This lets you build html in a easy and nicely manageable way, it supports the most common html
     * attributes while also allowing freedom for any custom ones, and avoids long self typed html strings.
     *
     * @param tag
     * @param options
     */
    export function buildHTML(tag: string, options: TagOptions = {}): string {
        if (!tag || tag.length == 0) return null;

        // options = options ?? {};

        let result: string = `<${tag}`;

        // add common html attributes
        if (options.id && options.id.length > 0) {
            result += ` id="${options.id}"`;
        }

        if (options.class && options.class.length > 0) {
            result += ` class="${options.class}"`;
        }

        let styles = options.style;
        if (styles && Object.keys(styles).length > 0) {
            result += ' style="';
            let keys = Object.keys(styles);
            for (let l_Key of keys) {
                if (l_Key.length > 0) {
                    result += `${l_Key}: ${styles[l_Key]};`;
                }
            }
            result += '"';
        }

        // add other additional attributes
        let attributes = options.attributes;
        if (attributes) {
            let keys = Object.keys(attributes);
            if (keys.length > 0) {
                for (let l_Key of keys) {
                    if (l_Key && l_Key.length > 0) {
                        result += ` ${l_Key}`;

                        let value = attributes[l_Key];
                        if (value && value.length > 0) {
                            result += `="${value}"`;
                        }
                    }
                }
            }
        }

        // Check if the tag can be self closed
        let selfClosing = /area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr/g.test(tag);

        let isPreContentSet = false;

        // If the tag cannot be self closed append pre content
        if (!selfClosing) {
            isPreContentSet = true;
            result += '>';
        }

        // add content, will disable selfClosing as self closing tags cannot have content
        let content = options.content;

        if (content && typeof content == 'string' && content.length > 0) {
            if (!isPreContentSet) {
                // isPreContentSet = true;
                selfClosing = false;

                result += '>';
            }

            result += content;
        } else {
            if (content && content.length > 0) {
                for (let l_Content of <string[]>content) {
                    if (!l_Content || l_Content.length == 0) continue;

                    if (!isPreContentSet) {
                        isPreContentSet = true;
                        selfClosing = false;

                        result += '>';
                    }

                    result += l_Content;
                }
            }
        }

        return `${result}${selfClosing ? '/>' : `</${tag}>`}`;
    }

}
