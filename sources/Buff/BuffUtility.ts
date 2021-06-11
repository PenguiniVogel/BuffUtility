///<reference path="BuffConstants.ts"/>
///<reference path="../Util.ts"/>
///<reference path="../Cookie.ts"/>
///<reference path="BuffApi.ts"/>

/**
 * Copyright 2021 Felix Vogel
 * BuffUtility is not affiliated with buff.163.com or NetEase
 */
/** */
module BuffUtility {

    interface CurrencyRates {
        date: string,
        rates: {
            //symbol: [rate, decimals]
            [name: string]: [number, number]
        }
    }

    interface BuffUtilityOptions {
        selectedCurrency: string
    }

    const ATTR_CONVERTED_CURRENCY: string = 'data-buff-utility-converted-currency';
    const ATTR_CONVERTED_BUY_ORDER: string = 'data-buff-utility-converted-buy-order';
    const NOT_CONVERTED_CURRENCY: string = `:not([${ATTR_CONVERTED_CURRENCY}])`;
    const NOT_CONVERTED_BUY_ORDER: string = `:not([${ATTR_CONVERTED_BUY_ORDER}])`;

    const ATTR_REQUESTED_REFERENCE_PRICE: string = 'data-buff-utility-requested-reference-price';
    const NOT_REQUESTED_REFERENCE_PRICE: string = `:not([${ATTR_REQUESTED_REFERENCE_PRICE}])`;

    const ATTR_REQUESTED_BO_PRICE: string = 'data-buff-utility-requested-buy-order-price';
    const NOT_REQUESTED_BO_PRICE: string = `:not([${ATTR_REQUESTED_BO_PRICE}])`;

    const BUFF_UTILITY_HOVER = 'data-buff-utility-target="converted-hover-currency"';

    /**
     * pattern: the url pattern
     * queries: the queries to convert
     * @private
     */
    const selectors: { pattern: RegExp, queries: string[], ignoreLog?: boolean }[] = [
        {
            pattern: /^.*buff\.163\.com.*$/,
            queries: [
                `h4${NOT_CONVERTED_CURRENCY} > #navbar-cash-amount`,
                `.index-goods-list > li > p${NOT_CONVERTED_CURRENCY} > strong.f_Strong`
            ]
        },
        {
            pattern: /^.*buff\.163\.com\/user-center\/asset\/recharge.*$/,
            queries: [
                `div${NOT_CONVERTED_CURRENCY} > #alipay_amount`,
                `div${NOT_CONVERTED_CURRENCY} > #cash_amount`,
                `div${NOT_CONVERTED_CURRENCY} > #frozen_amount`
            ]
        },
        {
            pattern: /^.*buff\.163\.com\/market\/(buy_order\/to_create)?\?game=.*$/,
            queries: [
                // `#j_list_card > ul > li > p${NOT_CONVERTED_CURRENCY} > strong.f_Strong`
            ]
        },
        {
            pattern: /^.*buff\.163\.com\/market\/goods\?.*(?:tab=(?:selling|buying|top-bookmarked))?.*$/,
            queries: [
                `.list_tb > tbody > tr > td > div${NOT_CONVERTED_CURRENCY} > strong.f_Strong`,
                `#j_popup_supply_sell_preview td > ul > li:nth-child(2) > span${NOT_CONVERTED_CURRENCY}.f_Strong > span`
            ]
        },
        {
            pattern: /^.*buff\.163\.com\/market\/(?:goods\?.*tab=history.*|sell_order\/history.*|buy_order\/(?:wait_supply|supplied|history).*)$/,
            queries: [
                `.list_tb > tbody > tr > td${NOT_CONVERTED_CURRENCY} > strong.f_Strong`
            ]
        },
        {
            pattern: /^.*buff\.163\.com\/market\/sell_order\/stat.*$/,
            queries: [
                `#j_sold-count > div.count-item > ul > li${NOT_CONVERTED_CURRENCY}:first-child > h5`
            ]
        },
        {
            pattern: /^.*buff\.163\.com\/market\/steam_inventory.*$/,
            queries: [
                `#j_list_card > ul > li > p${NOT_CONVERTED_CURRENCY} > strong.f_Strong`
            ]
        },
        {
            pattern: /^.*buff\.163\.com\/market\/buy_order\/to_create\?game=.*$/,
            queries: [
                `td > ul > li${NOT_CONVERTED_CURRENCY} > strong.f_Strong.sell-MinPrice`,
                `td > ul > li${NOT_CONVERTED_CURRENCY} > strong.f_Strong.buy-MaxPrice`
            ]
        },
        {
            pattern: /^.*buff\.163\.com\/market\/buy_order\/to_create\?game=.*$/,
            queries: [
                `tr > td > span.f_Strong.total_amount`
            ],
            ignoreLog: true
        },
        {
            pattern: /^.*buff\.163\.com\/market\/goods\?.*(?:tab=(?:selling|buying|top-bookmarked))?.*$/,
            queries: [
                `#supply_sell_total_price`
            ],
            ignoreLog: true
        },
        {
            pattern: /^.*buff\.163\.com\/market\/sell_order\/to_deliver.*$/,
            queries: [
                `.list_tb > tbody > tr > td${NOT_CONVERTED_CURRENCY} > strong.f_Strong`
            ],
            ignoreLog: true
        },
        {
            pattern: /^.*buff\.163\.com\/market\/steam_inventory.*$/,
            queries: [
                `.list_tb-body tr > td${NOT_CONVERTED_CURRENCY} > strong.f_Strong`,
                `p > span.f_Strong.real_income`
            ],
            ignoreLog: true
        },
        {
            pattern: /^.*buff\.163\.com\/market\/sell_order\/on_sale.*$/,
            queries: [
                `p > span.f_Strong.real_income`,
                `#popup-container .list_tb > tbody td${NOT_CONVERTED_CURRENCY} > strong.f_Strong`
            ],
            ignoreLog: true
        }
    ];

