module PSE_Listings {

    DEBUG && console.debug('%c■', 'color: #0000ff', '[PSE] Module.PSE_Listings');

    // imports
    import Settings = ExtensionSettings.Settings;
    import getSetting = ExtensionSettings.getSetting;

    // module

    async function init(): Promise<void> {
        if (!await getSetting(Settings.MODULE_PSE_LISTINGS)) {
            console.debug('%c■', 'color: #ff0000', '[BuffUtility] PSE_Listings - disabled');
            return;
        } else {
            console.debug('%c■', 'color: #00ff00', '[BuffUtility] PSE_Listings');
        }

        if (await getSetting(Settings.PSE_BUYORDER_CANCEL_CONFIRMATION)) {
            PSE_Util.addBuyOrderCancelConfirmation();
        }

        if (await getSetting(Settings.PSE_ADD_VIEW_ON_BUFF)) {
            addViewOnBuff();
        }

        // if (await getSetting(Settings.PSE_FORCE_ITEM_ACTIVITY)) {
        //     addForceItemActivity();
        // }
    }

    async function addViewOnBuff(): Promise<void> {
        const windowHref = window?.location?.href ?? '';
        const link_match = (/730\/(.*)[?#]?/g.exec(windowHref) ?? [])[1];

        // we aren't on 730, or we don't have a valid capture
        if (!link_match) {
            return;
        }

        const itemName = decodeURIComponent(link_match);

        const buffId = (await BrowserInterface.delegate<BrowserInterface.BuffSchemaGetIdOrNameDelegation, string>({
            method: BrowserInterface.DelegationMethod.BuffSchema_get,
            parameters: {
                name: itemName
            }
        })).data;

        const aViewOnBuff = document.createElement('a');

        aViewOnBuff.setAttribute('class', 'btn_small btn_grey_white_innerfade');
        aViewOnBuff.setAttribute('target', '_blank');

        if (buffId) {
            DEBUG && console.debug('[PSE] 730 ->', itemName, buffId);

            aViewOnBuff.setAttribute('href', `https://buff.163.com/goods/${buffId}?from=market#tab=selling&sort_by=default`);
        } else {
            const special_quality = /^(★(?: StatTrak™)?|StatTrak™|Souvenir)/g.exec(itemName) ?? [null, '-1'];

            let transformedItemName = itemName;
            switch (special_quality[1]) {
                case '★':
                case '★ StatTrak™':
                case 'StatTrak™':
                case 'Souvenir':
                    transformedItemName = itemName.substring(special_quality[1].length + 1);
                    break;
                case '-1':
                    break;
            }

            let transformedSpecialQuality = '';
            switch (special_quality[1]) {
                case '★':
                    transformedSpecialQuality = 'unusual';
                    break;
                case '★ StatTrak™':
                    transformedSpecialQuality = 'unusual_strange';
                    break;
                case 'StatTrak™':
                    transformedSpecialQuality = 'strange';
                    break;
                case 'Souvenir':
                    transformedSpecialQuality = 'tournament';
                    break;
                case '-1':
                    transformedSpecialQuality = 'normal';
                    break;
            }

            let wear_test = /Factory New|Minimal Wear|Field-Tested|Well-Worn|Battle-Scarred/gi.test(itemName);

            DEBUG && console.debug('[PSE] 730 ->', itemName, special_quality[1], itemName, wear_test, transformedItemName, transformedSpecialQuality);

            aViewOnBuff.setAttribute('href', `https://buff.163.com/market/csgo#tab=selling&page_num=1&search=${encodeURIComponent(transformedItemName)}${wear_test ? `&quality=${transformedSpecialQuality}` : ''}`);
        }

        aViewOnBuff.innerHTML = `<span style="background: #2e2a35; color: #ddb362;">View on BUFF</span>`;

        document.querySelector('#largeiteminfo_item_actions').append(aViewOnBuff);
    }

    function addForceItemActivity(): void {
        /*
        <div id="market_activity_section">
            <h3 class="market_activity_header">Recent activity</h3>
            <div id="market_activity_block">
                <div id="market_activity_waiting_text">Waiting for new activity...</div>
            </div>
        </div>
         */
    }

    init();

}
