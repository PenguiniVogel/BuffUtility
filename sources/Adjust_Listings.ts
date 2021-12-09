/**
 * Author: Felix Vogel
 */
/** */
module Adjust_Listings {

    function init(): void {
        console.debug('[BuffUtility] Adjust_Listings');

        window.addEventListener(InjectionService.BUFF_UTILITY_INJECTION_SERVICE, (e: CustomEvent<InjectionService.TransferData<unknown>>) => setTimeout(() => process(e.detail), 100));
    }

    function process(transferData: InjectionService.TransferData<unknown>): void {
        if (transferData.url.indexOf('/sell_order') > -1) {
            adjustSellOrderListings(<InjectionService.TransferData<BuffTypes.SellOrder.Data>>transferData);
        }
    }

    function adjustSellOrderListings(transferData: InjectionService.TransferData<BuffTypes.SellOrder.Data>): void {
        let data = transferData.data;
        let rows = <NodeListOf<HTMLElement>>document.querySelectorAll('tr[id^="sell_order_"]');

        let goodsInfo: BuffTypes.SellOrder.GoodsInfo = data.goods_infos[/goods_id=(\d+)/.exec(transferData.url)[1]];
        let steamPriceCNY = +goodsInfo.steam_price_cny;

        for (let i = 0, l = rows.length; i < l; i ++) {
            let dataRow = data.items[i];
            let row = rows.item(i);

            let strPriceSplit = dataRow.price.split('.');

            let price = +dataRow.price;
            let priceDiff = price - steamPriceCNY;

            let newHTML = Util.buildHTML('div', {
                style: {
                    'display': 'table-cell'
                },
                content: [
                    Util.buildHTML('strong', {
                        class: 'f_Strong',
                        content: [
                            `${SYMBOL_YUAN} ${strPriceSplit[0]}`,
                            `${strPriceSplit[1] ? `<small>.${strPriceSplit[1]}</small>` : ''}`
                        ]
                    }),
                    Util.buildHTML('p', {
                        content: [
                            Util.buildHTML('span', {
                                class: 'c_Gray f_12px',
                                content: [ `(${Util.convertCNY(price)})` ]
                            }),
                            Util.buildHTML('div', {
                                class: 'f_12px',
                                style: {
                                    'color': priceDiff < 0 ? '#009800' : '#c90000'
                                },
                                content: [ `${priceDiff < 0 ? SYMBOL_ARROW_DOWN : SYMBOL_ARROW_UP}${SYMBOL_YUAN} ${priceDiff.toFixed(2)}` ]
                            })
                        ]
                    })
                ]
            });

            let priceContainer = <HTMLElement>row.querySelectorAll('td.t_Left').item(2);
            priceContainer.innerHTML = newHTML;
        }
    }

    init();

}
