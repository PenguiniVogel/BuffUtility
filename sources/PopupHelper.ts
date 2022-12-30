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
        let mathFunc: (listing: number, minimum: number, p: number) => number;
        switch (await ExtensionSettings.getSetting(ExtensionSettings.Settings.EXPERIMENTAL_AUTOMATIC_BARGAIN)) {
            case ExtensionSettings.BARGAIN_DISCOUNT_TYPES.NONE:
                return;
            case ExtensionSettings.BARGAIN_DISCOUNT_TYPES.BY_MINIMUM:
                mathFunc = function (listing, minimum, p) {
                    return minimum + (listing - minimum) * p;
                };
                break;
            case ExtensionSettings.BARGAIN_DISCOUNT_TYPES.BY_LISTING:
                mathFunc = function (listing, minimum, p) {
                    return Math.max(minimum, listing - listing * p);
                };
                break;
        }

        InjectionService.shadowFunction('Popup.show', 'Popup', function (t: string) {
            console.debug('Test', t);
        });
    }

}
