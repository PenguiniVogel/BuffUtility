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

        InjectionServiceLib.onReady(() => {
            // inject some code
            function buff_utility_readNarrowOptions(selector: string): void {
                let r: {
                    [name: string]: {
                        selected: boolean,
                        value: string
                    }
                } = {};

                // let modal = document.getElementById(selector);
                let options = <NodeListOf<HTMLElement>>document.getElementById(selector.substring(1)).querySelectorAll(`[data-buff-utility]`);

                for (let i = 0, l = options.length; i < l; i ++) {
                    let e = options.item(i);
                    let span = e.querySelector('span');

                    r[e.getAttribute('data-buff-utility')] = {
                        selected: span.getAttribute('class')?.indexOf('on') > -1,
                        value: span.getAttribute('data-value')
                    };
                }

                console.debug(r);

                window.postMessage([GlobalConstants.BUFF_UTILITY_ASK_NARROW, r], '*');
            }

            InjectionServiceLib.injectCode(`${buff_utility_readNarrowOptions.toString()}`);

            function buff_utility_forceNewestReload(): void {
                const reloadKey = 'bu_reload';
                let hash = getParamsFromHash();

                let currentReload = +(hash[reloadKey] ?? '0');

                currentReload ++;

                updateHashData({
                    page: 1,
                    sort_by: 'created.desc',
                    [reloadKey]: currentReload
                });
            }

            InjectionServiceLib.injectCode(`${buff_utility_forceNewestReload.toString()}`);

            let a = document.createElement('a');
            a.setAttribute('href', 'javascript:buff_utility_forceNewestReload();');
            a.setAttribute('class', 'i_Btn i_Btn_mid i_Btn_sub');
            a.setAttribute('style', 'margin: 0; min-width: 32px;');
            a.innerHTML = '<i class="icon icon_refresh" style=" margin: 0 0 3px 0; filter: grayscale(1) brightness(2);"></i>';

            switch (storedSettings[Settings.LOCATION_RELOAD_NEWEST]) {
                case ExtensionSettings.LOCATION_RELOAD_NEWEST_VALUES.NONE:
                    break;
                case ExtensionSettings.LOCATION_RELOAD_NEWEST_VALUES.BULK:
                    document.querySelector('#batch-buy-btn')?.parentElement?.appendChild(a);
                    break;
                case ExtensionSettings.LOCATION_RELOAD_NEWEST_VALUES.SORT:
                    document.querySelector('#asset_tag-filter div.l_Right div.w-Select-Multi[name="sort"]')?.parentElement?.appendChild(a);
                    break;
                case ExtensionSettings.LOCATION_RELOAD_NEWEST_VALUES.CENTER:
                    document.querySelector('#asset_tag-filter div.l_Left')?.parentElement?.appendChild(a);
                    break;
                case ExtensionSettings.LOCATION_RELOAD_NEWEST_VALUES.LEFT:
                    document.querySelector('#asset_tag-filter div.l_Left')?.prepend(a);
                    break;
                default:
                    break;
            }

            // todo add force newest
            /*
<a href="javascript:buff_utility_forceNewestReload();" class="i_Btn i_Btn_mid i_Btn_sub" id="buff_utility_force_newest" style="margin: 0; min-width: 32px;">
    <i class="icon icon_refresh" style=" margin: 0 0 3px 0; filter: grayscale(1) brightness(2);"></i>
</a>
             */

            InjectionServiceLib.injectCSS(`
                .f_Strong.f_Strong_Blue {
                    color: ${GlobalConstants.COLOR_BLUE};
                }
            
                td.img_td.can_expand img[data-buff-utility-expand-image] {
                    display: none;
                }
                    
                td.img_td.can_expand:hover {
                    padding: 20px 0px 20px 0px;
                }
                
                td.img_td.can_expand:hover img[data-buff-utility-expand-image] {
                    width: auto;
                    height: auto;
                    display: block;
                    position: absolute;
                    z-index: 99999;
                }
                
                td.img_td.can_expand:hover img[data-buff-utility-expand-image="0"] {
                    transform: scale(10) translate(70px, 0px);
                }
                
                td.img_td.can_expand:hover img[data-buff-utility-expand-image="1"] {
                    transform: scale(8) translate(99px, 10px);
                }
                
                td.img_td.can_expand.expand_backdrop:hover img[data-buff-utility-expand-image="0"] {
                    background-color: rgb(0 0 0 / 25%);
                    background-color: rgba(0, 0, 0, 0.25);
                }`);
        });
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

        if (!document.querySelector('span.buffutility-pricerange')) {
            console.debug('[BuffUtility] Adjust_Listings (header)');
            adjustHeaderListings();
        }
    }

    async function adjustHeaderListings() {
        let goods_id = +document.querySelector("div.detail-cont div.add-bookmark").getAttribute('data-target-id');
        //discard dates from prices as not used
        let history = (await fetchPriceHistory(goods_id, 30)).map((arr) => arr[1]);

        let header = <HTMLElement>document.querySelector("body > div.market-list > div > div.detail-header.black");
        let priceMin = history[0], priceMax = history[0];

        for (let i=1;i<history.length;i++) {
            if (history[i] < priceMin) {
                priceMin = history[i];
            }
            if (history[i] > priceMax) {
                priceMax = history[i];
            }
        }

        let priceParent = <HTMLElement>header.querySelector("div.detail-summ");

        let priceSpan = document.createElement('span');
        let priceLabel = document.createElement('label');
        let priceStrong = document.createElement('strong');

        priceParent.setAttribute('style', 'line-height: 200%;');
        priceSpan.setAttribute('class', 'buffutility-pricerange');
        priceLabel.innerText = 'Buff Price Trend (7D) |';

        priceStrong.innerHTML= `<strong class='f_Strong'>${Util.convertCNY(priceMin)}<small class="hide-usd">(MIN)</small></strong> — <strong class='f_Strong'>${Util.convertCNY(priceMax)}<small class="hide-usd">(MAX)</small></strong>`;

        priceSpan.appendChild(priceLabel);
        priceSpan.appendChild(priceStrong);
        //prevent the double adding of the element caused by the async nature of the function
        if (!document.querySelector('span.buffutility-pricerange')) {
            priceParent.appendChild(document.createElement('br'));
            priceParent.appendChild(priceSpan);
        }
    }

    /**
     * Fetch price history for a given item in the last X days
     * @param goodsId
     * @param days
     * @returns Array of [timestamp, price in rmb] pairs
     */
    function fetchPriceHistory(goodsId: number, days: 7 | 30): Promise<[[number, number]]> {
        return new Promise((resolve, _) => {
            fetch(`https://buff.163.com/api/market/goods/price_history/buff?game=csgo&goods_id=${goodsId}&days=${days}`)
            .then(r => r.json().then(_response => {
                resolve(_response.data.price_history);
            }));
        });
    }

    function adjustSellOrderListings(transferData: InjectionService.TransferData<BuffTypes.SellOrder.Data>): void {
        let updated_preview = 0;

        let data = transferData.data;
        let rows = <NodeListOf<HTMLElement>>document.querySelectorAll('tr[id^="sell_order_"]');

        // if we have no items or no rows don't adjust anything
        if (!data?.items?.length || !rows) return;

        let { strBalance, isBalanceYuan, nrBalance } = Util.getAccountBalance();

        // let strBalance = (<HTMLElement>document.querySelector('#navbar-cash-amount')).innerText;
        // let isBalanceYuan = strBalance.indexOf('¥') > -1;
        // let nrBalance = isBalanceYuan ? +(strBalance.replace('¥', '')) : 0;
        // console.debug('[BuffUtility] Balance:', strBalance, '->', isBalanceYuan, '->', nrBalance);

        let goodsInfo: BuffTypes.SellOrder.GoodsInfo = data.goods_infos[/goods_id=(\d+)/.exec(transferData.url)[1]];
        let steamPriceCNY = +goodsInfo.steam_price_cny;

        const schemaData = SchemaHelper.find(goodsInfo.market_hash_name, true, goodsInfo?.tags?.exterior?.internal_name == 'wearcategoryna')[0];

        // only override stickers if we actually can have any
        if (schemaData?.sticker_amount > 0) {
            ExtensionSettings.save(Settings.STORED_CUSTOM_STICKER_SEARCH, (/&extra_tag_ids=[^&#]+/g.exec(transferData.url) ?? [''])[0]);
        }

        let floatdb_category;
        switch (goodsInfo.tags?.quality?.internal_name ?? 'normal') {
            case 'strange':
            case 'unusual_strange':
                floatdb_category = '2';
                break;
            case 'tournament':
                floatdb_category = '3';
                break;
            case 'normal':
            case 'unusual':
            default:
                floatdb_category = '1';
                break;
        }

        const preview_screenshots = document.getElementById('preview_screenshots');
        const can_expand_screenshots = storedSettings[Settings.CAN_EXPAND_SCREENSHOTS] && !!preview_screenshots?.querySelector('span[value="inspect_trn_url"].on');
        const expand_classes = can_expand_screenshots ? `img_td can_expand ${storedSettings[Settings.EXPAND_SCREENSHOTS_BACKDROP] ? 'expand_backdrop' : ''}` : 'img_td';

        let fopString = '';
        if (can_expand_screenshots) {
            switch (storedSettings[Settings.CUSTOM_FOP]) {
                case ExtensionSettings.FOP_VALUES.Auto:
                    fopString = '';

                    break;
                case ExtensionSettings.FOP_VALUES.w245xh230:
                    fopString = '?fop=imageView/2/w/245/h/230';

                    break;
                case ExtensionSettings.FOP_VALUES.w490xh460:
                    fopString = '?fop=imageView/2/w/490/h/460';

                    break;
                case ExtensionSettings.FOP_VALUES.w980xh920:
                    fopString = '?fop=imageView/2/w/980/h/920';

                    break;
                case ExtensionSettings.FOP_VALUES.w1960xh1840:
                    fopString = '?fop=imageView/2/w/1960/h/1840';

                    break;
                case ExtensionSettings.FOP_VALUES.w3920xh3680:
                    fopString = '?fop=imageView/2/w/3920/h/3680';

                    break;
                default:
                    break;
            }
        }

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

        // build narrow
        function buildNarrowModalContent(float: string, pattern: string, stickers: string): string {
            function buildCheckbox(name: string, key: string, value: string): string {
                return `<tr><td class="t_Left c_Gray">${name}</td><td style="padding-left: 10px;"><div class="w-Checkbox" data-buff-utility="${key}"><span data-value="${value}"><i class="icon icon_checkbox"></i> Open </span></div></td></tr>`;
            }

            let html = '<div style="padding: 10px;"><table><tbody>';

            if (float) html += buildCheckbox('Float', 'float', float);
            if (pattern) html += buildCheckbox('Pattern', 'pattern', pattern);
            if (stickers) html += buildCheckbox('Stickers', 'stickers', stickers);

            return `${html}</tbody></table></div>`;
        }

        // go over all rows
        for (let i = 0, l = rows.length; i < l; i ++) {
            let row = rows.item(i);
            let dataRow = data.items[i];

            // only apply to csgo
            if (goodsInfo.appid == 730) {
                const wearContainer = <HTMLElement>row.querySelector('td.t_Left div.csgo_value');

                let aCopyGen = null;
                let aMatchFloatDB = null;
                let aNarrow = null;
                if (schemaData?.type) {
                    aCopyGen = document.createElement('a');

                    let gen = Util.generateInspectGen(schemaData, dataRow.asset_info.info.paintindex, dataRow.asset_info.info.paintseed, dataRow.asset_info.paintwear, dataRow.asset_info?.info?.stickers ?? []);
                    if (schemaData.type == 'Gloves') {
                        aCopyGen.innerHTML = '<b><i class="icon icon_notes"></i></b>Copy !gengl';
                    } else {
                        aCopyGen.innerHTML = '<b><i class="icon icon_notes"></i></b>Copy !gen';
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

                    let min = +dataRow.asset_info.paintwear.slice(0, 5);
                    let max = min + 0.001;

                    aMatchFloatDB = document.createElement('a');
                    aMatchFloatDB.innerHTML = '<b><i style="margin-right: 1px;" class="icon icon_change"></i></b>Match floatdb';
                    aMatchFloatDB.setAttribute('class', 'ctag btn');
                    aMatchFloatDB.setAttribute('href', `https://csgofloat.com/db?name=${schemaData.name}&defIndex=${schemaData.id}&paintIndex=${dataRow.asset_info.info.paintindex}&paintSeed=${dataRow.asset_info.info.paintseed}&category=${floatdb_category}&min=${`${min}`.slice(0, 5)}&max=${`${max}`.slice(0, 5)}`);
                    aMatchFloatDB.setAttribute('target', '_blank');

                    aNarrow = document.createElement('a');
                    aNarrow.innerHTML = '<b><i style="" class="icon icon_search"></i></b>Narrow<br>';
                    aNarrow.setAttribute('class', 'ctag btn');
                    aNarrow.setAttribute('href', `javascript:Buff.dialog({title:'Narrow Search',content:'${buildNarrowModalContent(`${dataRow.asset_info.paintwear}`, `${dataRow.asset_info.info.paintseed}`, schemaData?.sticker_amount > 0 ? JSON.stringify(dataRow.asset_info.info.stickers) : null)}',onConfirm:function(data){buff_utility_readNarrowOptions(data.selector);Popup.hide(data.selector);}});`);
                }

                const aShare = document.createElement('a');
                aShare.innerHTML = '<b><i style="margin: -3px 3px 0 0;" class="icon icon_link"></i></b>Share';
                aShare.setAttribute('class', 'ctag btn');
                aShare.setAttribute('href', `https://buff.163.com/market/m/item_detail?classid=${dataRow.asset_info.classid}&instanceid=${dataRow.asset_info.instanceid}&game=csgo&assetid=${dataRow.asset_info.assetid}&sell_order_id=${dataRow.id}`);
                aShare.setAttribute('target', '_blank');

                wearContainer.appendChild(document.createElement('br'));

                let enabledOptions: boolean[] = storedSettings[Settings.LISTING_OPTIONS];

                let ctags = wearContainer.querySelectorAll('a.ctag');
                if (ctags?.length >= 2) {
                    if (!enabledOptions[0]) {
                        ctags.item(0).setAttribute('style', 'display: none;');
                    }

                    if (!enabledOptions[1]) {
                        ctags.item(1).setAttribute('style', 'display: none;');
                    }
                }

                if ((!enabledOptions[0] && !enabledOptions[1]) || ((ctags?.length ?? 0) < 2)) {
                    wearContainer.querySelector('br').setAttribute('style', 'display: none;');
                }

                if (aCopyGen && enabledOptions[2]) {
                    wearContainer.appendChild(aCopyGen);
                }

                if (enabledOptions[3]) {
                    wearContainer.appendChild(aShare);
                }

                if (aMatchFloatDB && enabledOptions[4]) {
                    wearContainer.appendChild(aMatchFloatDB);
                }

                // TODO make narrow work
                if (aNarrow && enabledOptions[5] && false) {
                    wearContainer.append(document.createElement('br'), aNarrow);
                }
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
                        img_src = `${dataRow.img_src}${fopString}`;

                        break;
                    case ExtensionSettings.ExpandScreenshotType.INSPECT:
                        img_src = dataRow.asset_info.info.inspect_url;

                        break;
                }

                setCanExpand(row.querySelector('td.img_td'), img_src);
            }

            let paymentMethods = (<HTMLElement>priceContainer.querySelectorAll('div').item(1))?.outerHTML ?? '';
            priceContainer.innerHTML = (newHTML + paymentMethods);

            if (isBalanceYuan) {
                let aBuy = row.querySelector('td a.btn-buy-order[data-asset-info]');
                let aBargain = dataRow.can_bargain ? row.querySelector('td a.bargain[data-asset-info]') : null;
                // console.debug(aBuy, aBargain);

                if (aBuy && price > nrBalance && storedSettings[Settings.COLOR_LISTINGS][0]) {
                    aBuy.setAttribute('style', `background: ${GlobalConstants.COLOR_BAD};`);
                }

                if (aBargain && +dataRow.lowest_bargain_price > nrBalance && storedSettings[Settings.COLOR_LISTINGS][1]) {
                    aBargain.setAttribute('style', `color: ${GlobalConstants.COLOR_BAD} !important;`);
                }
            }
        }

        if (updated_preview > 0) {
            console.debug('[BuffUtility] Preview adjusted for', updated_preview, `element${updated_preview == 1 ? '.' : 's.'}`, 'type:', storedSettings[Settings.EXPAND_TYPE] == 0 ? 'PREVIEW' : 'INSPECT');
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
