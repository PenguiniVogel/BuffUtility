module PSE_Market {

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
            addBuyOrderCancelConfirmations();
        }
    }

    async function addBuyOrderSummary(currencySymbol: string): Promise<void> {
        const currentBalance = extractNumber((<HTMLElement>document.querySelector('#marketWalletBalanceAmount,#header_wallet_balance')).innerText);
        const maxBuyOrderBalance = currentBalance * 10;

        const buyOrderTable = <HTMLElement>document.querySelector('#tabContentsMyListings > div:nth-child(2)');
        const buyOrderListings = <NodeListOf<HTMLElement>>buyOrderTable.querySelectorAll('div[id^="mybuyorder_"]');

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

            totalSum += price;

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

        summary.innerHTML = `${totalSum.toFixed(2)} ${currencySymbol} / Max: ${maxBuyOrderBalance} ${currencySymbol}`;

        buyOrderHeader.append(summary);
    }

    function addBuyOrderCancelConfirmations(): void {
        InjectionService.shadowFunction('CancelMarketBuyOrder', 'null', function (buy_orderid: string) {
            const buyOrderQuantity = <HTMLElement>document.querySelector(`#mybuyorder_${buy_orderid} .market_listing_buyorder_qty .market_listing_price`);
            const buyOrderName = <HTMLElement>document.querySelector(`#mbuyorder_${buy_orderid}_name`);

            return confirm(`Do you really want to remove ${buyOrderQuantity.innerText.trim()} buy order(s) for: ${buyOrderName.innerText.trim()}`);
        }, 'custom');
    }

    init();

}
