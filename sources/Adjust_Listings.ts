/**
 * Author: Felix Vogel
 */
/** */
module Adjust_Listings {

    // imports
    import Settings = ExtensionSettings.Settings;

    // module

    function init(): void {
        window.addEventListener(GlobalConstants.BUFF_UTILITY_INJECTION_SERVICE, (e: CustomEvent<InjectionService.TransferData<unknown>>) => process(e.detail));
    }

    function process(transferData: InjectionService.TransferData<unknown>): void {
        if (transferData.url.indexOf('/sell_order') > -1) {
            console.debug('[BuffUtility] Adjust_Listings (sell_order)');

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
        const can_expand_screenshots = ExtensionSettings.get(Settings.CAN_EXPAND_SCREENSHOTS) && !!preview_screenshots.querySelector('span[value="inspect_trn_url"].on');
        const expand_classes = can_expand_screenshots ? `img_td can_expand ${ExtensionSettings.get(Settings.EXPAND_SCREENSHOTS_BACKDROP) ? 'expand_backdrop' : ''}` : 'img_td';

        // adjust reference price
        if (ExtensionSettings.get(Settings.APPLY_STEAM_TAX)) {
            let steam = Util.calculateSellerPrice(~~(steamPriceCNY * 100));
            let f_steamPriceCNY = (steam.amount - steam.fees) / 100;

            console.debug(`[BuffUtility] Reference price was adjusted with fees:`, steamPriceCNY, '->', f_steamPriceCNY);

            steamPriceCNY = f_steamPriceCNY;
        }

        // add expand handler
        function setCanExpand(td_img_td: HTMLElement, img_src: string): void {
            let divContainer = td_img_td.querySelector('div');
            let expandImg = document.createElement('img');

            expandImg.setAttribute('data-buff-utility-expand-image', `${ExtensionSettings.get(Settings.EXPAND_TYPE)}`);
            // expandImg.setAttribute('style', 'display: none;');

            // set image source
            if (expandImg.getAttribute('src') != img_src) {
                expandImg.setAttribute('src', img_src);
            }

            if (td_img_td.getAttribute('class') != expand_classes) {
                td_img_td.setAttribute('class', expand_classes);

                updated_preview ++;
            }

            divContainer.appendChild(expandImg);
        }

        for (let i = 0, l = rows.length; i < l; i ++) {
            let dataRow = data.items[i];
            let row = rows.item(i);

            let strPriceSplit = dataRow.price.split('.');

            let price = +dataRow.price;
            let priceDiff = price - steamPriceCNY;

            let priceDiffStr;
            if (ExtensionSettings.get(Settings.APPLY_CURRENCY_TO_DIFFERENCE)) {
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

            if (can_expand_screenshots && dataRow.can_use_inspect_trn_url) {
                let img_src = dataRow.img_src + data.fop_str;

                switch (ExtensionSettings.get(Settings.EXPAND_TYPE)) {
                    case ExtensionSettings.ExpandScreenshotType.PREVIEW:
                        switch (ExtensionSettings.get(Settings.CUSTOM_FOP)) {
                            case ExtensionSettings.FOP_VALUES.Auto:
                                img_src = dataRow.img_src;

                                break;
                            case ExtensionSettings.FOP_VALUES.w245xh230:
                                img_src = `${dataRow.img_src}?fop=imageView/2/w/245/h/230`;

                                break;
                            case ExtensionSettings.FOP_VALUES.w490xh460:
                                img_src = `${dataRow.img_src}?fop=imageView/2/w/490/h/460`;

                                break;
                            case ExtensionSettings.FOP_VALUES.w980xh920:
                                img_src = `${dataRow.img_src}?fop=imageView/2/w/980/h/920`;

                                break;
                            case ExtensionSettings.FOP_VALUES.w1960xh1840:
                                img_src = `${dataRow.img_src}?fop=imageView/2/w/1960/h/1840`;

                                break;
                            case ExtensionSettings.FOP_VALUES.w3920xh3680:
                                img_src = `${dataRow.img_src}?fop=imageView/2/w/3920/h/3680`;

                                break;
                            default:
                                break;
                        }

                        break;
                    case ExtensionSettings.ExpandScreenshotType.INSPECT:
                        img_src = dataRow.asset_info.info.inspect_url;

                        break;
                }

                setCanExpand(row.querySelector('td.img_td'), img_src);
            }

            let priceContainer = <HTMLElement>row.querySelectorAll('td.t_Left').item(2);
            let paymentMethods = (<HTMLElement>priceContainer.querySelectorAll('div').item(1))?.outerHTML ?? '';
            priceContainer.innerHTML = (newHTML + paymentMethods);
        }

        if (updated_preview > 0) {
            console.debug('[BuffUtility] Preview adjusted for', updated_preview, `element${updated_preview > 1 ? 's.' : '.'}`, 't:', ExtensionSettings.get(Settings.EXPAND_TYPE));
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
