module Adjust_Market {

    // imports
    import Settings = ExtensionSettings.Settings;

    // module

    function process(transferData: InjectionService.TransferData<unknown>): void {
        if (transferData.url.indexOf('/market/') == -1) {
            return;
        } else if (transferData.url.indexOf('/market/goods') > -1) {
            console.debug('[BuffUtility] Adjust_Market (/goods)');
            adjustMarketGoodsOrBuying(<InjectionService.TransferData<BuffTypes.GoodsOrBuying.Data>>transferData);
        } else if (transferData.url.indexOf('/market/sell_order/top_bookmarked') > -1) {
            console.debug('[BuffUtility] Adjust_Market (/sell_order/top_bookmarked)');
            adjustMarketTopBookmarked(<InjectionService.TransferData<BuffTypes.TopPopular.Data>>transferData);
        } else {
            console.debug(`[BuffUtility] Adjust_Market MISSING (${(/(\/market\/.*)[?#]/g.exec(transferData.url) ?? [null, transferData.url])[1]})`);
        }

        // if (transferData.url.indexOf('/market/') > -1) {
        //     if ((<InjectionService.TransferData<BuffTypes.TopBookmarked.Data>>transferData)?.data?.goods_infos) {
        //         console.debug('[BuffUtility] Adjust_Market (MISSING)');
        //     } else {
        //         console.debug('[BuffUtility] Adjust_Market (/goods | /buying)');
        //
        //         adjustMarketGoodsOrBuying(<InjectionService.TransferData<BuffTypes.GoodsOrBuying.Data>>transferData);
        //     }
        //
        //     addSpecialTab();
        // }
    }

