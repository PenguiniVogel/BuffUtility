module Util {

    DEBUG && console.debug('[BuffUtility] Module.Util');

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
            const { wallet_fee_base, wallet_fee_percent, wallet_fee_minimum } = ExtensionSettings.STEAM_SETTINGS;

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

        const { wallet_fee_base, wallet_fee_percent } = ExtensionSettings.STEAM_SETTINGS;

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
     * @deprecated Please use {@link convertCNYRaw}
     * Convert the specified cny value to the selected currency
     *
     * @param cny
     * @returns <e title="¥1 = currency_symbol rate">currency_symbol</e>(cny * rate).toFixed(fixPoint)
     */
    export async function convertCNY(cny: number): Promise<string> {
        throw new Error('[BuffUtility] Util.convertCNY is obsolete, please use Util.convertCNYRaw');
    }

    /**
     * Return type for {@link convertCNYRaw}
     */
    interface ReturnConvertCNYRaw {
        /**
         * The currency symbol
         */
        convertedSymbol: string,

        /**
         * The converted value
         */
        convertedValue: string,

        /**
         * The converted formatted value <br>
         * e.g. {@link ExtensionSettings.Settings.EXPERIMENTAL_FORMAT_CURRENCY EXPERIMENTAL_FORMAT_CURRENCY} = false -> 1234<small>.56</small> <br>
         * e.g. {@link ExtensionSettings.Settings.EXPERIMENTAL_FORMAT_CURRENCY EXPERIMENTAL_FORMAT_CURRENCY} = true -> 1,234<small>.56</small> <br>
         */
        convertedFormattedValue: string,

        /**
         * The original converted number
         */
        convertedValueRaw: number,

        /**
         * The currency we converted to
         */
        convertedName: string,

        /**
         * The rate we converted with
         */
        convertedRate: number,

        /**
         * How many fraction zeros should be preserved, 2+
         */
        convertedLeadingZeros: number
    }

    /**
     * Convert the specified cny value to the selected currency
     *
     * @param cny
     * @returns {@link ReturnConvertCNYRaw}
     */
    export async function convertCNYRaw(cny: number | string): Promise<ReturnConvertCNYRaw> {
        if (typeof cny == 'string') {
            cny = parseFloat(cny);
        }

        const selected_currency = await ExtensionSettings.getSetting(ExtensionSettings.Settings.SELECTED_CURRENCY);

        if (selected_currency == GlobalConstants.BUFF_UTILITY_CUSTOM_CURRENCY) {
            const custom_currency_name = await ExtensionSettings.getSetting(ExtensionSettings.Settings.CUSTOM_CURRENCY_NAME);
            const custom_currency_calculated_rate = 1 / await ExtensionSettings.getSetting(ExtensionSettings.Settings.CUSTOM_CURRENCY_RATE);
            const custom_currency_leading_zeros = Math.max(2, (/^0\.([^1-9]+)/.exec(`${custom_currency_calculated_rate}`) ?? [null, ''])[1].length);
            const calculated = cny * custom_currency_calculated_rate;

            return {
                convertedSymbol: custom_currency_name,
                convertedValue: calculated.toFixed(custom_currency_leading_zeros),
                convertedFormattedValue: await Util.formatNumber(calculated, custom_currency_leading_zeros),
                convertedValueRaw: calculated,
                convertedName: custom_currency_name,
                convertedRate: custom_currency_calculated_rate,
                convertedLeadingZeros: custom_currency_leading_zeros
            };
        } else {
            const { rates, symbols } = CurrencyHelper.getData();
            const [ rate, fixPoint ] = rates[selected_currency];
            const symbol = symbols[selected_currency].length == 0 ? '?' : symbols[selected_currency];
            const calculated = cny * rate;

            return {
                convertedSymbol: symbol,
                convertedValue: calculated.toFixed(fixPoint),
                convertedFormattedValue: await Util.formatNumber(calculated, fixPoint),
                convertedValueRaw: calculated,
                convertedName: selected_currency,
                convertedRate: rate,
                convertedLeadingZeros: fixPoint
            };
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
        content?: string[];
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
        if (Array.isArray(content) && content.length > 0) {
            for (let l_Content of content) {
                if (!l_Content || typeof l_Content != 'string' || l_Content.length == 0) continue;

                if (!isPreContentSet) {
                    isPreContentSet = true;
                    selfClosing = false;

                    result += '>';
                }

                result += l_Content;
            }
        }

        // if (content && typeof content == 'string' && content.length > 0) {
        //     if (!isPreContentSet) {
        //         // isPreContentSet = true;
        //         selfClosing = false;
        //
        //         result += '>';
        //     }
        //
        //     result += content;
        // } else {
        //     if (Array.isArray(content) && content.length > 0) {
        //         for (let l_Content of <string[]>content) {
        //             if (!l_Content || l_Content.length == 0) continue;
        //
        //             if (!isPreContentSet) {
        //                 isPreContentSet = true;
        //                 selfClosing = false;
        //
        //                 result += '>';
        //             }
        //
        //             result += l_Content;
        //         }
        //     }
        // }

        return `${result}${selfClosing ? '/>' : `</${tag}>`}`;
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

    // format number

    export async function formatNumber(inNum: number | string, fractionDigits: number = 2): Promise<string> {
        if (typeof inNum == 'string') {
            inNum = parseFloat(inNum);
        }

        if ((await ExtensionSettings.getSetting(ExtensionSettings.Settings.EXPERIMENTAL_FORMAT_CURRENCY))) {
            return Util.embedDecimalSmall(new Intl.NumberFormat('en-US', {
                maximumFractionDigits: fractionDigits
            }).format(inNum));
        } else {
            return Util.embedDecimalSmall(inNum.toFixed(fractionDigits));
        }
    }

    // !gen/!gengl generation code

    export function generateInspectGen(weapon: SchemaTypes.Weapon, paintIndex: any, paintSeed: any, paintWear: any, stickers: { slot: number, sticker_id: any, wear: any }[]): string {
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

    // <a> action injection

    export function addAnchorShareAction(classid: string, instanceid: string, assetid: string, sellOrderId: string): HTMLElement {
        const aShare = document.createElement('a');
        aShare.setAttribute('style', 'cursor: pointer;');
        aShare.setAttribute('href', `https://buff.163.com/market/m/item_detail?classid=${classid}&instanceid=${instanceid}&game=csgo&assetid=${assetid}&sell_order_id=${sellOrderId}`);
        aShare.setAttribute('target', '_blank');
        aShare.innerHTML = '<i class="icon icon_link j_tips_handler" data-direction="bottom" data-title="Share"></i>';

        return aShare;
    }

    export async function addAnchorToastAction(a: HTMLElement, text: string): Promise<void> {
        if (await ExtensionSettings.getSetting(ExtensionSettings.Settings.SHOW_TOAST_ON_ACTION)) {
            a.setAttribute('href', `javascript:Buff.toast('${text}');`);
        } else {
            a.setAttribute('href', 'javascript:;');
        }
    }

    export function addAnchorClipboardAction(a: HTMLElement, text: string): void {
        a.addEventListener('click', () => {
            navigator?.clipboard?.writeText(text).then(() => {
                // alert(`Copied ${gen} to clipboard!`);
                console.debug(`[BuffUtility] Copied: ${text}`);
            }).catch((e) => console.error('[BuffUtility]', e));
        });
    }

    /**
     * Embed decimals in a <small></small> element
     *
     * @param inStr
     */
    export function embedDecimalSmall(inStr: string): string {
        if (inStr.indexOf('.') == -1) return inStr;
        return inStr.replace(/(\d+)\.(\d+)/, `$1<small>.$2</small>`);
    }

    // signal

    export function signal(callOrder: string[], thisArg: any = null, args: any = null): void {
        window.postMessage([GlobalConstants.BUFF_UTILITY_SIGNAL, callOrder, thisArg, args], '*');
    }

    // get account balance

    /**
     * Get account balance, if user is not logged in, we will receive <br>
     * <code>
     * {
     *     strBalance: '',
     *     isBalanceYuan: false,
     *     nrBalance: 0
     * }
     * </code>
     */
    export function getAccountBalance(): {
        strBalance: string,
        isBalanceYuan: boolean,
        nrBalance: number
    } {
        // if user is not logged in, we can't read their balance
        if (!document.querySelector('#navbar-cash-amount')) {
            return {
                strBalance: '',
                isBalanceYuan: false,
                nrBalance: 0
            };
        }

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

    /**
     * Converts a boolean array to a number, or the binary equivalent. <br>
     * Example: <br>
     * Test data: <code>[false, true, false, true, true]</code> <br>
     * Will then result in: <code>43</code> or the binary equivalent of <code>101011</code> <br>
     * As you may realize, there is 6 binary digits when we only provided 5 values, why is that? <br>
     * Explanation: <br>
     * 1 - the sign bit, this is appended at the beginning to keep leading zeros if the array starts with <code>false</code> values. <br>
     * 0 - <code>value[0]</code> -> <code>false</code> <br>
     * 1 - <code>value[1]</code> -> <code>true</code> <br>
     * 0 - <code>value[2]</code> -> <code>false</code> <br>
     * 1 - <code>value[3]</code> -> <code>true</code> <br>
     * 1 - <code>value[4]</code> -> <code>true</code> <br>
     * Resulting in the input values.
     *
     * @param data The input boolean array
     */
    export function exportBooleansToBytes(data: boolean[]): number {
        // data isn't an array and definitely not something we should process
        if (!(typeof data == 'object' && data?.length >= 0)) {
            return 0;
        }

        let byte = 1;

        for (let i = 0, l = data.length; i < l; i ++) {
            let value = data[i];
            if (typeof value != 'boolean') {
                console.warn('[BuffUtility] Provided value:', value, 'at index:', i, 'was not a boolean, converting ->', !!value);
                value = !!value;
            }

            byte = (byte << 1) | (value ? 1 : 0);
        }

        return byte;
    }

    export function importBooleansFromBytes(data: number): boolean[] {
        // if input data is not a number or less than 2 ( 10 in binary ) return empty array
        if (typeof data != 'number' || data < 2) {
            return [];
        }

        let radix = data.toString(2);

        // if input bits are less than 2 it is only the signature bit, therefor empty
        if (radix?.length < 2) {
            return [];
        }

        // if the while loop exceeds 64 executions (a number is only 32 bit max), something is definitely wrong, and we should stop
        let infiniteBreak = 64;

        // sets the index of the array to the length of the binary string shifted by one to exclude the sign bit
        let index = radix.length - 1;

        let imported: boolean[] = [];

        // Since the array gets generated from first to last value, we need to transverse backwards, as we read the last value first
        while (data > 1 && index > -1 && infiniteBreak > 0) {
            imported[index - 1] = !!(data & 1);

            data = data >> 1;

            index --;
            infiniteBreak --;
        }

        return imported;
    }

}

module PopupHelper {

    export function setup(): void {
        // if already added, don't add again
        if (document.querySelector('#buff_utility_popup') != null) {
            return;
        }

        const popup_html = `
<div class="popup" id="buff_utility_popup" style="width: 600px; margin-left: -300px; margin-top: -182px; z-index: 503; display: none;">
    <div class="popup-header">
        <h2>BuffUtility</h2>
    </div>
    <a class="popup-close" href="javascript:;" onclick="Popup.hide();">×</a>
    <div class="popup-cont">
        <div class="popup-good-summary"></div>
    </div>
    <div class="popup-bottom black">
        <table width="100%" cellspacing="0" cellpadding="0">
        <tbody>
            <tr>
                <td></td>
                <td>
                    <a id="buff_utility_popup_confirm" href="javascript:;" class="i_Btn i_Btn_main i_Btn_disabled">Confirm</a>
                </td>
            </tr>
        </tbody>
        </table>
    </div>
</div>`;

        let storeE = document.createElement('e');

        storeE.innerHTML = popup_html;

        document.querySelector('html > body').append(storeE);
    }

    export function show(content: any, options?: {
        onconfirm: () => void
    }): void {
        // add necessary stuff
        PopupHelper.setup();

        // if not added, don't execute
        if (document.querySelector('#buff_utility_popup') == null) {
            console.warn('[BuffUtility] Popup is not initialized.');
            return;
        }

        document.querySelector('#buff_utility_popup div.popup-good-summary').innerHTML = content;

        document.getElementById('buff_utility_popup_confirm').onclick = options?.onconfirm ?? (() => {});

        Util.signal(['Popup', 'show'], 'Popup', 'buff_utility_popup');
    }

    export function hide(): void {
        Util.signal(['Popup', 'hide'], 'Popup', null);
    }

}
