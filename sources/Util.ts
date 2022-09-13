/**
 * Author: Felix Vogel
 */
/** */
module Util {

    // imports
    import Settings = ExtensionSettings.Settings;

    // module

    /**
     * Calculate the steam seller price <br>
     * Stolen and slightly optimized from Steams' economy_common.js
     *
     * @param amount
     * @param publisherFee
     */
    export function calculateSellerPrice(amount: number, publisherFee: number = 0.1): { steam_fee: number, publisher_fee: number, fees: number, amount: number } {

        /**
         * Get the fees
         *
         * @param receivedAmount
         * @param publisherFee
         */
        function getFees(receivedAmount: number, publisherFee: number): { steam_fee: number, publisher_fee: number, fees: number, amount: number } {
            const { wallet_fee_base, wallet_fee_percent, wallet_fee_minimum } = ExtensionSettings.steam_settings;

            let nSteamFee = Math.floor(Math.max(receivedAmount * wallet_fee_percent, wallet_fee_minimum) + wallet_fee_base);
            let nPublisherFee = Math.floor(publisherFee > 0 ? Math.max(receivedAmount * publisherFee, 1) : 0);
            let nAmountToSend = receivedAmount + nSteamFee + nPublisherFee;

            return {
                steam_fee: nSteamFee,
                publisher_fee: nPublisherFee,
                fees: nSteamFee + nPublisherFee,
                amount: ~~nAmountToSend
            };
        }

        const { wallet_fee_base, wallet_fee_percent } = ExtensionSettings.steam_settings;

        // Since getFees has a Math.floor, we could be off a cent or two. Let's check:
        let iterations = 0; // shouldn't be needed, but included to be sure nothing unforeseen causes us to get stuck
        let estimatedReceivedValue = (amount - wallet_fee_base) / (wallet_fee_percent + publisherFee + 1);

        let undershot = false;
        let fees = getFees(estimatedReceivedValue, publisherFee);

        while (fees.amount != amount && iterations < 10) {
            if (fees.amount > amount) {
                if (undershot) {
                    fees = getFees(estimatedReceivedValue - 1, publisherFee);
                    fees.steam_fee += (amount - fees.amount);
                    fees.fees += (amount - fees.amount);
                    fees.amount = amount;

                    break;
                } else {
                    estimatedReceivedValue --;
                }
            } else {
                undershot = true;
                estimatedReceivedValue ++;
            }

            fees = getFees(estimatedReceivedValue, publisherFee);
            iterations ++;
        }

        return fees;
    }

    /**
     * Count leading 0 (zero) of a string
     *
     * @param inStr
     */
    export function countLeadingZeros(inStr: string) {
        // console.debug(`[BuffUtility] countLeadingZeros of '${inStr}' w/ ${/^(0+)[1-9]/.exec(inStr)} -> ${Math.max((/^(0+)[1-9]/.exec(inStr) ?? [])[1]?.length ?? 2, 2)}`);
        return Math.max((/^(0+)[1-9]/.exec(inStr) ?? [])[1]?.length ?? 2, 2);
    }

    /**
     * Convert the specified cny value to the selected currency
     *
     * @param cny
     */
    export function convertCNY(cny: number): string {
        const selected_currency = storedSettings[Settings.SELECTED_CURRENCY];

        if (selected_currency == GlobalConstants.BUFF_UTILITY_CUSTOM_CURRENCY) {
            const custom_currency_name = storedSettings[Settings.CUSTOM_CURRENCY_NAME],
                custom_currency_calculated_rate = storedSettings[Settings.CUSTOM_CURRENCY_CALCULATED_RATE],
                custom_currency_leading_zeros = storedSettings[Settings.CUSTOM_CURRENCY_LEADING_ZEROS];

            return `<e title="${GlobalConstants.SYMBOL_YUAN}1 = ${custom_currency_name} ${custom_currency_calculated_rate.toFixed(custom_currency_leading_zeros)}">CC </e>${(cny * custom_currency_calculated_rate).toFixed(custom_currency_leading_zeros)}`;
        } else {
            const { rates, symbols } = CurrencyHelper.getData();
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
     * This lets you build html in an easy and nicely manageable way, it supports the most common html
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

        // add content, will disable selfClosing as self-closing tags cannot have content
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

    // string compare

    export function pStrCompare(first, second): number {
        first = first.replace(/\s+/g, '');
        second = second.replace(/\s+/g, '');

        if (first === second) return 1;
        if (first.length < 2 || second.length < 2) return 0;

        let firstBigrams = {};
        for (let i = 0; i < first.length - 1; i++) {
            const bigram = first.substring(i, i + 2);
            firstBigrams[bigram] = firstBigrams[bigram] ? firstBigrams[bigram] + 1 : 1;
        }

        let intersectionSize = 0;
        for (let i = 0; i < second.length - 1; i++) {
            const bigram = second.substring(i, i + 2);
            const count = firstBigrams[bigram] ? firstBigrams[bigram] : 0;

            if (count > 0) {
                firstBigrams[bigram] = count - 1;
                intersectionSize ++;
            }
        }

        return (2.0 * intersectionSize) / (first.length + second.length - 2);
    }

    // format Date

    export function formatDate(inDate: Date, format: string = 'yyyy-mm-dd'): string {
        let year: string = `${inDate.getFullYear()}`;
        let month: string = (inDate.getMonth() + 1) < 10 ? `0${inDate.getMonth() + 1}` : `${inDate.getMonth() + 1}`;
        let day: string = inDate.getDate() < 10 ? `0${inDate.getDate()}` : `${inDate.getDate()}`;

        return format
            .replace('yyyy', year)
            .replace('mm', month)
            .replace('dd', day);
    }

    // !gen/!gengl generation code

    export function generateInspectGen(weapon: SchemaHelper.Weapon, paintIndex: any, paintSeed: any, paintWear: any, stickers: { slot: number, sticker_id: any, wear: any }[]): string {
        if (weapon) {
            if (weapon?.type == 'Gloves') {
                // !gengl weapon_id paint_id pattern float
                return `!gengl ${weapon.id} ${paintIndex} ${paintSeed} ${paintWear}`;
            } else {
                // !gen weapon_id paint_id pattern float sticker1 wear1...
                let gen = `!gen ${weapon.id} ${paintIndex} ${paintSeed} ${paintWear}`;
                if (stickers?.length > 0) {
                    let str_stickers: string[] = ['0 0', '0 0', '0 0', '0 0'];
                    for (let l_sticker of stickers) {
                        str_stickers[l_sticker.slot] = `${l_sticker.sticker_id} ${l_sticker.wear}`;
                    }
                    gen += ` ${str_stickers.join(' ')}`;
                }

                return gen;
            }
        }

        return '';
    }

    // signal

    export function signal(callOrder: string[], thisArg: any = null, args: any[] = []): void {
        window.postMessage([GlobalConstants.BUFF_UTILITY_SIGNAL, callOrder, thisArg, args], '*');
    }

    // get account balance

    export function getAccountBalance(): {
        strBalance: string,
        isBalanceYuan: boolean,
        nrBalance: number
    } {
        let strBalance = (<HTMLElement>document.querySelector('#navbar-cash-amount')).innerText;
        let isBalanceYuan = strBalance.indexOf('¥') > -1;
        let nrBalance = isBalanceYuan ? +(strBalance.replace('¥', '')) : 0;

        console.debug('[BuffUtility] Balance:', strBalance, '->', isBalanceYuan, '->', nrBalance);

        return {
            strBalance: strBalance,
            isBalanceYuan: isBalanceYuan,
            nrBalance: nrBalance
        };
    }

}