    async function adjustMarketGoodsOrBuying(transferData: InjectionService.TransferData<BuffTypes.GoodsOrBuying.Data>): Promise<void> {
        const liList = <NodeListOf<HTMLElement>>document.querySelectorAll('#j_list_card li');

        let info: string[] = [];

        let data = transferData.data;

        // if we have no items don't adjust anything
        if (!data?.items?.length) return;

        for (let i = 0, l = liList.length; i < l; i ++) {
            const dataRow = data.items[i];
            const li = liList.item(i);
            const h3 = <HTMLElement>li.querySelector('h3');
            const p = <HTMLElement>document.createElement('p');

            const schemaData = (await ISchemaHelper.find(dataRow.short_name, true, dataRow.goods_info.info?.tags?.exterior?.internal_name == 'wearcategoryna', true)).data[0];
            if (DEBUG) {
                console.debug(schemaData);
            }

            let aHrefList = li.querySelectorAll('a[href]');
            for (let x = 0, y = aHrefList.length; x < y; x ++) {
                let aHref = aHrefList.item(x);

                let stickerSearch = '';
                if (schemaData && schemaData.sticker_amount > 0) {
                    switch (getSetting(Settings.DEFAULT_STICKER_SEARCH)) {
                        case ExtensionSettings.FILTER_STICKER_SEARCH['All']:
                        case ExtensionSettings.FILTER_STICKER_SEARCH['Stickers']:
                        case ExtensionSettings.FILTER_STICKER_SEARCH['No Stickers']:
                        case ExtensionSettings.FILTER_STICKER_SEARCH['Squad Combos']:
                            stickerSearch = getSetting(Settings.DEFAULT_STICKER_SEARCH);
                            break;
                        case ExtensionSettings.FILTER_STICKER_SEARCH['Save Custom']:
                            if (getSetting(Settings.STORED_CUSTOM_STICKER_SEARCH).length > 0) {
                                stickerSearch = getSetting(Settings.STORED_CUSTOM_STICKER_SEARCH);
                            }
                            break;
                    }
                }

                aHref.setAttribute('href', `${aHref.getAttribute('href')}&sort_by=${getSetting(Settings.DEFAULT_SORT_BY)}${stickerSearch}`);
            }

            let buffPrice = +dataRow.sell_min_price;
            let steamPriceCNY = +dataRow.goods_info.steam_price_cny;

            if (getSetting(Settings.APPLY_STEAM_TAX)) {
                let steam = Util.calculateSellerPrice(~~(steamPriceCNY * 100));
                let f_steamPriceCNY = (steam.amount - steam.fees) / 100;

                info.push(`Reference price for '${dataRow.market_hash_name}' was adjusted with fees: ${steamPriceCNY} -> ${f_steamPriceCNY}`);

                steamPriceCNY = f_steamPriceCNY;
            }

            let priceDiff;
            switch (getSetting(Settings.DIFFERENCE_DOMINATOR)) {
                case ExtensionSettings.DifferenceDominator.STEAM:
                    priceDiff = ((steamPriceCNY - buffPrice) / steamPriceCNY) * -1 * 100;
                    break;
                case ExtensionSettings.DifferenceDominator.BUFF:
                    priceDiff = ((steamPriceCNY - buffPrice) / buffPrice) * -1 * 100;
                    break;
            }

            h3.setAttribute('style', 'margin-bottom: 14px;');
            p.setAttribute('style', 'display: grid; grid-template-columns: auto 25%; grid-template-rows: 20px 20px; margin: 2px;');

            let newHTML: string[] = [];

            if (dataRow.sell_num > 0) {
                let sell_min_price_sym: string = GlobalConstants.SYMBOL_YUAN;
                let sell_min_price_str = `${dataRow.sell_min_price}`;
                const sell_min_price_title = Util.formatNumber(sell_min_price_str, false, ExtensionSettings.CurrencyNumberFormats.FORMATTED);

                if (getSetting(Settings.EXPERIMENTAL_ADJUST_MARKET_CURRENCY)) {
                    const { convertedSymbol, convertedValue } = Util.convertCNYRaw(+dataRow.sell_min_price);
                    sell_min_price_sym = convertedSymbol;
                    sell_min_price_str = convertedValue;
                }

                let { wasCompressed, wasFormatted, strNumber } = Util.formatNumber(sell_min_price_str, true);
                if (wasCompressed || wasFormatted) {
                    sell_min_price_str = strNumber;
                }

                sell_min_price_str = `${Util.embedDecimalSmall(sell_min_price_str)}${wasCompressed ? 'K' : ''}`;

                newHTML.push(Util.buildHTML('span', {
                    class: 'f_12px',
                    style: {
                        'grid-column': '1',
                        'overflow': 'hidden'
                    },
                    attributes: {
                        'title': `${GlobalConstants.SYMBOL_YUAN} ${sell_min_price_title.strNumber} selling (${dataRow.sell_num})`
                    },
                    content: [
                        Util.buildHTML('span', {
                            style: {
                                'color': GlobalConstants.COLOR_ORANGE,
                                'font-weight': '700'
                            },
                            content: [ `${sell_min_price_sym} ${sell_min_price_str}` ]
                        }),
                        ` selling <small>(${dataRow.sell_num})</small>`
                    ]
                }));
            } else {
                newHTML.push(Util.buildHTML('span', {
                    class: 'c_Gray f_12px',
                    style: {
                        'grid-column': '1'
                    },
                    content: [ 'None selling.' ]
                }));
            }

            if (dataRow.buy_num > 0) {
                let buy_max_price_sym: string = GlobalConstants.SYMBOL_YUAN;
                let buy_max_price_str = `${dataRow.buy_max_price}`;
                const buy_max_price_title = Util.formatNumber(buy_max_price_str, false, ExtensionSettings.CurrencyNumberFormats.FORMATTED);

                if (getSetting(Settings.EXPERIMENTAL_ADJUST_MARKET_CURRENCY)) {
                    const { convertedSymbol, convertedValue } = Util.convertCNYRaw(+dataRow.buy_max_price);
                    buy_max_price_sym = convertedSymbol;
                    buy_max_price_str = convertedValue;
                }

                let { wasCompressed, wasFormatted, strNumber } = Util.formatNumber(buy_max_price_str, true);
                if (wasCompressed || wasFormatted) {
                    buy_max_price_str = strNumber;
                }

                buy_max_price_str = `${Util.embedDecimalSmall(buy_max_price_str)}${wasCompressed ? 'K' : ''}`;

                newHTML.push(Util.buildHTML('span', {
                    class: 'f_12px',
                    style: {
                        'grid-column': '1'
                    },
                    attributes: {
                        'title': `${GlobalConstants.SYMBOL_YUAN} ${buy_max_price_title.strNumber} buying (${dataRow.buy_num})`
                    },
                    content: [
                        Util.buildHTML('span', {
                            style: {
                                'color': GlobalConstants.COLOR_BLUE,
                                'font-weight': '700'
                            },
                            content: [ `${buy_max_price_sym} ${buy_max_price_str}` ]
                        }),
                        ` buying <small>(${dataRow.buy_num})</small>`
                    ]
                }));
            } else {
                newHTML.push(Util.buildHTML('span', {
                    class: 'c_Gray f_12px',
                    style: {
                        'grid-column': '1'
                    },
                    content: [ 'None buying.' ]
                }));
            }

            if (dataRow.sell_num > 0) {
                let priceDiffStr = `${priceDiff.toFixed(1)}%`;

                newHTML.push(Util.buildHTML('span', {
                    style: {
                        'grid-column': '2',
                        'grid-row': '1',
                        'margin-top': '12px',
                        'font-size': priceDiffStr.length > 6 ? '10px' : '12px',
                        'font-weight': '700',
                        'text-align': 'center',
                        'color': priceDiff < 0 ? GlobalConstants.COLOR_GOOD : GlobalConstants.COLOR_BAD
                    },
                    content: [ priceDiffStr ]
                }));
            }

            p.innerHTML = newHTML.join('');

            let liP = li.querySelector('p');
            if (liP) {
                liP.style['display'] = 'none';
            }

            li.append(p);
        }

        if (info.length > 0) {
            console.debug('[BuffUtility] Market Info:\n', info.join('\n '));
        }
    }

