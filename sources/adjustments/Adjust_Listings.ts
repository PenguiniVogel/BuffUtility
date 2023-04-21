module Adjust_Listings {

    DEBUG && console.debug('%c■', 'color: #0000ff', '[BuffUtility] Module.Adjust_Listings');

    // imports
    import Settings = ExtensionSettings.Settings;
    import getSetting = ExtensionSettings.getSetting;
    import getRequestSetting = ExtensionSettings.getRequestSetting;

    // module

    async function init(): Promise<void> {
        if (!await getSetting(Settings.MODULE_ADJUST_LISTINGS)) {
            console.debug('%c■', 'color: #ff0000', '[BuffUtility] Adjust_Listings');
            return;
        } else {
            console.debug('%c■', 'color: #00ff00', '[BuffUtility] Adjust_Listings');
        }

        window.addEventListener(GlobalConstants.BUFF_UTILITY_INJECTION_SERVICE, (e: CustomEvent<InjectionService.TransferData<unknown>>) => process(e.detail));

        InjectionServiceLib.onReady(() => {
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

            function buff_utility_override_bulk_buy(): void {
                let bulkBuy = <HTMLElement>document.getElementById('batch-buy-btn');
                let body = <HTMLElement>document.querySelector('body');
                if (body && bulkBuy) {
                    bulkBuy.setAttribute('id', 'batch-buy-btn-override');
                    let filtered = $._data(body)?.events['click']?.filter(e => e?.selector?.indexOf('batch-buy-btn') > -1);
                    if (filtered.length > 0) {
                        for (let event of filtered) {
                            event.selector = `${event.selector}, #batch-buy-btn-override`;
                        }
                    }
                }
            }

            function buff_utility_render_sale_popup(index): void {
                ItemDetailPopupDecorator('selling-list').show(index);
            }

            InjectionServiceLib.injectCode(`${buff_utility_forceNewestReload.toString()}`);

            (async () => {
                if (await getSetting(Settings.EXPERIMENTAL_ALLOW_BULK_BUY)) {
                    InjectionServiceLib.injectCode(`${buff_utility_override_bulk_buy.toString()}\nbuff_utility_override_bulk_buy();`);
                }
            })();

            let a = document.createElement('a');
            a.setAttribute('href', 'javascript:buff_utility_forceNewestReload();');
            a.setAttribute('class', 'i_Btn i_Btn_mid i_Btn_sub');
            a.setAttribute('style', 'margin: 0; min-width: 32px;');
            a.innerHTML = '<i class="icon icon_refresh" style=" margin: 0 0 3px 0; filter: grayscale(1) brightness(2);"></i>';

            async function addReloadNewest(): Promise<void> {
                switch (await getSetting(Settings.LOCATION_RELOAD_NEWEST)) {
                    case ExtensionSettings.ReloadNewestLocation.NONE:
                        break;
                    case ExtensionSettings.ReloadNewestLocation.BULK:
                        (document.querySelector('#batch-buy-btn') ?? document.querySelector('#batch-buy-btn-override'))?.parentElement?.appendChild(a);
                        break;
                    case ExtensionSettings.ReloadNewestLocation.SORT:
                        document.querySelector('#asset_tag-filter div.l_Right div.w-Select-Multi[name="sort"]')?.parentElement?.appendChild(a);
                        break;
                    case ExtensionSettings.ReloadNewestLocation.CENTER:
                        document.querySelector('#asset_tag-filter div.l_Left')?.parentElement?.appendChild(a);
                        break;
                    case ExtensionSettings.ReloadNewestLocation.LEFT:
                        document.querySelector('#asset_tag-filter div.l_Left')?.prepend(a);
                        break;
                    default:
                        break;
                }
            }

            addReloadNewest();

            PopupHelper.expandBargainPopup();
        });
    }

    async function process(transferData: InjectionService.TransferData<unknown>): Promise<void> {
        if (transferData.url.indexOf('/sell_order') > -1) {
            console.debug('[BuffUtility] Adjust_Listings (sell_order)');

            adjustSellOrderListings(<InjectionService.TransferData<BuffTypes.SellOrder.Data>>transferData);
        } else if (transferData.url.indexOf('/buy_order') > -1) {
            console.debug('[BuffUtility] Adjust_Listings (buy_order)');

            adjustBuyOrderListings(<InjectionService.TransferData<BuffTypes.BuyOrder.Data>>transferData);
        } else if (transferData.url.indexOf('/bill_order') > -1) {
            console.debug('[BuffUtility] Adjust_Listings (bill_order)');

            adjustBillOrderTransactions(<InjectionService.TransferData<BuffTypes.BillOrder.Data>>transferData);
        } else if (transferData.url.indexOf('/market/item_detail') > -1) {
            addSingleListingSP(transferData.data);
        }

        if (!document.querySelector('span.buffutility-pricerange') && await ExtensionSettings.getRequestSetting(Settings.EXPERIMENTAL_FETCH_ITEM_PRICE_HISTORY) > ExtensionSettings.PriceHistoryRange.OFF) {
            console.debug('[BuffUtility] Adjust_Listings (header)');

            adjustHeaderListings();
        }
    }

    /**
     * Adds a price range to the item overview ("header"). Supports 7 or 30 days ranges (default: 7).
     */
    async function adjustHeaderListings(): Promise<void> {
        // default price trend ranges: 7 oder 30 days (with observer benefit 180 days also possible)
        const days = await ExtensionSettings.getRequestSetting(Settings.EXPERIMENTAL_FETCH_ITEM_PRICE_HISTORY);
        const goods_id = document.querySelector('div.detail-cont div.add-bookmark').getAttribute('data-target-id');

        // skip to prevent doubles
        if (document.querySelector('span.buff-utility-price-range') != null) {
            return;
        }

        // disable until proxy works
        fetchPriceHistory(goods_id, days, async (response) => {
            // skip if empty, 503/507 or 425 http maybe
            if (response.length == 0) {
                return;
            }

            // discard dates from prices as they are not used
            let history = response.map(arr => arr[1]);

            let priceMin = await Util.convertCNYRaw(Math.min(...history));
            let priceMax = await Util.convertCNYRaw(Math.max(...history));
            let priceMinRaw = priceMin.convertedValueRaw.toFixed(2).split('.');
            let priceMaxRaw = priceMax.convertedValueRaw.toFixed(2).split('.');

            let header = <HTMLElement>document.querySelector('body > div.market-list > div > div.detail-header.black');
            let priceParent = <HTMLElement>header.querySelector('div.detail-summ');

            let priceSpan = document.createElement('span');
            let priceLabel = document.createElement('label');
            let priceStrong = document.createElement('strong');

            priceParent.setAttribute('style', 'line-height: 200%;');
            priceSpan.setAttribute('class', 'buff-utility-price-range');
            priceLabel.innerText = `Buff Price Trend (${days}D) |`;

            priceStrong.innerHTML= `<strong class='f_Strong'>${priceMin.convertedSymbol} <big>${priceMinRaw[0]}</big>.${priceMinRaw[1]}<small class="hide-usd">(MIN)</small></strong> - <strong class='f_Strong'>${priceMax.convertedSymbol} <big>${priceMaxRaw[0]}</big>.${priceMaxRaw[1]}<small class="hide-usd">(MAX)</small></strong>`;

            priceSpan.appendChild(priceLabel);
            priceSpan.appendChild(priceStrong);

            // prevent the double adding of the element caused by the async nature of the function
            if (document.querySelector('span.buff-utility-price-range') == null) {
                priceParent.appendChild(document.createElement('br'));
                priceParent.appendChild(priceSpan);
            }
        });
    }

    /**
     * Fetch price history for a given item in the last X days. Uses the same API as the "Price Trend" tab
     *
     * @param goodsId
     * @param days 7 or 30
     * @param callback
     */
    function fetchPriceHistory(goodsId: any, days: ExtensionSettings.PriceHistoryRange, callback: (response: [any, number][]) => void): void {
        fetch(`https://buff.163.com/api/market/goods/price_history/buff?game=csgo&goods_id=${goodsId}&days=${days}`)
            .then(r => r.json().then(_response => {
                if (typeof callback == 'function') {
                    callback(_response?.data?.price_history ?? []);
                }
            }));
    }

    async function adjustSellOrderListings(transferData: InjectionService.TransferData<BuffTypes.SellOrder.Data>): Promise<void> {
        let updated_preview = 0;

        let data = transferData.data;
        let rows = <NodeListOf<HTMLElement>>document.querySelectorAll('tr[id^="sell_order_"]');

        // if we have no items or no rows don't adjust anything
        if (!data?.items?.length || !rows) return;

        let { isBalanceYuan, nrBalance } = Util.getAccountBalance();

        let goodsInfo: BuffTypes.SellOrder.GoodsInfo = data.goods_infos[/goods_id=(\d+)/.exec(transferData.url)[1]];
        let steamPriceCNY = +goodsInfo.steam_price_cny;

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

        const can_expand_screenshots = await getSetting(Settings.CAN_EXPAND_SCREENSHOTS);
        const expand_classes = can_expand_screenshots ? `img_td can_expand ${await getSetting(Settings.EXPAND_SCREENSHOTS_BACKDROP) ? 'expand_backdrop' : ''}` : 'img_td';

        // adjust reference price
        if (await getSetting(Settings.APPLY_STEAM_TAX)) {
            let steam = Util.calculateSellerPrice(~~(steamPriceCNY * 100));
            let f_steamPriceCNY = (steam.amount - steam.fees) / 100;

            console.debug(`[BuffUtility] Reference price was adjusted with fees:`, steamPriceCNY, '->', f_steamPriceCNY);

            steamPriceCNY = f_steamPriceCNY;
        }

        // add expand handler
        async function setCanExpand(td_img_td: HTMLElement, img_src: string): Promise<void> {
            let divContainer = td_img_td.querySelector('div');
            let expandImg = document.createElement('img');

            expandImg.setAttribute('data-buff-utility-expand-image', `${await getSetting(Settings.EXPAND_TYPE)}`);
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

        let schemaData: SchemaTypes.Weapon = null;
        if ((await InjectionService.getGame()) == 'csgo') {
            schemaData = (await ISchemaHelper.find(goodsInfo.market_hash_name, true, goodsInfo?.tags?.exterior?.internal_name == 'wearcategoryna')).data[0];

            // only override stickers if we actually can have any
            if (schemaData?.sticker_amount > 0) {
                ExtensionSettings.setSetting(Settings.STORED_CUSTOM_STICKER_SEARCH, (/&extra_tag_ids=[^&#]+/g.exec(transferData.url) ?? [''])[0]);
            }
        }

        // go over all rows
        for (let i = 0, l = rows.length; i < l; i ++) {
            let row = rows.item(i);
            let dataRow = data.items[i];

            // only apply to csgo
            if (goodsInfo.appid == 730) {
                const wearContainer = <HTMLElement>row.querySelector('td.t_Left div.csgo_value');

                let aCopyGen: HTMLElement = null;
                let aMatchFloatDB: HTMLElement = null;
                let aFindSimilar: HTMLElement = null;
                if (schemaData && schemaData.type) {
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
                    aCopyGen.setAttribute('title', gen);

                    Util.addAnchorToastAction(aCopyGen, `Copied ${gen} to clipboard!`);
                    Util.addAnchorClipboardAction(aCopyGen, gen);

                    let min = +dataRow.asset_info.paintwear.slice(0, 5);
                    let max = min + 0.001;

                    aMatchFloatDB = document.createElement('a');
                    aMatchFloatDB.innerHTML = '<b><i style="margin-right: 1px;" class="icon icon_change"></i></b>Match floatdb';
                    aMatchFloatDB.setAttribute('class', 'ctag btn');
                    aMatchFloatDB.setAttribute('href', `https://csgofloat.com/db?name=${schemaData.name}&defIndex=${schemaData.id}&paintIndex=${dataRow.asset_info.info.paintindex}&paintSeed=${dataRow.asset_info.info.paintseed}&category=${floatdb_category}&min=${`${min}`.slice(0, 5)}&max=${`${max}`.slice(0, 5)}`);
                    aMatchFloatDB.setAttribute('target', '_blank');

                    aFindSimilar = document.createElement('a');
                    aFindSimilar.innerHTML = '<b><i style="filter: invert(1);" class="icon icon_search"></i></b>Find Similar<br>';
                    aFindSimilar.setAttribute('class', 'ctag btn');

                    aFindSimilar.addEventListener('click', () => {
                        console.debug('[BuffUtility] Find Similar');

                        let paramData = {};

                        for (let _range of ExtensionSettings.FLOAT_RANGES) {
                            if (_range[0] > min) {
                                paramData['min_paintwear'] = _range[1][0];
                                paramData['max_paintwear'] = _range[1][1];
                                break;
                            }
                        }

                        let stickers = dataRow.asset_info?.info?.stickers ?? [];

                        if (stickers.length > 0) {
                            paramData['extra_tag_ids'] = (stickers.length == schemaData.sticker_amount) ? 'squad_combos' : 'non_empty';

                            if (stickers.filter(x => x.wear == 0).length == stickers.length) {
                                paramData['wearless_sticker'] = '1';
                            }
                        }

                        console.debug(paramData);

                        Util.signal(['updateHashData'], null, paramData);
                    });
                } else if (goodsInfo.market_hash_name.endsWith('Souvenir Package') && await getSetting(Settings.EXPERIMENTAL_SHOW_SOUVENIR_TEAMS)) {
                    let teams = dataRow.asset_info.info.tournament_tags.map(x => String(x.localized_name)).slice(0, 2);
                    // sticker div is empty when item has no stickers
                    Util.addSouvenirTeams(row, teams);
                    // let stickerContainer = <HTMLElement>row.querySelector('.csgo_sticker');
                    // let teamsDiv = document.createElement('div');
                    // teamsDiv.setAttribute('class', 'f_12px');
                    // teamsDiv.setAttribute('style', 'display: flex; flex-direction: column; align-items: center; color: #ffd700; opacity: 0.8;');
                    // teamsDiv.innerHTML = `<span>${teams[0]}</span><div class="clear"></div><span>vs</span><div class="clear"></div><span>${teams[1]}</span>`;
                    // stickerContainer.setAttribute('style', 'float: none;');
                    // stickerContainer.appendChild(teamsDiv);
                }

                const aShare = document.createElement('a');
                aShare.innerHTML = '<b><i style="margin: -4px 0 0 0; filter: brightness(0);" class="icon icon_link"></i></b>Share';
                aShare.setAttribute('class', 'ctag btn');
                aShare.setAttribute('href', `https://buff.163.com/goods/${dataRow.goods_id}?appid=730&classid=${dataRow.asset_info.classid}&instanceid=${dataRow.asset_info.instanceid}&assetid=${dataRow.asset_info.assetid}&contextid=2&sell_order_id=${dataRow.id}`);
                aShare.setAttribute('target', '_blank');

                const aDetail = document.createElement('a');
                aDetail.innerHTML = '<b><i style="filter: invert(1);" class="icon icon_search"></i></b>Detail<br>';
                aDetail.setAttribute('class', 'ctag btn');

                aDetail.addEventListener('click', () => {
                    Util.signal(['buff_utility_render_sale_popup'], null, i);
                });

                wearContainer.appendChild(document.createElement('br'));

                let enabledOptions: boolean[] = await getSetting(Settings.LISTING_OPTIONS);

                let ctags = wearContainer.querySelectorAll('a.ctag');

                // 3D Inspect
                if (!enabledOptions[0] && ctags.item(0)) {
                    ctags.item(0).setAttribute('style', 'display: none;');
                }

                // Inspect in Server
                if (!enabledOptions[1] && ctags.item(1)) {
                    ctags.item(1).setAttribute('style', 'display: none;');
                }

                if (!enabledOptions[0] && !enabledOptions[1]) {
                    wearContainer.querySelector('br')?.setAttribute('style', 'display: none;');
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

                if ((aFindSimilar && enabledOptions[5]) || (aDetail && enabledOptions[6])) {
                    wearContainer.append(document.createElement('br'));
                }

                if (aFindSimilar && enabledOptions[5]) {
                    wearContainer.append(aFindSimilar);
                }

                if (aDetail && enabledOptions[6]) {
                    wearContainer.append(aDetail);
                }

                if (await getRequestSetting(Settings.EXPERIMENTAL_FETCH_LISTING_SPP) && dataRow.asset_info.info.stickers.length > 0) {
                    fetch(`https://buff.163.com/market/item_detail?appid=730&game=csgo&classid=${dataRow.asset_info.classid}&instanceid=${dataRow.asset_info.instanceid}&sell_order_id=${dataRow.id}&origin=selling-list&assetid=${dataRow.asset_info.assetid}&contextid=2`).then(async res => {
                        addSingleListingSP({ raw_content: await res.text() }, Settings.EXPERIMENTAL_FETCH_LISTING_SPP);
                    });
                }
            }

            let priceContainer = <HTMLElement>([ ...<Array<HTMLElement>><unknown>row.querySelectorAll('td.t_Left') ].filter(td => !!td.querySelector('p.hide-cny')))[0];

            if (!priceContainer) continue;

            let price = +dataRow.price;
            let priceDiff = price - steamPriceCNY;
            let priceDiffEx: string = `Steam price: ${GlobalConstants.SYMBOL_YUAN} ${steamPriceCNY} | Buff price: ${GlobalConstants.SYMBOL_YUAN} ${price}&#10;${price} - ${steamPriceCNY} = ${priceDiff.toFixed(2)}`;

            let priceDiffStr;
            const listingStyle = await getSetting(Settings.LISTING_DIFFERENCE_STYLE);
            switch (listingStyle) {
                case ExtensionSettings.ListingDifferenceStyle.CURRENCY_DIFFERENCE:
                    priceDiffStr = `${GlobalConstants.SYMBOL_YUAN} ${await Util.formatNumber(priceDiff)}`;
                    priceDiffEx += `&#10;This item is ${GlobalConstants.SYMBOL_YUAN} ${Math.abs(priceDiff).toFixed(2)} ${priceDiff < 0 ? 'cheaper' : 'more expensive'} than on Steam.`;
                    break;
                case ExtensionSettings.ListingDifferenceStyle.CONVERTED_CURRENCY_DIFFERENCE:
                    let { convertedSymbol, convertedFormattedValue, convertedValue, convertedValueRaw, convertedLeadingZeros } = await Util.convertCNYRaw(priceDiff);
                    priceDiffStr = `${convertedSymbol} ${convertedFormattedValue}`;
                    priceDiffEx += ` => ${convertedSymbol} ${convertedValue}&#10;`;
                    priceDiffEx += `This item is ${convertedSymbol} ${Math.abs(convertedValueRaw).toFixed(convertedLeadingZeros)} ${priceDiff < 0 ? 'cheaper' : 'more expensive'} than on Steam.`;
                    break;
                case ExtensionSettings.ListingDifferenceStyle.PERCENTAGE_DIFFERENCE:
                    priceDiffStr = `${Util.embedDecimalSmall(((priceDiff / steamPriceCNY) * 100).toFixed(2))}%`;
                    priceDiffEx += `=> ${priceDiff.toFixed(2)} / ${steamPriceCNY} * 100&#10;`;
                    priceDiffEx += `=> This item is ${Math.abs(((priceDiff / steamPriceCNY) * 100)).toFixed(2)}% ${priceDiff < 0 ? 'cheaper' : 'more expensive'} than on Steam.`;
                    break;
                case ExtensionSettings.ListingDifferenceStyle.NONE:
                default:
                    priceDiffStr = '';
                    break;
            }

            let price_str = `${GlobalConstants.SYMBOL_YUAN} ${await Util.formatNumber(dataRow.price, 2)}`;

            const { convertedSymbol, convertedFormattedValue } = await Util.convertCNYRaw(price);

            let newHTML = Util.buildHTML('div', {
                style: {
                    'display': 'table-cell'
                },
                content: [
                    Util.buildHTML('strong', {
                        class: 'f_Strong',
                        content: [ price_str ]
                    }),
                    Util.buildHTML('p', {
                        content: [
                            Util.buildHTML('span', {
                                class: 'c_Gray f_12px',
                                content: [ `(${convertedSymbol} ${convertedFormattedValue})` ]
                            }),
                            Util.buildHTML('div', {
                                class: 'f_12px',
                                style: {
                                    'color': priceDiff < 0 ? GlobalConstants.COLOR_GOOD : GlobalConstants.COLOR_BAD
                                },
                                attributes: {
                                    'title': priceDiffEx
                                },
                                content: [ `${priceDiff < 0 ? GlobalConstants.SYMBOL_ARROW_DOWN : GlobalConstants.SYMBOL_ARROW_UP}${priceDiffStr}` ]
                            })
                        ]
                    })
                ]
            });

            if (can_expand_screenshots && (dataRow.asset_info?.info?.inspect_trn_url ?? '').length > 0) {
                let img_src = dataRow.img_src + data.fop_str;

                let fopString = await getSetting(Settings.CUSTOM_FOP);

                switch (await getSetting(Settings.EXPAND_TYPE)) {
                    case ExtensionSettings.ExpandScreenshotType.PREVIEW:
                        if (dataRow.can_use_inspect_trn_url) {
                            img_src = `${dataRow.img_src}${fopString}`;
                        } else {
                            img_src = `${dataRow.asset_info.info.inspect_trn_url}${fopString}`;
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

            if (isBalanceYuan) {
                let aBuy = row.querySelector('td a.btn-buy-order[data-asset-info]');
                let aBargain = dataRow.can_bargain ? row.querySelector('td a.bargain[data-asset-info]') : null;
                // console.debug(aBuy, aBargain);

                if (aBuy && price > nrBalance && (await getSetting(Settings.COLOR_LISTINGS))[0]) {
                    aBuy.setAttribute('style', `background: ${GlobalConstants.COLOR_BAD};`);
                }

                if (aBargain && +dataRow.lowest_bargain_price > nrBalance && (await getSetting(Settings.COLOR_LISTINGS))[1]) {
                    aBargain.setAttribute('style', `color: ${GlobalConstants.COLOR_BAD} !important;`);
                }
            }

            //add date of listing
            if (await getSetting(Settings.EXPERIMENTAL_SHOW_LISTING_DATE)) {
                let date = new Date(dataRow.created_at * 1_000);
                let timeEpoch = Date.now() - (dataRow.created_at * 1_000);
                let dateHours = Math.floor(timeEpoch / 3_600_000);
                let dateDiv = document.createElement('div');

                dateDiv.setAttribute('title', date.toUTCString());
                dateDiv.setAttribute('style', 'font-size: 12px; color: #959595; transform: translate(3.5%, 20%);');

                let dateText = `${dateHours < 49 ? `${dateHours} hour${dateHours == 1 ? '' : 's'}` : `${Math.floor(timeEpoch / 3_600_000 / 24)} days`} ago`;
                dateDiv.innerHTML = `<i class="icon icon_time"></i><p style="display: inline; vertical-align: middle; margin-left: 5px;">${dateText}</p>`;

                (<NodeListOf<HTMLElement>>row.querySelectorAll('td.t_Left')).forEach(element => {
                    if (element.querySelector('.user-thum')) {
                        element.appendChild(dateDiv);
                    }
                });
            }
        }

        if (updated_preview > 0) {
            console.debug('[BuffUtility] Preview adjusted for', updated_preview, `element${updated_preview == 1 ? '.' : 's.'}`, 'type:', await getSetting(Settings.EXPAND_TYPE) == 0 ? 'PREVIEW' : 'INSPECT');
        }
    }

    async function adjustBuyOrderListings(transferData: InjectionService.TransferData<BuffTypes.BuyOrder.Data>): Promise<void> {
        let data = transferData.data;
        let rows = <NodeListOf<HTMLElement>>document.querySelectorAll('table.list_tb tr');

        for (let i = 1, l = rows.length; i < l; i ++) {
            let dataRow = data.items[i - 1];
            let row = rows.item(i);

            const { convertedSymbol, convertedFormattedValue } = await Util.convertCNYRaw(dataRow.price);

            let newHTML = Util.buildHTML('div', {
                style: {
                    'display': 'table-cell'
                },
                content: [
                    Util.buildHTML('strong', {
                        class: 'f_Strong',
                        content: [ `${GlobalConstants.SYMBOL_YUAN} ${await Util.formatNumber(dataRow.price)}` ]
                    }),
                    Util.buildHTML('p', {
                        content: [
                            Util.buildHTML('span', {
                                class: 'c_Gray f_12px',
                                content: [ `(${convertedSymbol} ${convertedFormattedValue})` ]
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

    async function adjustBillOrderTransactions(transferData: InjectionService.TransferData<BuffTypes.BillOrder.Data>): Promise<void> {
        // if feature is disabled, skip
        if (!(await getSetting(Settings.EXPERIMENTAL_ADJUST_TRADE_RECORDS))) {
            return;
        }

        // if no items, skip
        if (transferData?.data?.items?.length == 0) {
            return;
        }

        const rows = <NodeListOf<HTMLElement>>document.querySelectorAll('table.list_tb tbody > tr');

        // if no rows, skip
        if (rows?.length == 0) {
            return;
        }

        const sum = <HTMLElement>document.querySelector('.detail-cont .detail-summ strong.f_Strong');
        let referencePrice = -1;
        if (sum) {
            const match = /¥ (\d+(?:\.\d{2}))\(/.exec(sum.innerText) ?? [];
            const parsedReference = parseFloat(match[1]);

            if (isFinite(parsedReference)) {
                referencePrice = parsedReference;
            }
        }

        // start at one to skip the header row
        for (let i = 1, l = rows.length; i < l; i ++) {
            // subtract one for the real data
            const item = transferData.data.items[i - 1];
            const row = rows.item(i);

            const priceTD = <HTMLElement>row.querySelector('strong.f_Strong')?.parentElement;

            // if we have no price container, skip
            if (!priceTD) {
                continue;
            }

            const convertedPrice = await Util.convertCNYRaw(item.price);
            const diff = convertedPrice.originalCNY - referencePrice;
            const convertedDiff = await Util.convertCNYRaw(diff);

            let diffPContent: string;
            const listingStyle = await getSetting(Settings.LISTING_DIFFERENCE_STYLE);
            switch (listingStyle) {
                case ExtensionSettings.ListingDifferenceStyle.CURRENCY_DIFFERENCE:
                    diffPContent = `${GlobalConstants.SYMBOL_YUAN} ${await Util.formatNumber(diff)}`;
                    break;
                case ExtensionSettings.ListingDifferenceStyle.CONVERTED_CURRENCY_DIFFERENCE:
                    diffPContent = `${convertedDiff.convertedSymbol} ${convertedDiff.convertedFormattedValue}`;
                    break;
                case ExtensionSettings.ListingDifferenceStyle.PERCENTAGE_DIFFERENCE:
                    diffPContent = referencePrice == -1 ? '?%' : `${Util.embedDecimalSmall(((diff / referencePrice) * 100).toFixed(2))}%`;
                    break;
                case ExtensionSettings.ListingDifferenceStyle.NONE:
                default:
                    diffPContent = '';
                    break;
            }

            const diffP = listingStyle != ExtensionSettings.ListingDifferenceStyle.NONE ? (referencePrice > -1 ? Util.buildHTML('p', {
                class: 'c_Gray f_12px',
                style: {
                    color: `${diff > 0 ? GlobalConstants.COLOR_BAD : GlobalConstants.COLOR_GOOD} !important`
                },
                content: [ `${diff > 0 ? GlobalConstants.SYMBOL_ARROW_UP : GlobalConstants.SYMBOL_ARROW_DOWN}${diffPContent}` ]
            }) : '') : '<p class="c_Gray f_12px" data-buinfo="content is hidden as listing style is none"></p>';

            priceTD.innerHTML = Util.buildHTML('strong', {
                class: 'f_Strong',
                content: [ `${GlobalConstants.SYMBOL_YUAN} ${await Util.formatNumber(item.price)}` ]
            }) + Util.buildHTML('p', {
                content: [
                    Util.buildHTML('span', {
                        class: 'c_Gray f_12px',
                        content: [ `${convertedPrice.convertedSymbol} ${convertedPrice.convertedFormattedValue}` ]
                    })
                ]
            }) + diffP;
        }
    }

    async function addSingleListingSP(data: unknown, settingContext?: Settings): Promise<void> {
        // they were pre-fetched, don't bother executing on hover
        if (settingContext != Settings.EXPERIMENTAL_FETCH_LISTING_SPP && await getRequestSetting(Settings.EXPERIMENTAL_FETCH_LISTING_SPP)) {
            return;
        }

        let detailDoc: HTMLElement;

        try {
            detailDoc = new DOMParser().parseFromString(data['raw_content'], 'text/html').documentElement;
        } catch (_ /* discard */) { }

        // the detail doc actually needs to be valid
        if (detailDoc == null) {
            return;
        }

        let extractionMinPrice = +(/data-price="(\d+\.?\d+)"/.exec(document.getElementById('market_min_price_pat').innerText) ?? [])[1];

        // the item min price needs to be valid
        if (!isFinite(extractionMinPrice) || isNaN(extractionMinPrice)) {
            return;
        }

        let assetInfos = detailDoc.querySelectorAll('[data-asset-info]');

        let parsedAssetInfos: {
            assetid: string,
            classid: string,
            instanceid: string,
            info: {
                stickers: {
                    sell_reference_price: string
                }[]
            }
        }[] = [];

        assetInfos.forEach(x => {
            parsedAssetInfos.push(Util.tryParseJson(x.getAttribute('data-asset-info')));
        });

        // the data needs to contain more than 0 stickers (obviously)
        let stickerInfos = parsedAssetInfos.find(x => x.info.stickers.length > 0);
        if (stickerInfos == null) {
            return;
        }

        let assetId = parsedAssetInfos.find(x => x?.assetid != null)?.assetid;
        let classId = parsedAssetInfos.find(x => x?.classid != null)?.classid;
        let instanceId = parsedAssetInfos.find(x => x?.instanceid != null)?.instanceid;

        // all of these need to be valid to pass
        if (assetId == null || classId == null || instanceId == null) {
            return;
        }

        let listingOrderId = document.querySelector(`[data-classid="${classId}"][data-instanceid="${instanceId}"][data-assetid="${assetId}"]`)?.getAttribute('data-orderid');

        // if we have no listing order we have no listing price anyway
        if (listingOrderId == null) {
            return;
        }

        let listingRow = <HTMLElement>document.querySelector(`#sell_order_${listingOrderId}`);
        let stickerContainer = <HTMLElement>listingRow.querySelector(`td.t_Left div.csgo_sticker`);

        // no sicker container means no sp% spot
        if (stickerContainer == null) {
            return;
        }

        let listingPrice = +(listingRow.querySelector('a[data-price]')?.getAttribute('data-price'));

        // the item price needs to be valid
        if (!isFinite(listingPrice) || isNaN(listingPrice)) {
            return;
        }

        let stickerSum = 0;
        for (let sticker of stickerInfos.info.stickers) {
            stickerSum += +sticker.sell_reference_price;
        }

        let spContainer = <HTMLElement>document.createElement('div');

        stickerContainer.prepend(spContainer);

        spContainer.outerHTML = Util.buildHTML('div', {
            class: 'f_12px c_Gray',
            style: {
                'text-align': 'center'
            },
            attributes: {
                'title': `BuffUtility SP% may not be 100% accurate, please always double check! &#10;Market Price: ${extractionMinPrice.toFixed(2)} | Listing Price: ${listingPrice.toFixed(2)} | Sticker Sum: ${stickerSum.toFixed(2)}&#10;( ${listingPrice.toFixed(2)} - ${extractionMinPrice.toFixed(2)} ) / ${stickerSum.toFixed(2)} => ${((listingPrice - extractionMinPrice) / stickerSum).toFixed(3)}`
            },
            content: [ `SP: ${GlobalConstants.SYMBOL_YUAN}${stickerSum.toFixed(2)} (${(((listingPrice - extractionMinPrice) / stickerSum) * 100).toFixed(1)} %)` ]
        });
    }

    init();

}
