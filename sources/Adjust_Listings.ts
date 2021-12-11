/**
 * Author: Felix Vogel
 */
/** */
module Adjust_Listings {

    function init(): void {
        window.addEventListener(GlobalConstants.BUFF_UTILITY_INJECTION_SERVICE, (e: CustomEvent<InjectionService.TransferData<unknown>>) => process(e.detail));
    }

    function process(transferData: InjectionService.TransferData<unknown>): void {
        if (transferData.url.indexOf('/sell_order') > -1) {
            console.debug('[BuffUtility] Adjust_Listings (sell_order)');

            // add expand handler
            let container = document.getElementById('preview_screenshots');

            function setCanExpand(): void {
                let state = ExtensionSettings.settings.can_expand_screenshots && !!container.querySelector('span[value="inspect_trn_url"].on');

                let tdimgs = <NodeListOf<HTMLElement>>document.querySelectorAll('tr td.img_td');

                for (let i = 0, l = tdimgs.length; i < l; i ++) {
                    tdimgs.item(i).setAttribute('class', state ? `img_td can_expand ${ExtensionSettings.settings.expand_screenshots_backdrop ? 'expand_backdrop' : ''}` : 'img_td');
                }
            }

            setTimeout(() => {
                container.querySelector('span[value]').addEventListener('click', () => setTimeout(() => setCanExpand(), 200));

                setCanExpand();
            }, 1000);

            // adjust listings
            adjustSellOrderListings(<InjectionService.TransferData<BuffTypes.SellOrder.Data>>transferData);
        } else if (transferData.url.indexOf('/buy_order') > -1) {
            console.debug('[BuffUtility] Adjust_Listings (buy_order)');

            adjustBuyOrderListings(<InjectionService.TransferData<BuffTypes.BuyOrder.Data>>transferData);
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
                            `${GlobalConstants.SYMBOL_YUAN} ${strPriceSplit[0]}`,
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
                                    'color': priceDiff < 0 ? GlobalConstants.COLOR_GOOD : GlobalConstants.COLOR_BAD
                                },
                                content: [ `${priceDiff < 0 ? GlobalConstants.SYMBOL_ARROW_DOWN : GlobalConstants.SYMBOL_ARROW_UP}${GlobalConstants.SYMBOL_YUAN} ${priceDiff.toFixed(2)}` ]
                            })
                        ]
                    })
                ]
            });

            let priceContainer = <HTMLElement>row.querySelectorAll('td.t_Left').item(2);
            let paymentMethods = (<HTMLElement>priceContainer.querySelectorAll('div').item(1))?.outerHTML ?? '';
            priceContainer.innerHTML = (newHTML + paymentMethods);
        }
    }

    function adjustBuyOrderListings(transferData: InjectionService.TransferData<BuffTypes.BuyOrder.Data>): void {
        let data = transferData.data;
        let rows = <NodeListOf<HTMLElement>>document.querySelectorAll('table.list_tb tr');

        for (let i = 1, l = rows.length; i < l; i ++) {
            let dataRow = data.items[i - 1];
            let row = rows.item(i);

            let strPriceSplit = dataRow.price.split('.');

            let price = +dataRow.price;
            // let priceDiff = price - steamPriceCNY;

            let newHTML = Util.buildHTML('div', {
                style: {
                    'display': 'table-cell'
                },
                content: [
                    Util.buildHTML('strong', {
                        class: 'f_Strong',
                        content: [
                            `${GlobalConstants.SYMBOL_YUAN} ${strPriceSplit[0]}`,
                            `${strPriceSplit[1] ? `<small>.${strPriceSplit[1]}</small>` : ''}`
                        ]
                    }),
                    Util.buildHTML('p', {
                        content: [
                            Util.buildHTML('span', {
                                class: 'c_Gray f_12px',
                                content: [ `(${Util.convertCNY(price)})` ]
                            })
                            // Util.buildHTML('div', {
                            //     class: 'f_12px',
                            //     style: {
                            //         'color': priceDiff < 0 ? '#009800' : '#c90000'
                            //     },
                            //     content: [ `${priceDiff < 0 ? GlobalConstants.SYMBOL_ARROW_DOWN : GlobalConstants.SYMBOL_ARROW_UP}${GlobalConstants.SYMBOL_YUAN} ${priceDiff.toFixed(2)}` ]
                            // })
                        ]
                    })
                ]
            });

            let priceContainer = <HTMLElement>row.querySelectorAll('td.t_Left').item(3);
            let paymentMethods = (<HTMLElement>priceContainer.querySelectorAll('div').item(1))?.outerHTML ?? '';
            priceContainer.innerHTML = (newHTML + paymentMethods);
        }
    }

    init();

}
