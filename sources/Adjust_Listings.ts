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
            function setCanExpand(): void {
                const container = document.getElementById('preview_screenshots');
                const state = ExtensionSettings.settings.can_expand_screenshots && !!container.querySelector('span[value="inspect_trn_url"].on');
                const tags = <NodeListOf<HTMLElement>>document.querySelectorAll('tr td.img_td');

                const classes = state ? `img_td can_expand ${ExtensionSettings.settings.expand_screenshots_backdrop ? 'expand_backdrop' : ''}` : 'img_td';

                let affected = 0;

                for (let i = 0, l = tags.length; i < l; i ++) {
                    const td = tags.item(i);

                    if (td.getAttribute('class') != classes) {
                        td.setAttribute('class', classes);

                        let img = td.querySelector('img');

                        // set image resolution
                        if (state) {

                        } else {

                        }

                        affected ++;
                    }
                }

                if (affected > 0) {
                    console.debug(`[BuffUtility] Expand set on ${affected} elements`);
                }
            }

            setInterval(() => setCanExpand(), 250);

            // adjust listings
            adjustSellOrderListings(<InjectionService.TransferData<BuffTypes.SellOrder.Data>>transferData);
        } else if (transferData.url.indexOf('/buy_order') > -1) {
            console.debug('[BuffUtility] Adjust_Listings (buy_order)');

            adjustBuyOrderListings(<InjectionService.TransferData<BuffTypes.BuyOrder.Data>>transferData);
        }
    }

    function adjustSellOrderListings(transferData: InjectionService.TransferData<BuffTypes.SellOrder.Data>): void {
        let updated_preview = 0;

        let data = transferData.data;
        let rows = <NodeListOf<HTMLElement>>document.querySelectorAll('tr[id^="sell_order_"]');

        let goodsInfo: BuffTypes.SellOrder.GoodsInfo = data.goods_infos[/goods_id=(\d+)/.exec(transferData.url)[1]];
        let steamPriceCNY = +goodsInfo.steam_price_cny;

        const preview_screenshots = document.getElementById('preview_screenshots');
        const can_expand_screenshots = ExtensionSettings.settings.can_expand_screenshots && !!preview_screenshots.querySelector('span[value="inspect_trn_url"].on');
        const expand_classes = can_expand_screenshots ? `img_td can_expand ${ExtensionSettings.settings.expand_screenshots_backdrop ? 'expand_backdrop' : ''}` : 'img_td';

        // adjust reference price
        if (ExtensionSettings.settings.apply_steam_tax) {
            let steam = Util.calculateSellerPrice(~~(steamPriceCNY * 100));
            let f_steamPriceCNY = (steam.amount - steam.fees) / 100;

            console.debug(`[BuffUtility] Reference price was adjusted with fees:`, steamPriceCNY, '->', f_steamPriceCNY);

            steamPriceCNY = f_steamPriceCNY;
        }

        // add expand handler
        function setCanExpand(td_img_td: HTMLElement, img_src: string): void {
            let img = td_img_td.querySelector('img');

            // set image source
            if (img.getAttribute('src') != img_src) {
                img.setAttribute('src', img_src);
            }

            if (td_img_td.getAttribute('class') != expand_classes) {
                td_img_td.setAttribute('class', expand_classes);

                updated_preview ++;
            }
        }

        for (let i = 0, l = rows.length; i < l; i ++) {
            let dataRow = data.items[i];
            let row = rows.item(i);

            let strPriceSplit = dataRow.price.split('.');

            let price = +dataRow.price;
            let priceDiff = price - steamPriceCNY;

            let priceDiffStr;
            if (ExtensionSettings.settings.apply_currency_to_difference) {
                priceDiffStr = Util.convertCNY(priceDiff);
            } else {
                priceDiffStr = `${GlobalConstants.SYMBOL_YUAN} ${priceDiff.toFixed(2)}`;
            }

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
                                content: [ `${priceDiff < 0 ? GlobalConstants.SYMBOL_ARROW_DOWN : GlobalConstants.SYMBOL_ARROW_UP}${priceDiffStr}` ]
                            })
                        ]
                    })
                ]
            });

            let img_src = dataRow.img_src + data.fop_str;
            if (can_expand_screenshots) {
                switch (ExtensionSettings.settings.custom_fop) {
                    case 'Auto':
                        img_src = dataRow.img_src;

                        break;
                    case 'w245,h230':
                        img_src = `${dataRow.img_src}?fop=imageView/2/w/245/h/230`;

                        break;
                    case 'w490,h460':
                        img_src = `${dataRow.img_src}?fop=imageView/2/w/490/h/460`;

                        break;
                    case 'w980,h920':
                        img_src = `${dataRow.img_src}?fop=imageView/2/w/980/h/920`;

                        break;
                    case 'w1960,h1840':
                        img_src = `${dataRow.img_src}?fop=imageView/2/w/1960/h/1840`;

                        break;
                    case 'w3920,h3680':
                        img_src = `${dataRow.img_src}?fop=imageView/2/w/3920/h/3680`;

                        break;
                    default:
                        break;
                }
            }

            setCanExpand(row.querySelector('td.img_td'), img_src);

            let priceContainer = <HTMLElement>row.querySelectorAll('td.t_Left').item(2);
            let paymentMethods = (<HTMLElement>priceContainer.querySelectorAll('div').item(1))?.outerHTML ?? '';
            priceContainer.innerHTML = (newHTML + paymentMethods);
        }

        if (updated_preview > 0) {
            console.debug(`[BuffUtility] Preview adjusted for ${updated_preview} elements.`);
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
