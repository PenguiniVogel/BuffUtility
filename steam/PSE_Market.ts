module PSE_Market {

    DEBUG && console.debug('[PSE] Module.PSE_Market');

    // imports
    import Settings = ExtensionSettings.Settings;
    import getSetting = ExtensionSettings.getSetting;

    // module

    interface SellOrderMergeData {
        url: string,
        image: string,
        imageSrcset: string,
        color: string,
        name: string,
        game: string,
        appid: string,
        sElementPrefix: string,
        priceBuyer: string,
        priceYou: string,
        listedOn: string,
        listingid: string,
        contextid: string,
        itemid: string
    }

    const reformatCurrencyRegex = /,(?:--)?/;
    const floatNumberRegex = /(\d+(?:\.\d+)?)/;

    function extractNumber(text: string): number {
        return parseFloat((floatNumberRegex.exec(text.replace(reformatCurrencyRegex, '.')) ?? [])[1]);
    }

    async function init(): Promise<void> {
        window.addEventListener(GlobalConstants.BUFF_UTILITY_INJECTION_SERVICE, async (e: CustomEvent<InjectionService.TransferData<unknown>>) => {
            if (e.detail.url.indexOf('mylistings/render/?query=') > -1) {
                if (await getSetting(Settings.PSE_MERGE_ACTIVE_LISTINGS)) {
                    mergeActiveListings();
                }
            }

            if (e.detail.url.endsWith('/market/myhistory') || e.detail.url.endsWith('/market/myhistory/')) {
                if (await getSetting(Settings.PSE_ADVANCED_PAGE_NAVIGATION)) {
                    // TODO
                }
            }
        });

        const walletInfo: {
            wallet_currency: number
        } = await InjectionService.requestObject('g_rgWalletInfo');
        const steamCurrency = PSE_Currencies.getById(walletInfo.wallet_currency);

        console.debug('[PSE]', walletInfo, steamCurrency);

        if (await getSetting(Settings.PSE_MERGE_ACTIVE_LISTINGS)) {
            mergeActiveListings();
        }

        addBuyOrderSummaryAndScrolling(steamCurrency.symbol);

        if (await getSetting(Settings.PSE_BUYORDER_CANCEL_CONFIRMATION)) {
            PSE_Util.addBuyOrderCancelConfirmation();
        }
    }

    async function mergeActiveListings(): Promise<void> {
        function pse_remove_mergedListing(element: SellOrderMergeData[], all: boolean): void {
            console.debug(element, all);

        }

        InjectionServiceLib.injectCode(pse_remove_mergedListing.toString(), 'body');

        const sellOrderTable = document.querySelector('div.market_listing_row[id^="mylisting_"]')?.parentElement;

        // no sell-orders, skip
        if (!sellOrderTable) {
            return;
        }

        const sellOrderListings = <NodeListOf<HTMLElement>>sellOrderTable.querySelectorAll('div.market_listing_row[id^="mylisting_"]');

        // no sell-orders, skip
        if (sellOrderListings?.length == 0) {
            return;
        }

        const merged: {
            [url: string]: SellOrderMergeData[]
        } = {};

        for (let i = 0, l = sellOrderListings.length; i < l; i ++) {
            const row = sellOrderListings.item(i);

            const itemNameAndLink = <HTMLElement>row.querySelector('span[id^="mylisting_"] a.market_listing_item_name_link');
            const url = itemNameAndLink.getAttribute('href');
            const image = row.querySelector('img[id^="mylisting_"]').getAttribute('src');
            const imageSrcset = row.querySelector('img[id^="mylisting_"]').getAttribute('srcset');
            const color = itemNameAndLink.parentElement.style['color'];
            const name = itemNameAndLink.innerText.trim();
            const game = (<HTMLElement>row.querySelector('span.market_listing_game_name')).innerText.trim();
            const listedOn = (<HTMLElement>row.querySelector('.market_listing_listed_date')).innerText.trim();

            const priceTable = <NodeListOf<HTMLElement>>row.querySelectorAll('.market_table_value > .market_listing_price > span span');
            const priceBuyer = priceTable.item(0).innerText.trim();
            const priceYou = priceTable.item(1).innerText.trim();

            const removeListing = row.querySelector('.market_listing_cancel_button > a[href]').getAttribute('href').replace(/^javascript:RemoveMarketListing\(|'| |\)$/g, '');
            const split = removeListing.split(',');

            if (!(url in merged)) {
                merged[url] = [];
            }

            const nPriceBuyer = `${extractNumber(priceBuyer)}`;
            const nPriceYou = `${extractNumber(priceYou)}`;

            merged[url].push({
                url: url,
                image: image,
                imageSrcset: imageSrcset,
                color: color,
                name: name,
                game: game,
                priceBuyer: `${nPriceBuyer}`,
                priceYou: `${nPriceYou}`,
                listedOn: listedOn,
                sElementPrefix: split[0],
                listingid: split[1],
                appid: split[2],
                contextid: split[3],
                itemid: split[4]
            });

            row.setAttribute('style', 'display: none');
        }

        DEBUG && console.debug('[PSE]', merged);

        const quantityHeader = document.createElement('div');

        quantityHeader.setAttribute('class', 'market_listing_right_cell market_listing_my_price');
        quantityHeader.innerHTML = 'QUANTITY';

        document.querySelector('#tabContentsMyActiveMarketListingsTable .market_listing_table_header .market_listing_my_price').before(quantityHeader);

        function _next(url: string): void {
            const pick = merged[url][0];
            const block = merged[url].filter(x => x.listedOn == pick.listedOn && x.priceYou == pick.priceYou);

            const newRow = document.createElement('div');
            newRow.setAttribute('class', 'market_listing_row market_recent_listing_row');

            newRow.innerHTML = `
    <img src="${pick.image}" srcset="${pick.imageSrcset}" style="border-color: ${pick.color};" class="market_listing_item_img economy_item_hoverable" alt="" />
    <div class="market_listing_right_cell market_listing_edit_buttons placeholder"></div>
    <div class="market_listing_right_cell market_listing_my_price">
        <span class="market_table_value">
            <span class="market_listing_price">${block.length}</span>
        </span>
    </div>
    <div class="market_listing_right_cell market_listing_my_price">
        <span class="market_table_value">
            <span class="market_listing_price">
                <span style="display: inline-block;">
                    <span title="This is the price the buyer pays.">${pick.priceBuyer}</span>
                    <br>
                    <span title="This is how much you will receive." style="color: #AFAFAF;"> (${pick.priceYou}) </span>
                </span>
            </span>
        </span>
    </div>
    <div class="market_listing_right_cell market_listing_listed_date can_combine">${pick.listedOn}</div>
    
    <div class="market_listing_item_name_block">
        <span class="market_listing_item_name economy_item_hoverable" style="color: ${pick.color};">
            <a class="market_listing_item_name_link" href="${pick.url}">${pick.name}</a>
        </span>
        <br>
        <span class="market_listing_game_name">${pick.name}</span>
        <div class="market_listing_listed_date_combined">Listed: ${pick.listedOn}</div>
    </div>
    
    <div class="market_listing_edit_buttons actual_content">
        <div class="market_listing_cancel_button">
            <!-- href="javascript:RemoveMarketListing('mylisting', '3556153482729383973', 232090, '2', '3515621086022428816')" -->
            <a href="javascript:pse_remove_mergedListing(${JSON.stringify(block).replace(/"/g, '\'')}, false);" class="item_market_action_button item_market_action_button_edit nodisable">
                <span class="item_market_action_button_edge item_market_action_button_left"></span>
                <span class="item_market_action_button_contents">Remove</span>
                <span class="item_market_action_button_edge item_market_action_button_right"></span>
                <span class="item_market_action_button_preload"></span>
            </a>
        </div>
    </div>
    <div style="clear: both;"></div>`;

            sellOrderTable.append(newRow);

            merged[url] = merged[url].filter(x => block.every(b => x.listingid != b.listingid));

            if (merged[url].length > 0) {
                _next(url);
            }
        }

        const keys = Object.keys(merged);
        for (let key of keys) {
            _next(key);
        }
    }

    async function addBuyOrderSummaryAndScrolling(currencySymbol: string): Promise<void> {
        const buyOrderTable = document.querySelector('div.market_listing_row[id^="mybuyorder_"]')?.parentElement;

        // no buy-orders, skip
        if (!buyOrderTable) {
            return;
        }

        const buyOrderListings = <NodeListOf<HTMLElement>>buyOrderTable.querySelectorAll('div.market_listing_row[id^="mybuyorder_"]');

        // no buy-orders, skip
        if (buyOrderListings?.length == 0) {
            return;
        }

        // buy-order scrolling and filtering
        if (await getSetting(Settings.PSE_BUYORDER_SCROLLING)) {
            buyOrderTable.setAttribute('style', 'overflow: hidden auto; max-height: 50vh;');

            const nameHeader = <HTMLElement>buyOrderTable.querySelector('div.market_listing_table_header span.market_listing_header_namespacer').parentElement;
            const filterInput = document.createElement('input');

            filterInput.setAttribute('type', 'text');
            filterInput.setAttribute('placeholder', 'Search...');
            filterInput.setAttribute('style', 'margin-left: 10px;');

            let lastValue = '';
            filterInput.addEventListener('keyup', () => {
                let value = (filterInput.value ?? '').replace(/\s/g, '').toLocaleLowerCase();

                // avoid running multiple times for the same search term
                if (value == lastValue) {
                    return;
                }

                lastValue = value;

                for (let i = 0, l = buyOrderListings.length; i < l; i ++) {
                    const buyOrderListing = buyOrderListings.item(i);
                    let name = (<HTMLElement>buyOrderListing.querySelector('[id^="mbuyorder_"].market_listing_item_name a')).innerText.toLocaleLowerCase();

                    // replace special characters
                    name = name.replace(/★|™|\s|\||\(|\)/g, '');

                    DEBUG && console.debug('[PSE] Filter buy-orders', name, 'term:', value, 'check:', name.indexOf(value) == -1, '|', value.indexOf(name) == -1, '|', PSE_Util.stringSimilarity(value, name));

                    if (name.indexOf(value) == -1 && value.indexOf(name) == -1 && PSE_Util.stringSimilarity(value, name) < 0.5) {
                        buyOrderListing.setAttribute('style', 'display: none;');
                    } else {
                        buyOrderListing.setAttribute('style', '');
                    }
                }
            });

            nameHeader.append(filterInput);
        }

        // don't execute actual summary part if disabled
        if (!await getSetting(Settings.PSE_CALCULATE_BUYORDER_SUMMARY)) {
            return;
        }

        const currentBalance = extractNumber((<HTMLElement>document.querySelector('#marketWalletBalanceAmount,#header_wallet_balance')).innerText);
        const maxBuyOrderBalance = currentBalance * 10;

        // summary
        let totalSum = 0;

        for (let i = 0, l = buyOrderListings.length; i < l; i ++) {
            const row = buyOrderListings.item(i);

            // first in dom as the div order is reversed (steam magic whoever thought this system up)
            const priceColumn = <HTMLElement>row.querySelector('.market_listing_my_price .market_listing_price');
            const quantityColumn = <HTMLElement>row.querySelector('.market_listing_buyorder_qty .market_listing_price');

            // empty this element to prevent innerText weirdness
            priceColumn.querySelector('.market_listing_inline_buyorder_qty').innerHTML = '';

            const price = extractNumber(priceColumn.innerText);
            const quantity = parseInt(quantityColumn.innerText);

            totalSum += price * quantity;

            priceColumn.innerHTML = `
                    <div>${(price * quantity).toFixed(2)}${currencySymbol}</div>
                    <div style="border-top: 1px solid; color: ${maxBuyOrderBalance > totalSum ? 'green' : 'red'};">
                        ${totalSum.toFixed(2)}${currencySymbol}
                    </div>`;
        }

        // add max buy orders header
        const buyOrderHeader = buyOrderTable.querySelector('h3.my_market_header');

        const summary = document.createElement('span');

        summary.setAttribute('class', 'my_market_header_count');

        summary.innerHTML = `${totalSum.toFixed(2)} ${currencySymbol} / Max: ${maxBuyOrderBalance.toFixed(2)} ${currencySymbol}`;

        buyOrderHeader.append(summary);
    }

    init();

}
