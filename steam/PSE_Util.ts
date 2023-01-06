module PSE_Util {

    export function addBuyOrderCancelConfirmation(): void {
        InjectionService.shadowFunction('CancelMarketBuyOrder', 'null', function (buy_orderid: string) {
            const buyOrderQuantity = <HTMLElement>document.querySelector(`#mybuyorder_${buy_orderid} .market_listing_buyorder_qty .market_listing_price`);
            const buyOrderName = <HTMLElement>document.querySelector(`#mbuyorder_${buy_orderid}_name`);

            return confirm(`Do you really want to remove ${buyOrderQuantity.innerText.trim()} buy order(s) for: ${buyOrderName.innerText.trim()}`);
        }, 'custom');
    }

}