    let loaded: boolean = false;
    let pageLoading: boolean = true;
    let soLoaded: boolean = false;
    let boLoaded: boolean = false;

    // let url: string = '';

    /**
     * The stored options
     * @private
     */
    let programOptions: BuffUtilityOptions = {
        selectedCurrency: 'USD'
    };

    /**
     * Stores the current currency rates
     */
    let cachedCurrencyRates: CurrencyRates;

    /**
     * Stores the select element
     */
    let currencySelection: HTMLSelectElement;

    export function init(): void {
        console.info('[BuffUtility] Initialized.');

        let cookieValue: string;

        try {
            cookieValue = Cookie.read(COOKIE_BUFF_UTILITY_OPTIONS);
        } catch {
            console.info('[BuffUtility] Cookie was not found.');

            Cookie.write(COOKIE_BUFF_UTILITY_OPTIONS, JSON.stringify(programOptions));
        }

        programOptions = !!cookieValue ? JSON.parse(cookieValue) : programOptions;

        addCurrencySelection();

        if (/^.*buff\.163\.com.*goods_id=\d+/.test(window.location.href)) {
            let goodsId = Util.getGoodsId(window.location.href);

            if (goodsId != '-1') {
                // BuffApi.getSellOrderInformation(goodsId, () => {
                //     console.info(`[BuffUtility] Fetched and stored sell_order ${goodsId}.`);
                //
                //     soLoaded = true;
                // }, () => { /* honestly */ });

                BuffApi.getBuyOrderInformation(goodsId, () => {
                    console.info(`[BuffUtility] Fetched and stored buy_order ${goodsId}.`);

                    boLoaded = true;
                }, () => { /* honestly */ });
            }
        }

        setInterval(() => {
            let loading = document.querySelector('#j_market_card > div.spinner.showLoading');

            if (loading && !pageLoading) {
                pageLoading = true;
            }

            if (!loading && pageLoading) {
                pageLoading = false;
                console.debug('[BuffUtility] Buff page loaded.');

                // (<HTMLElement>document.querySelector('#j_market_card')).style['display'] = 'none';

                if (/^.*buff\.163\.com\/market\/\?game=.*tab=(?:selling|buying|top-bookmarked).*$/.test(window.location.href)) {
                    setTimeout(() => {
                        addReferencePriceDifferenceBatch();
                    }, 100);
                }
            }
        }, 50);

        setInterval(() => {
            if (!loaded || pageLoading) return;

            convertSelectors();

            if (/^.*buff\.163\.com\/market\/sell_order\/on_sale.*$/.test(window.location.href)) {
                addSellingAfterFeeGain();
            }

            if (/^.*buff\.163\.com\/market\/goods\?goods_id=\d+(?:.*#tab=selling.*)?$/.test(window.location.href) && boLoaded) {
                addHighestBuyOrderDifference();
            }

            if (/^.*buff\.163\.com\/market\/sell_order\/history.*$/.test(window.location.href) || /^.*buff\.163\.com\/market\/goods\?.*tab=buying.*$/.test(window.location.href)) {
                addBuyOrderGain();
            }
        }, 1000);

        // addReferencePriceDifference();
    }

    /**
     * Add the currency selection to the main navigation bar
     * @private
     */
    function addCurrencySelection(): void {
        fRequest.get('https://felixvogel.github.io/currency-repository/rates.json', null, (req, args, e?) => {
            if (!(req.readyState == 4 && req.status == 200)) return;

            cachedCurrencyRates = Util.parseJson(req);

            let options: string = '';

            let keys = Object.keys(cachedCurrencyRates.rates);
            for (let l_Key of keys) {
                options += `<option${(l_Key.indexOf(programOptions.selectedCurrency) > -1 ? ' selected' : '')}>${l_Key}</option>`;
            }

            let nav: HTMLElement = <HTMLElement>document.querySelector('div.nav.nav_entries');

            let currencyDiv: HTMLElement = document.createElement('div');
            currencyDiv.setAttribute('style', 'position: relative; float: right;');

            currencySelection = document.createElement('select');

            currencySelection.innerHTML = options;

            currencySelection.onchange = () => {
                programOptions.selectedCurrency = currencySelection?.selectedOptions?.item(0)?.innerText ?? 'USD';

                console.info(`[BuffUtility] Currency changed -> ${programOptions.selectedCurrency}`, cachedCurrencyRates.rates[programOptions.selectedCurrency]);

                Cookie.write(COOKIE_BUFF_UTILITY_OPTIONS, JSON.stringify(programOptions));

                updateConvertedCurrency();
            };

            currencyDiv.append(currencySelection);

            if (nav) nav.prepend(currencyDiv);

            loaded = true;
        });
    }

    /**
     * Convert the specified amount of yuan to the currently selected currency
     * @param yuan The amount of yuan
     * @private
     */
    function convertCurrency(yuan: number): string {
        let selectedRate: [number, number] = cachedCurrencyRates.rates[programOptions.selectedCurrency];

        return `~${programOptions.selectedCurrency} ${(yuan * selectedRate[0]).toFixed(selectedRate[1])}`;
    }

    /**
     * Create a <e> hover element that stores the converted currency
     * @param text The display text
     * @param yuan The amount of yuan to convert
     * @private
     */
    function createCurrencyHoverContainer(text: string, yuan: number): string {
        return `<e title="${convertCurrency(yuan)}" ${BUFF_UTILITY_HOVER}>${text}</e>`;
    }

    /**
     * Reads the amount of yuan in the specified element
     * @param element The element to read from
     * @private
     */
    function readYuan(element: HTMLElement | string): number {
        let priceString: string = (typeof element == 'string' ? element : element.innerHTML).replace(/\(|\)|¥|<\/?small>|<\/?big>/g, '').trim();

        let price: number = 0.0;
        try {
            price = parseFloat(priceString);
        } catch {
            console.error(`[BuffUtility] Price parsing failed for: ${element}`);
        }

        return price;
    }

    /**
     * Converts the selling price to the actual sum you receive with included conversion
     * @private
     */
    function addSellingAfterFeeGain(): void {
        let elements: NodeListOf<Element> = document.querySelectorAll(`#j_list_card p${NOT_CONVERTED_CURRENCY} > strong.sell_order_price`);

        for (let i = 0, l = elements.length; i < l; i ++) {
            let priceElement: HTMLElement = <HTMLElement>elements.item(i);
            let parent: HTMLElement = priceElement.parentElement;

            let price: number = readYuan(priceElement) * 0.975;

            parent.setAttribute(ATTR_CONVERTED_CURRENCY, '');

            parent.setAttribute('style', 'margin-top: -5px; display: grid; grid-template-columns: auto; grid-template-rows: auto auto;');

            parent.innerHTML += `<strong style="color: #eea20e; font-size: 11px;">${createCurrencyHoverContainer(`(${SYMBOL_YUAN} ${price.toFixed(2)})`, price)}</strong>`;
        }
    }

    function addHighestBuyOrderDifference(): void {
        let goodsId = Util.getGoodsId(window.location.href);

        if (goodsId == '-1') {
            return console.info('[BuffUtility] Unable to parse id.');
        }

        let listings = document.querySelectorAll(`.list_tb > tbody > tr > td > div${NOT_REQUESTED_BO_PRICE} > strong.f_Strong`);

        if (listings.length <= 0) return;

        BuffApi.getBuyOrderInformation(goodsId, (info) => {
            for (let i = 0, l = listings.length; i < l; i ++) {
                let listing = <HTMLElement>listings.item(i);
                let div = listing?.parentElement;

                if (!listing || !div) continue;

                div.setAttribute(ATTR_REQUESTED_BO_PRICE, '');

                let price = readYuan(<HTMLElement>(listing.querySelector('e') ?? listing));
                let bo = -1;

                try {
                    bo = parseFloat(info.price);
                } catch {}

                if (bo == -1) {
                    console.debug('[BuffUtility] Failed to get buy order price.', listing);
                } else {
                    let diff = price - (bo * 0.975);

                    div.innerHTML += `<div style="color: ${(diff < 0 ? '#137800' : '#950000')}; font-size: 12px;">(${(diff < 0 ? SYMBOL_ARROW_DOWN : SYMBOL_ARROW_UP)} ${(diff < 0 ? diff * -1 : diff).toFixed(2)})</div>`;
                }
            }
        }, (status) => { });

        // for (let i = 0, l = listings.length; i < l; i ++) {
        //     let listing = <HTMLElement>listings.item(i);
        //     let div = listing.parentElement;
        //
        //     div.setAttribute(ATTR_REQUESTED_BO_PRICE, '');
        //
        //     let goodsId = Util.getGoodsId(window.location.href);
        //
        //     if (goodsId == '-1') {
        //         console.info('[BuffUtility] Unable to parse price.', listing);
        //         continue;
        //     }
        //
        //     BuffApi.getBuyOrderInformation(goodsId, (info) => {
        //         let price = readYuan(<HTMLElement>(listing.querySelector('e') ?? listing));
        //         let bo = -1;
        //
        //         try {
        //             bo = parseFloat(info.price);
        //         } catch {}
        //
        //         if (bo == -1) {
        //             console.debug('[BuffUtility] Failed to get buy order price.', listing);
        //         } else {
        //             let diff = price - bo;
        //
        //             div.innerHTML += `<div style="color: ${(diff < 0 ? '#137800' : '#950000')}; font-size: 12px;">(${(diff < 0 ? SYMBOL_ARROW_DOWN : SYMBOL_ARROW_UP)} ${(diff < 0 ? diff * -1 : diff).toFixed(2)})</div>`;
        //         }
        //     }, (status) => { });
        // }
    }

    /**
     * Adds how much you gain if you were to supply a buy order
     * also used in the sale history
     * @private
     */
    function addBuyOrderGain(): void {
        let elements: NodeListOf<Element> = document.querySelectorAll(`.list_tb > tbody > tr > td > div${NOT_CONVERTED_BUY_ORDER} > strong.f_Strong, .list_tb > tbody > tr > td${NOT_CONVERTED_BUY_ORDER} > strong.f_Strong`);

        for (let i = 0, l = elements.length; i < l; i ++) {
            let baseElement: HTMLElement = <HTMLElement>elements.item(i);
            let priceElement: HTMLElement = baseElement.querySelector('e');
            let parent: HTMLElement = baseElement.parentElement;

            let price: number = readYuan(priceElement) * 0.975;

            parent.setAttribute(ATTR_CONVERTED_BUY_ORDER, '');

            parent.innerHTML += `<div style="font-size: 12px; margin-top: 3px;" class="f_Strong">${createCurrencyHoverContainer(`(${SYMBOL_YUAN} ${price.toFixed(2)})`, price)}</div>`;
        }
    }

    /*
     * Adds the percent difference of the cheapest listing to the reference price
     * @private
     *
    function addReferencePriceDifference(): any {
        // Don't start the function if we arent on the right sites
        if (!(/^.*buff\.163\.com\/market\/\?game=.*tab=(?:selling|buying|top-bookmarked).*$/.test(window.location.href) ||
            /^.*buff\.163\.com\/(?:\?game=.*)?$/.test(window.location.href))) return;

        let listing = document.querySelector(`#j_list_card > ul > li > a${NOT_REQUESTED_REFERENCE_PRICE}[href^="/market/goods?goods_id="], .list_card > .index-goods-list > li > a${NOT_REQUESTED_REFERENCE_PRICE}[href^="/market/goods?goods_id="]`);

        if (!listing) return setTimeout(() => addReferencePriceDifference(), 500);

        listing.setAttribute(ATTR_REQUESTED_REFERENCE_PRICE, '');

        // ask for another one to work in parallel - 250ms delay
        setTimeout(() => addReferencePriceDifference(), 250);

        let href = listing.getAttribute('href');
        let goodsId = Util.getGoodsId(href);

        if (goodsId == '-1') {
            console.info(`[BuffUtility] Unable to get goodsId for ${href}`);
            return;
        }

        BuffApi.getSellOrderInformation(goodsId, (info) => {
            // max retry was reached
            if (info == null) {
                console.debug(`[BuffUtility] Failed to fetch ${goodsId}, reason: MAX_RETRY_LIMIT. Retrying in 4 seconds.`);
                return setTimeout(() => {
                    let retryListings = <HTMLElement>document.querySelector(`#j_list_card > ul > li > a[href^="/market/goods?goods_id=${goodsId}"], .list_card > .index-goods-list > li > a[href^="/market/goods?goods_id=${goodsId}"]`);
                    retryListings?.removeAttribute(ATTR_REQUESTED_REFERENCE_PRICE);
                }, 4000);
            }

            let referencePrice = parseFloat(info.steam_price_cny ?? '-1');

            if (referencePrice == -1) {
                console.debug(`[BuffUtility] Unable to fetch reference price for ${goodsId}`);

                return setTimeout(() => addReferencePriceDifference(), 1);
            }

            let listing = <HTMLElement>document.querySelector(`#j_list_card > ul > li > a:not([${ATTR_REQUESTED_REFERENCE_PRICE}="1"])[href^="/market/goods?goods_id=${goodsId}"], .list_card > .index-goods-list > li > a:not([${ATTR_REQUESTED_REFERENCE_PRICE}="1"])[href^="/market/goods?goods_id=${goodsId}"]`);

            if (!listing) return setTimeout(() => addReferencePriceDifference(), 1);

            listing.setAttribute(ATTR_REQUESTED_REFERENCE_PRICE, '1');

            let li_parent: HTMLElement = listing.parentElement;
            let p = <HTMLElement>li_parent.querySelector(`p`);
            let price = readYuan(<HTMLElement>p.querySelector('strong.f_Strong > e') ?? <HTMLElement>p.querySelector('strong.f_Strong'));

            let diff = ((referencePrice - price) / referencePrice) * -1 * 100;

            p.style['margin-top'] = '-12px';
            p.innerHTML += `<div style="color: ${diff < 0 ? '#137800' : '#950000'}; font-size: 11px; margin-left: 3px;">(${diff.toFixed(2)}%)</div>`;
        }, (status) => {
            console.debug(`[BuffUtility] Failed to fetch ${goodsId}, reason: ${status}. Retrying in 2.5 seconds.`);
        });
    } */

    /**
     * Adds the reference price difference to scm and converts to the selected currency
     * @private
     */
    function addReferencePriceDifferenceBatch(): void {
        // if (url == window.location.href) return;
        // url = window.location.href;
        BuffApi.getTab();

        BuffApi.getMarketJsonData((json) => {
            let liCollection = document.querySelectorAll('#j_list_card > ul > li');

            const tab = BuffApi.getTab();

            for (let i = 0, l = liCollection.length; i < l; i ++) {
                let li = <HTMLElement>liCollection.item(i);

                let a = <HTMLElement>li.querySelector('a');
                let a_img = <HTMLElement>li.querySelector('a > img');
                let h3 = <HTMLElement>li.querySelector('h3');
                let h3_a = <HTMLElement>li.querySelector('h3 > a');
                // let p = <HTMLElement>li.querySelector('p');
                // let p_strong = <HTMLElement>li.querySelector('p > strong');
                // let p_span = <HTMLElement>li.querySelector('p > span');
                let spansAdditional = li.querySelectorAll('span.tag');

                let priceStr: string[];
                let price: number;
                let scm_price: number;
                let diff: number;
                let hsl: string;
                // let exterior: BuffApi.InfoTags[keyof BuffApi.InfoTags];

                switch (tab) {
                    case 'selling':
                    case 'goods':
                    case 'buying':
                    case 'goods/buying':
                        let goodsItem = (<BuffApi.GoodsPageResponse>json).data.items[i];

                        a.setAttribute('href', `/market/goods?goods_id=${goodsItem.id}&from=market#tab=selling`);
                        a.setAttribute('title', goodsItem.short_name);

                        a_img.setAttribute('src', goodsItem.goods_info.icon_url);
                        a_img.setAttribute('data-original', goodsItem.goods_info.original_icon_url);

                        h3_a.setAttribute('href', `/market/goods?goods_id=${goodsItem.id}&from=market#tab=selling`);
                        h3_a.setAttribute('title', goodsItem.short_name);
                        h3_a.innerText = goodsItem.short_name;

                        let inner_p_strong: string;
                        let inner_p_span: string;
                        let inner_p: string;

                        switch (tab) {
                            case 'selling':
                            case 'goods':
                                priceStr = goodsItem.sell_min_price.split('.');

                                price = readYuan(goodsItem.sell_min_price);
                                scm_price = readYuan(goodsItem.goods_info.steam_price_cny);
                                diff = scm_price <= 0 ? 100 : ((scm_price - price) / scm_price) * -1 * 100;
                                hsl = `hsl(${Math.min(120, Math.max(0, 120 * (diff / 100)))}, 50%, 100%);`;

                                inner_p_strong = createCurrencyHoverContainer(`${SYMBOL_YUAN} ${priceStr[0]}${(!!priceStr[1] ? `<small>.${priceStr[1]}</small>` : '')}`, price);
                                inner_p_span = `<e title="${goodsItem.sell_num.toLocaleString('de-DE')} on sale">${goodsItem.sell_num > 1_000 ? '1.000+' : goodsItem.sell_num} on sale</e>`;
                                inner_p = `<div style="color: ${hsl}; font-size: 11px; margin-left: 3px;">(${diff.toFixed(2)}%)</div>`;

                                break;
                            case 'buying':
                            case 'goods/buying':
                                priceStr = goodsItem.buy_max_price.split('.');

                                price = readYuan(goodsItem.buy_max_price);
                                scm_price = readYuan(goodsItem.goods_info.steam_price_cny);
                                diff = scm_price <= 0 ? 100 : ((scm_price - price) / scm_price) * -1 * 100;
                                hsl = `hsl(${Math.min(120, Math.max(0, 120 * (diff / 100))).toFixed(2)}deg, 100%, 25%);`;

                                inner_p_strong = createCurrencyHoverContainer(`${SYMBOL_YUAN} ${priceStr[0]}${(!!priceStr[1] ? `<small>.${priceStr[1]}</small>` : '')}`, price);
                                inner_p_span = `<e title="${goodsItem.buy_num.toLocaleString('de-DE')} demand">${goodsItem.buy_num > 1_000 ? '1.000+' : goodsItem.buy_num} demand</e>`;
                                inner_p = `<div style="color: ${hsl}; font-size: 11px; margin-left: 3px;">(${diff.toFixed(2)}%)</div>`;

                                break;
                        }

                        (<HTMLElement>li.querySelector('p')).style['marginTop'] = '-12px';
                        (<HTMLElement>li.querySelector('p > strong')).innerHTML = inner_p_strong;
                        (<HTMLElement>li.querySelector('p > span')).innerHTML = inner_p_span;
                        (<HTMLElement>li.querySelector('p')).innerHTML += inner_p;

                        console.log('Appended to', goodsItem.name, goodsItem.id, [li, li.querySelector('p > strong'), li.querySelector('p > span'), li.querySelector('p')]);

                        let goods_span_wearcategory = <HTMLElement>spansAdditional.item(0);

                        if (goodsItem.goods_info.info?.tags['exterior']) {
                            if (goods_span_wearcategory) {
                                goods_span_wearcategory.setAttribute('class', `tag tag_csgo_${goodsItem.goods_info.info.tags['exterior'].internal_name}`);
                                goods_span_wearcategory.innerHTML = goodsItem.goods_info.info.tags['exterior'].localized_name;
                            } else {
                                li.innerHTML = `${li.innerHTML}<span class="tag tag_csgo_${goodsItem.goods_info.info.tags['exterior'].internal_name}">${goodsItem.goods_info.info.tags['exterior'].localized_name}</span>`;
                            }
                        } else if (/^csgo_tool_sticker|type_customplayer$/.test(goodsItem.goods_info.info.tags['type']?.internal_name) && goodsItem.goods_info.info.tags['rarity']) {
                            let rarity = goodsItem.goods_info.info.tags['rarity'];

                            if (goods_span_wearcategory) {
                                goods_span_wearcategory.setAttribute('class', `tag tag_black rarity_${rarity.internal_name}`);
                                goods_span_wearcategory.innerHTML = rarity.localized_name;
                            } else {
                                li.innerHTML = `${li.innerHTML}<span class="tag tag_black rarity_${rarity.internal_name}">${rarity.localized_name}</span>`;
                            }
                        } else {
                            if (goods_span_wearcategory) {
                                goods_span_wearcategory.style['display'] = 'none';
                            }
                        }

                        break;
                    case 'sell_order/top_bookmarked':
                    case 'top-bookmarked':
                        let bookmarkedItem = (<BuffApi.TopBookmarkedResponse>json).data.items[i];
                        let bookmarkedGoodsInfo = (<BuffApi.TopBookmarkedResponse>json).data.goods_infos[bookmarkedItem.goods_id];

                        a.setAttribute('href', `/market/goods?goods_id=${bookmarkedItem.id}&from=market#tab=selling`);
                        a.setAttribute('title', bookmarkedGoodsInfo.short_name);

                        a_img.setAttribute('src', bookmarkedItem.asset_info.info.icon_url ?? bookmarkedGoodsInfo.original_icon_url);
                        a_img.setAttribute('data-original', bookmarkedItem.asset_info.info.icon_url ?? bookmarkedGoodsInfo.original_icon_url);

                        if (li.querySelector('div.wear')) {
                            li.querySelector('div.wear > div.wear-value').innerHTML = `Float: ${bookmarkedItem.asset_info.paintwear}`;

                            let floatP = parseFloat(bookmarkedItem.asset_info.paintwear) * 100;

                            li.querySelector('div.wear > div.wear-pointer > div.wear-pointer-icon').setAttribute('style', `left: ${floatP}%`);
                        }

                        h3.setAttribute('style', 'margin-top: 1px !important;');

                        h3_a.setAttribute('href', `/market/goods?goods_id=${bookmarkedItem.goods_id}&from=market#tab=selling`);
                        h3_a.setAttribute('title', bookmarkedGoodsInfo.short_name);
                        h3_a.innerText = bookmarkedGoodsInfo.short_name;

                        priceStr = bookmarkedItem.price.split('.');

                        price = readYuan(bookmarkedItem.price);
                        scm_price = readYuan(bookmarkedGoodsInfo.steam_price_cny);
                        diff = scm_price <= 0 ? 100 : ((scm_price - price) / scm_price) * -1 * 100;

                        (<HTMLElement>li.querySelector('p')).style['marginTop'] = '-3px';

                        let p_span_a = <HTMLElement>li.querySelector('p > span > a');

                        p_span_a.setAttribute('data-goodsid', `${bookmarkedGoodsInfo.goods_id}`);
                        p_span_a.setAttribute('data-price', `${bookmarkedItem.price}`);
                        p_span_a.setAttribute('data-orderid', `${bookmarkedItem.id}`);
                        p_span_a.setAttribute('data-sellerid', `${bookmarkedItem.user_id}`);
                        p_span_a.setAttribute('data-goods-name', `${bookmarkedGoodsInfo.name}`);
                        p_span_a.setAttribute('data-goods-icon-url', `${bookmarkedGoodsInfo.icon_url}`);
                        p_span_a.setAttribute('data-goods-sell-min-price', '');
                        p_span_a.setAttribute('data-cooldown', `${bookmarkedItem.asset_info.has_tradable_cooldown}`);
                        p_span_a.setAttribute('data-asset-info', `${JSON.stringify(bookmarkedItem.asset_info)}`);

                        (<HTMLElement>li.querySelector('p > strong')).innerHTML = createCurrencyHoverContainer(`${SYMBOL_YUAN} ${priceStr[0]}${(!!priceStr[1] ? `<small>.${priceStr[1]}</small>` : '')}`, price);

                        (<HTMLElement>li.querySelector('p')).innerHTML += `<div style="color: ${diff < 0 ? '#137800' : '#950000'}; font-size: 11px; margin-left: 3px;">(${diff.toFixed(2)}%)</div>`;

                        let tagBoxContent = '';

                        if (/^sticker|type_customplayer$/.test(bookmarkedGoodsInfo.tags['category_group']?.internal_name) && bookmarkedGoodsInfo.tags['rarity']) {
                            let rarity = bookmarkedGoodsInfo.tags['rarity'];

                            tagBoxContent += `<div class="g_Right"> </div>` +
                                `<span class="tag tag_black rarity_${rarity.internal_name}">${rarity.localized_name}</span>`;
                        } else {
                            tagBoxContent += `<div class="g_Right"><a href="javascript:;" style="cursor: pointer;">` +
                                `<i ` +
                                `class="icon icon_spect j_tips_handler btn_game_cms" ` +
                                `data-assetid="${bookmarkedItem.asset_info.assetid}" ` +
                                `data-direction="bottom" ` +
                                `data-title="Inspect in server" ` +
                                `data-content` +
                                `></i>` +
                                `</a>` +
                                `<a style="cursor: pointer;" class="btn_3d" data-assetid="${bookmarkedItem.asset_info.assetid}">` +
                                `<i ` +
                                `class="icon icon_3dpersp j_tips_handler" ` +
                                `data-direction="bottom" ` +
                                `data-title="3D Inspect"` +
                                `></i>` +
                                `</a>` +
                                `</div>`;

                            if (bookmarkedGoodsInfo.tags['exterior']) {
                                tagBoxContent += `<span class="tag tag tag_csgo_${bookmarkedGoodsInfo.tags['exterior'].internal_name}">${bookmarkedGoodsInfo.tags['exterior'].localized_name}</span>`;
                            }

                            if (/^unusual/.test(bookmarkedGoodsInfo.tags['quality']?.internal_name ?? '')) {
                                tagBoxContent += `<span class="tag tag_black quality_${bookmarkedGoodsInfo.tags['quality'].internal_name}">${bookmarkedGoodsInfo.tags['quality'].localized_name}</span>`;
                            }

                            if (bookmarkedItem.asset_info?.info?.phase_data && bookmarkedItem.asset_info?.info?.metaphysic) {
                                tagBoxContent += `<span class="tag tag_gray2 j_tips_handler" data-direction="bottom" data-title="${bookmarkedItem.asset_info.info.metaphysic.title}">${bookmarkedItem.asset_info.info.phase_data.name}</span>`;
                            } else {
                                tagBoxContent += `<span class="tag tag_gray2 j_tips_handler" data-direction="bottom" data-title="Paint seed">${bookmarkedItem.asset_info.info.paintseed}</span>`;
                            }
                        }

                        li.querySelector('div.tagBox').innerHTML = tagBoxContent;

                        let tagBoxBContent = '';

                        if (bookmarkedItem.asset_info?.info?.inspect_en_url) {
                            tagBoxBContent += `<a href="javascript:;" class="l_Right shalow-btn shalow-btn-green csgo-inspect-view" ` +
                                `data-assetid="${bookmarkedItem.asset_info.assetid}" ` +
                                `data-contextid="${bookmarkedItem.asset_info.contextid}" ` +
                                `data-inspecturl="${bookmarkedItem.asset_info.info.inspect_en_url}" ` +
                                `data-inspectversion="${bookmarkedItem.asset_info.info.inspect_version}" ` +
                                `data-inspectsize="${bookmarkedItem.asset_info.info.inspect_en_size}" ` +
                                `>Screenshot</a>`;
                        }

                        for (let i = 0, l = bookmarkedItem.asset_info?.info?.stickers?.length ?? 0; i < l; i ++) {
                            let sticker = bookmarkedItem.asset_info.info.stickers[i];
                            tagBoxBContent += `<span ` +
                                `class="icon icon_stickers j_tips_handler${(sticker.wear > 0 ? ' masked' : '')}" ` +
                                `data-direction="top" ` +
                                `data-title="${sticker.name}" ` +
                                `data-content` +
                                `><img src="${sticker.img_url}" /></span>`;
                        }

                        li.querySelector('div.tagBoxB').innerHTML = tagBoxBContent;

                        break;
                }
            }

            // (<HTMLElement>document.querySelector('#j_market_card')).style['display'] = '';
        });
    }

    /**
     * Adds the converted currency to each listing on the market
     * @private
     */
    function convertSelectors(): void {
        for (let l_Selector of selectors) {
            if (l_Selector.pattern.test(window.location.href) && l_Selector.queries.length > 0) {
                let elements: NodeListOf<Element> = document.querySelectorAll(l_Selector.queries.join(', '));

                if (elements.length > 0) {
                    if (!l_Selector.ignoreLog) {
                        console.info(`[BuffUtility] Converting ${elements.length} element(s).`, l_Selector, programOptions.selectedCurrency, cachedCurrencyRates.rates[programOptions.selectedCurrency]);
                    }
                } else {
                    continue;
                }

                for (let i = 0, l = elements.length; i < l; i ++) {
                    let strong: HTMLElement = <HTMLElement>elements.item(i);
                    let parent: HTMLElement = strong.parentElement;

                    parent.setAttribute(ATTR_CONVERTED_CURRENCY, '');

                    let price: number = readYuan(strong);

                    strong.innerHTML = createCurrencyHoverContainer(strong.innerHTML, price);
                }
            }
        }
    }

    /**
     * Updates converted currencies when switching to a different currency
     * @private
     */
    function updateConvertedCurrency(): void {
        addSellingAfterFeeGain();
        convertSelectors();

        let hovers: NodeListOf<Element> = document.querySelectorAll(`e[${BUFF_UTILITY_HOVER}]`);

        for (let i = 0, l = hovers.length; i < l; i ++) {
            let e: HTMLElement = <HTMLElement>hovers.item(i);

            e.setAttribute('title', convertCurrency(readYuan(e)));
        }
    }

}
