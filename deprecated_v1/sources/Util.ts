/**
 * Author: Felix Vogel
 */
/** */
module Util {

    export function parseJson<T extends object>(_in: XMLHttpRequest | string): T {
        if (typeof _in == 'string') {
            return JSON.parse(_in);
        }

        return JSON.parse(_in.responseText);
    }

    export function getGoodsId(_in: string): string {
        return (/goods_id=\d+/.exec(_in)[0] ?? 'goods_id=-1').substr('goods_id='.length);
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
