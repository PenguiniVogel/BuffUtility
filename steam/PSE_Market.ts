module PSE_Market {

    DEBUG && console.debug('[PSE] Module.PSE_Market');

    // imports
    import Settings = ExtensionSettings.Settings;
    import getSetting = ExtensionSettings.getSetting;

    // module

    const reformatCurrencyRegex = /,(?:--)?/;
    const floatNumberRegex = /(\d+(?:\.\d+)?)/;

    function extractNumber(text: string): number {
        return parseFloat((floatNumberRegex.exec(text.replace(reformatCurrencyRegex, '.')) ?? [])[1]);
    }

    async function init(): Promise<void> {
        const walletInfo: {
            wallet_currency: number
        } = await InjectionService.requestObject('g_rgWalletInfo');
        const steamCurrency = PSE_Currencies.getById(walletInfo.wallet_currency);

        console.debug('[PSE]', walletInfo, steamCurrency);

        if (await getSetting(Settings.PSE_CALCULATE_BUYORDER_SUMMARY)) {
            addBuyOrderSummary(steamCurrency.symbol);
        }

        if (await getSetting(Settings.PSE_BUYORDER_CANCEL_CONFIRMATION)) {
            PSE_Util.addBuyOrderCancelConfirmation();
        }
    }

    async function addBuyOrderSummary(currencySymbol: string): Promise<void> {
        const currentBalance = extractNumber((<HTMLElement>document.querySelector('#marketWalletBalanceAmount,#header_wallet_balance')).innerText);
        const maxBuyOrderBalance = currentBalance * 10;

        const buyOrderTable = <HTMLElement>document.querySelector('#tabContentsMyListings > div:nth-child(2)');
        const buyOrderListings = <NodeListOf<HTMLElement>>buyOrderTable.querySelectorAll('div[id^="mybuyorder_"]');

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