    async function adjustMarketTopBookmarked(transferData: InjectionService.TransferData<BuffTypes.TopPopular.Data>): Promise<void> {
        // If experimental feature was disabled, ignore.
        if (!getSetting(Settings.EXPERIMENTAL_ADJUST_POPULAR)) {
            console.debug('[BuffUtility] Experimental feature \'Adjust Popular\' is disabled.');
            return;
        }

        const liList = <NodeListOf<HTMLElement>>document.querySelectorAll('#j_list_card li');
        let data = transferData.data;
        let goods_infos = data.goods_infos;

        // if we have no items don't adjust anything
        if (!data?.items?.length) return;

        for (let i = 0, l = liList.length; i < l; i ++) {
            const dataRow = data.items[i];
            const goodsInfo = goods_infos[dataRow.goods_id];
            const li = liList.item(i);
            const tagBox = <HTMLElement>li.querySelector('.tagBox > .g_Right');

            const schemaData = (await ISchemaHelper.find(goodsInfo.market_hash_name, true, goodsInfo?.tags?.exterior?.internal_name == 'wearcategoryna')).data[0];

            if (dataRow.appid == 730) {
                const aShare = document.createElement('a');
                aShare.setAttribute('style', 'cursor: pointer;');
                aShare.setAttribute('href', `https://buff.163.com/market/m/item_detail?classid=${dataRow.asset_info.classid}&instanceid=${dataRow.asset_info.instanceid}&game=csgo&assetid=${dataRow.asset_info.assetid}&sell_order_id=${dataRow.id}`);
                aShare.setAttribute('target', '_blank');
                aShare.innerHTML = '<i class="icon icon_link j_tips_handler" data-direction="bottom" data-title="Share"></i>';

                let aCopyGen = document.createElement('a');
                let gen = Util.generateInspectGen(schemaData, dataRow.asset_info.info.paintindex, dataRow.asset_info.info.paintseed, dataRow.asset_info.paintwear, dataRow.asset_info?.info?.stickers ?? []);
                if (schemaData) {
                    if (schemaData?.type == 'Gloves') {
                        aCopyGen.innerHTML = '<i class="icon icon_notes j_tips_handler" data-direction="bottom" data-title="Copy !gengl" style="-webkit-filter: invert(50%);"></i>';
                    } else {
                        aCopyGen.innerHTML = '<i class="icon icon_notes j_tips_handler" data-direction="bottom" data-title="Copy !gen"  style="-webkit-filter: invert(50%);"></i>';
                    }
                }

                Util.addAnchorToastAction(aCopyGen, `Copied ${gen} to clipboard!`);
                // if (getSetting(Settings.SHOW_TOAST_ON_ACTION)) {
                //     aCopyGen.setAttribute('href', `javascript:Buff.toast('Copied ${gen} to clipboard!');`);
                // } else {
                //     aCopyGen.setAttribute('href', 'javascript:;');
                // }

                aCopyGen.setAttribute('title', gen);
                aCopyGen.setAttribute('style', 'cursor: pointer;');
                aCopyGen.addEventListener('click', () => {
                    navigator?.clipboard?.writeText(gen).then(() => {
                        // alert(`Copied ${gen} to clipboard!`);
                        console.debug(`[BuffUtility] Copy gen: ${gen}`);
                    }).catch((e) => console.error('[BuffUtility]', e));
                });

                tagBox.insertBefore(aShare, tagBox.firstChild);

                // only append if we have schema data, which we always should have, but some items have weird CH mappings
                if (schemaData) {
                    tagBox.insertBefore(aCopyGen, tagBox.firstChild);
                }
            }
        }
    }

