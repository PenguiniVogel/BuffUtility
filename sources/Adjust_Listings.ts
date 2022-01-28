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

        ExtensionSettings.save(Settings.STORED_CUSTOM_STICKER_SEARCH, (/&extra_tag_ids=[^&#]+/g.exec(transferData.url) ?? [''])[0]);

        // if we have no items or no rows don't adjust anything
        if (!data?.items?.length || !rows) return;

        let goodsInfo: BuffTypes.SellOrder.GoodsInfo = data.goods_infos[/goods_id=(\d+)/.exec(transferData.url)[1]];
        let steamPriceCNY = +goodsInfo.steam_price_cny;

        const schemaData = SchemaHelper.find(goodsInfo.short_name, true, goodsInfo?.tags?.exterior?.internal_name == 'wearcategoryna')[0];
        // console.log(schemaData);

        const preview_screenshots = document.getElementById('preview_screenshots');
        const can_expand_screenshots = storedSettings[Settings.CAN_EXPAND_SCREENSHOTS] && !!preview_screenshots?.querySelector('span[value="inspect_trn_url"].on');
        const expand_classes = can_expand_screenshots ? `img_td can_expand ${storedSettings[Settings.EXPAND_SCREENSHOTS_BACKDROP] ? 'expand_backdrop' : ''}` : 'img_td';

        // adjust reference price
        if (storedSettings[Settings.APPLY_STEAM_TAX]) {
            let steam = Util.calculateSellerPrice(~~(steamPriceCNY * 100));
            let f_steamPriceCNY = (steam.amount - steam.fees) / 100;

            console.debug(`[BuffUtility] Reference price was adjusted with fees:`, steamPriceCNY, '->', f_steamPriceCNY);

            steamPriceCNY = f_steamPriceCNY;
        }

        // add expand handler
        function setCanExpand(td_img_td: HTMLElement, img_src: string): void {
            let divContainer = td_img_td.querySelector('div');
            let expandImg = document.createElement('img');

            expandImg.setAttribute('data-buff-utility-expand-image', `${storedSettings[Settings.EXPAND_TYPE]}`);
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
            let row = rows.item(i);
            let dataRow = data.items[i];

            // only apply to csgo
            if (goodsInfo.appid == 730) {
                const wearContainer = <HTMLElement>row.querySelector('td.t_Left div.csgo_value');

                let aCopyGen = null;
                let aMatchFloatDB = null;
                if (schemaData?.type) {
                    aCopyGen = document.createElement('a');

                    let gen;
                    if (schemaData.type == 'Gloves') {
                        aCopyGen.innerHTML = '<b><i class="icon icon_notes"></i></b>Copy !gengl';
                        // !gengl weapon_id paint_id pattern float
                        gen = `!gengl ${schemaData.id} ${dataRow.asset_info.info.paintindex} ${dataRow.asset_info.info.paintseed} ${dataRow.asset_info.paintwear}`;
                    } else {
                        aCopyGen.innerHTML = '<b><i class="icon icon_notes"></i></b>Copy !gen';
                        // !gen weapon_id paint_id pattern float sticker1 wear1...
                        gen = `!gen ${schemaData.id} ${dataRow.asset_info.info.paintindex} ${dataRow.asset_info.info.paintseed} ${dataRow.asset_info.paintwear}`;

                        if (dataRow.asset_info.info?.stickers?.length > 0) {
                            let stickers: string[] = ['0 0', '0 0', '0 0', '0 0'];

                            for (let l_sticker of dataRow.asset_info.info.stickers) {
                                stickers[l_sticker.slot] = `${l_sticker.sticker_id} ${l_sticker.wear}`;
                            }

                            gen += ` ${stickers.join(' ')}`;
                        }
                    }

                    // aCopyGen = document.createElement('a');
                    // aCopyGen.innerHTML = '<b><i class="icon icon_notes"></i></b>Copy !gen';
                    aCopyGen.setAttribute('class', 'ctag btn');

                    if (storedSettings[Settings.SHOW_TOAST_ON_ACTION]) {
                        aCopyGen.setAttribute('href', `javascript:Buff.toast('Copied ${gen} to clipboard!');`);
                    } else {
                        aCopyGen.setAttribute('href', 'javascript:;');
                    }

                    aCopyGen.setAttribute('title', gen);

                    aCopyGen.addEventListener('click', () => {
                        navigator?.clipboard?.writeText(gen).then(() => {
                            // alert(`Copied ${gen} to clipboard!`);
                            console.debug(`[BuffUtility] Copy gen: ${gen}`);
                        }).catch((e) => console.error('[BuffUtility]', e));
                    });

                    // match on floatdb
                    let category;
                    switch (goodsInfo.tags?.quality?.internal_name ?? 'normal') {
                        case 'strange':
                        case 'unusual_strange':
                            category = '2';
                            break;
                        case 'tournament':
                            category = '3';
                            break;
                        case 'normal':
                        case 'unusual':
                        default:
                            category = '1';
                            break;
                    }

                    let min = +dataRow.asset_info.paintwear.slice(0, 5);
                    let max = min + 0.001;

                    aMatchFloatDB = document.createElement('a');
                    aMatchFloatDB.innerHTML = '<b><i style="margin-right: 1px;" class="icon icon_change"></i></b>Match floatdb';
                    aMatchFloatDB.setAttribute('class', 'ctag btn');
                    aMatchFloatDB.setAttribute('href', `https://csgofloat.com/db?name=${schemaData.name}&defIndex=${schemaData.id}&paintIndex=${dataRow.asset_info.info.paintindex}&paintSeed=${dataRow.asset_info.info.paintseed}&category=${category}&min=${`${min}`.slice(0, 5)}&max=${`${max}`.slice(0, 5)}`);
                    aMatchFloatDB.setAttribute('target', '_blank');
                }

                const aShare = document.createElement('a');
                aShare.innerHTML = '<b><i style="margin: -3px 3px 0 0;" class="icon icon_link"></i></b>Share';
                aShare.setAttribute('class', 'ctag btn');
                aShare.setAttribute('href', `https://buff.163.com/market/m/item_detail?classid=${dataRow.asset_info.classid}&instanceid=${dataRow.asset_info.instanceid}&game=csgo&assetid=${dataRow.asset_info.assetid}&sell_order_id=${dataRow.id}`);
                aShare.setAttribute('target', '_blank');

                wearContainer.appendChild(document.createElement('br'));
                if (aCopyGen) wearContainer.appendChild(aCopyGen);
                wearContainer.appendChild(aShare);
                if (aMatchFloatDB) wearContainer.appendChild(aMatchFloatDB);
            }

            let priceContainer = <HTMLElement>([ ...<Array<HTMLElement>><unknown>row.querySelectorAll('td.t_Left') ].filter(td => !!td.querySelector('p.hide-cny')))[0];

            if (!priceContainer) continue;

            let strPriceSplit = dataRow.price.split('.');

            let price = +dataRow.price;
            let priceDiff = price - steamPriceCNY;

            let priceDiffStr;
            if (storedSettings[Settings.APPLY_CURRENCY_TO_DIFFERENCE]) {
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

                switch (storedSettings[Settings.EXPAND_TYPE]) {
                    case ExtensionSettings.ExpandScreenshotType.PREVIEW:
                        switch (storedSettings[Settings.CUSTOM_FOP]) {
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

            let paymentMethods = (<HTMLElement>priceContainer.querySelectorAll('div').item(1))?.outerHTML ?? '';
            priceContainer.innerHTML = (newHTML + paymentMethods);
        }

        if (updated_preview > 0) {
            console.debug('[BuffUtility] Preview adjusted for', updated_preview, `element${updated_preview > 1 ? 's.' : '.'}`, 't:', storedSettings[Settings.EXPAND_TYPE]);
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
