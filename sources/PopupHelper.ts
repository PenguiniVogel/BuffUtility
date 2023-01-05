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

    export async function expandBargainPopup(): Promise<void> {
        if (!await ExtensionSettings.getSetting(ExtensionSettings.Settings.EXPERIMENTAL_AUTOMATIC_BARGAIN)) {
            return;
        }

        function buff_utility_bargain_mathFunc(listing, minimum, p) {
            return minimum + (listing - minimum) * p;
        }

        function buff_utility_bargain_offer(): void {
            const offerBtn = document.querySelector('#bu_bargain_offer');

            const price = parseFloat(offerBtn.getAttribute('data-price'));
            const minimum = parseFloat(offerBtn.getAttribute('data-minimum'));

            if (!isFinite(price) || !isFinite(minimum)) {
                return;
            }

            let offerP = parseFloat(offerBtn.getAttribute('data-percent'));

            if (!isFinite(offerP)) {
                offerP = 1;
            }

            // clamp to 1 - 99
            offerP = ~~Math.max(1, Math.min(99, offerP)) / 100;

            const offer = buff_utility_bargain_mathFunc(price, minimum, offerP);

            console.debug('[BuffUtility] Bargain offer.', price, minimum, offerP, '->', offer);

            const inputBargain = <HTMLInputElement>document.querySelector('#j_popup_bargain #bargain-price');
            inputBargain.value = `${offer}`;

            // trigger input event
            inputBargain.dispatchEvent(new Event('input', { 'bubbles': true }));
        }

        function buff_utility_bargain_change(factor: number): void {
            const offerBtn = document.querySelector('#bu_bargain_offer');
            let offerP = parseFloat(offerBtn.getAttribute('data-percent'));

            const price = parseFloat(offerBtn.getAttribute('data-price'));
            const minimum = parseFloat(offerBtn.getAttribute('data-minimum'));

            if (!isFinite(price) || !isFinite(minimum)) {
                return;
            }

            if (!isFinite(offerP)) {
                offerP = 1;
            }

            // clamp to 1 - 99
            const newP = ~~Math.max(1, Math.min(99, offerP + factor));

            offerBtn.setAttribute('data-percent', `${newP}`);
            offerBtn.innerHTML = `Offer ${newP}%`;

            const valueFunc = buff_utility_bargain_mathFunc(price, minimum, newP / 100);
            const valueConverted = buff_utility_quickconvertcny(valueFunc);

            document.querySelector('#bu_bargain_price_preview').innerHTML = `¥ ${valueFunc}`;
            document.querySelector('#bu_bargain_converted_price_preview').innerHTML = `(${valueConverted.convertedSymbol} ${valueConverted.convertedValue})`;
        }

        InjectionServiceLib.injectCode(`${buff_utility_bargain_mathFunc.toString()}\n${buff_utility_bargain_offer.toString()}\n${buff_utility_bargain_change.toString()}`, 'body');

        // clamp to 1 - 99
        const default_percentage = Math.max(1, Math.min(await ExtensionSettings.getSetting(ExtensionSettings.Settings.EXPERIMENTAL_AUTOMATIC_BARGAIN_DEFAULT), 99));

        InjectionService.shadowFunction('Popup.show', 'Popup', function (t: string) {
            const valuesElements = <NodeListOf<HTMLElement>>document.querySelectorAll('#j_popup_bargain td.t_Left li.t_Ellipsis span.f_Strong.f_Bold');
            const priceElement = valuesElements.item(0);
            const priceMinimumElement = valuesElements.item(1);

            const parentPriceElement = priceElement.parentElement;
            const parentPriceMinimumElement = priceMinimumElement.parentElement;

            const price = parseFloat((/¥ (\d+(?:\.\d{2})?)/.exec(priceElement.innerText) ?? [])[1]);
            const priceMinimum = parseFloat((/¥ (\d+(?:\.\d{2})?)/.exec(priceMinimumElement.innerText) ?? [])[1]);

            console.debug('[BuffUtility] Read bargain popup.', price, priceMinimum, valuesElements);

            // numbers need to be valid
            if (!isFinite(price) || !isFinite(priceMinimum)) {
                return;
            }

            const convertedPriceElement = parentPriceElement.querySelector('span.c_Gray.f_12px');
            const convertedMinimumPriceElement = parentPriceMinimumElement.querySelector('span.c_Gray.f_12px');

            const convertedPrice = buff_utility_quickconvertcny(price);
            const convertedMinimumPrice = buff_utility_quickconvertcny(priceMinimum);

            convertedPriceElement.innerHTML = `(${convertedPrice.convertedSymbol} ${convertedPrice.convertedValue})`;
            convertedMinimumPriceElement.innerHTML = `(${convertedMinimumPrice.convertedSymbol} ${convertedMinimumPrice.convertedValue})`;

            convertedPriceElement.setAttribute('class', 'c_Gray f_12px');
            convertedMinimumPriceElement.setAttribute('class', 'c_Gray f_12px');

            const offerTable = <HTMLElement>document.querySelector('#j_popup_bargain div.popup-cont > div > table.l_Tb tbody');

            // modify colspan of offer input <td> so it doesn't move
            offerTable.querySelector('#bargain-price').parentElement.parentElement.setAttribute('colspan', '10');

            const tr = document.createElement('tr');

            const initialFunc = buff_utility_bargain_mathFunc(price, priceMinimum, 0.1);
            const initialConverted = buff_utility_quickconvertcny(initialFunc);

            tr.innerHTML = `
                <td width="76" class="c_Gray f_14px">Offer Bargain</td>
                <td width="10"></td>
                <td>
                    <a id="bu_bargain_offer" href="javascript:;" onclick="buff_utility_bargain_offer();" data-price="${price}" data-minimum="${priceMinimum}" data-percent="${default_percentage}" class="i_Btn i_Btn_main">Offer ${default_percentage}%</a>
                </td>
                <td width="10"></td>
                <td>
                    <div style="display: grid; grid-template-columns: 50px 50px; grid-column-gap: 5px; grid-row-gap: 5px;">
                        <button style="width: 50px;" onclick="buff_utility_bargain_change(1);">+ 1%</button>
                        <button style="width: 50px;" onclick="buff_utility_bargain_change(-1);">- 1%</button>
                        <button style="width: 50px;" onclick="buff_utility_bargain_change(5);">+ 5%</button>
                        <button style="width: 50px;" onclick="buff_utility_bargain_change(-5);">- 5%</button>
                    </div>
                </td>
                <td width="10"></td>
                <td>
                    <span id="bu_bargain_price_preview" class="c_Gray f_14px">¥ ${initialFunc}</span>
                    <span id="bu_bargain_converted_price_preview" class="c_Gray f_12px">(${initialConverted.convertedSymbol} ${initialConverted.convertedValue})</span>
                </td>`;

            offerTable.append(tr);

            // find default conversion element, and hide it
            let customPrice = document.querySelector('#j_popup_bargain #bargain-price-custom').parentElement;
            customPrice.setAttribute('style', 'display: none;');

            // inject our own
            const pConvertedLivePrice = document.createElement('p');

            pConvertedLivePrice.setAttribute('class', 'c_Gray f_12px');

            const inputBargainPrice = <HTMLInputElement>document.querySelector('#j_popup_bargain #bargain-price');

            inputBargainPrice.addEventListener('input', () => {
                const convertedLivePrice = buff_utility_quickconvertcny(inputBargainPrice.value);
                pConvertedLivePrice.innerHTML = `(${convertedLivePrice.convertedSymbol} ${convertedLivePrice.convertedValue})`;
            });

            customPrice.parentElement.append(pConvertedLivePrice);
        }, 'after', {
            default_percentage: default_percentage
        });
    }

}