    function addSpecialTab(): void {
        // Don't do anything if present
        if (!!document.querySelector('#buff-utility-special')) return;

        let marketTabs = <HTMLElement>document.querySelector('ul.tab');

        let specialTab = <HTMLElement>document.createElement('li_x');
        specialTab.setAttribute('id', 'buff-utility-special');
        specialTab.innerHTML = 'Special';

        marketTabs.append(specialTab);

        function buff_utility_overrides(): void {
            function overrideTabHandle(): void {
                $(document).on('click', '.tab li', function () {
                    $('.tab li_x').removeClass('on');
                });

                $(document).on('click', '#buff-utility-special', function () {
                    $('.tab li').removeClass('on');
                    $(this).addClass('on');

                    console.debug('[BuffUtility] Navigation -> special');

                    ($('#j_market_card')).showLoading();

                    sendRequest(`/api/market/sell_order/price_drops${window.location?.hash ?? '?game=csgo'}`, {
                        method: 'GET',
                        dataType: 'json',
                        showLoading: false,
                        success: (data) => {
                            console.debug(data);
                        }
                    });

                    return false;
                });
            }
            overrideTabHandle();
        }

        InjectionServiceLib.injectCSS(`
        .tab li_x {
            display: list-item;
            float: left;
            font-size: 15px;
            text-align: center;
            cursor: pointer;
            color: #929394;
            border-right: 1px solid #303B4F;
            width: 170px;
            height: 52px;
            line-height: 52px;
            overflow: hidden;
        }
        
        .tab li_x.on {
            color: #fff;
            font-weight: 700;
            background-image: url(../static/images/sprite/icon.less.png);
            background-position: -304px -76px;
        }
        
        .tab li_x:hover {
            color: #ccc;
            background-image: url(../static/images/sprite/icon.less.png);
            background-position: -312px 0;
        }
        `);

        InjectionServiceLib.injectCode(`${buff_utility_overrides.toString()}buff_utility_overrides();`, 'body');
    }

    // init();
    window.addEventListener(GlobalConstants.BUFF_UTILITY_INJECTION_SERVICE, (e: CustomEvent<InjectionService.TransferData<unknown>>) => process(e.detail));

}

