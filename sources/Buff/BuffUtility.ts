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

        // if (/^.*buff\.163\.com.*goods_id=\d+/.test(window.location.href)) {
        //     let goodsId = Util.getGoodsId(window.location.href);
        //
        //     if (goodsId != '-1') {
        //         BuffApi.getSellOrderInformation(goodsId, () => console.info(`[BuffUtility] Fetched and stored sell_order ${goodsId}.`), () => { /* honestly */ });
        //         BuffApi.getBuyOrderInformation(goodsId, () => console.info(`[BuffUtility] Fetched and stored buy_order ${goodsId}.`), () => { /* honestly */ });
        //     }
        // }

        setInterval(() => {
            let loading = document.querySelector('#j_market_card > div.spinner.showLoading');

            if (loading && !pageLoading) {
                pageLoading = true;
            }

            if (!loading && pageLoading) {
                pageLoading = false;
                console.debug('[BuffUtility] Buff page loaded.');

                (<HTMLElement>document.querySelector('#j_market_card')).style['display'] = 'none';

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

            if (/^.*buff\.163\.com\/market\/goods\?goods_id=\d+(?:.*#tab=selling.*)?$/.test(window.location.href)) {
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
        let priceString: string = (typeof element == 'string' ? element : element.innerHTML).replace(/¥|<\/?small>|<\/?big>/g, '').trim();

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
                let div = listing.parentElement;

                div.setAttribute(ATTR_REQUESTED_BO_PRICE, '');

                let price = readYuan(<HTMLElement>(listing.querySelector('e') ?? listing));
                let bo = -1;

                try {
                    bo = parseFloat(info.price);
                } catch {}

                if (bo == -1) {
                    console.debug('[BuffUtility] Failed to get buy order price.', listing);
                } else {
                    let diff = price - bo;

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

        BuffApi.getGoodsPageData((json) => {
            let liCollection = document.querySelectorAll('#j_list_card > ul > li');

            for (let i = 0, l = liCollection.length; i < l; i ++) {
                let item = json.data.items[i];

                let li = <HTMLElement>liCollection.item(i);

                let a = <HTMLElement>li.querySelector('a');
                let a_img = <HTMLElement>li.querySelector('a > img');
                let h3a = <HTMLElement>li.querySelector('h3 > a');
                let p = <HTMLElement>li.querySelector('p');
                let p_strong = <HTMLElement>li.querySelector('p > strong');
                let p_span = <HTMLElement>li.querySelector('p > span');
                let span = <HTMLElement>li.querySelector('span.tag');

                a.setAttribute('href', `/market/goods?goods_id=${item.id}&from=market#tab=selling`);
                a.setAttribute('title', item.short_name);

                a_img.setAttribute('src', item.goods_info.icon_url);
                a_img.setAttribute('data-original', item.goods_info.original_icon_url);

                h3a.setAttribute('href', `/market/goods?goods_id=${item.id}&from=market#tab=selling`);
                h3a.setAttribute('title', item.short_name);
                h3a.innerText = item.short_name;

                let priceStr = item.sell_min_price.split('.');

                let price = readYuan(item.sell_min_price);
                let scm_price = readYuan(item.goods_info.steam_price_cny);
                let diff = scm_price <= 0 ? 100 : ((scm_price - price) / scm_price) * -1 * 100;

                p.style['marginTop'] = '-12px';

                p_strong.innerHTML = createCurrencyHoverContainer(`${SYMBOL_YUAN} ${priceStr[0]}${(!!priceStr[1] ? `<small>.${priceStr[1]}</small>` : '')}`, price);

                p_span.innerHTML = `<e title="${item.sell_num.toLocaleString('de-DE')} on sale">${item.sell_num > 1_000 ? '1.000+' : item.sell_num} on sale</e>`;

                p.innerHTML += `<div style="color: ${diff < 0 ? '#137800' : '#950000'}; font-size: 11px; margin-left: 3px;">(${diff.toFixed(2)}%)</div>`;

                let exterior = item.goods_info.info?.tags['exterior'];

                if (exterior) {
                    if (span) {
                        span.setAttribute('class', `tag tag_csgo_${exterior.internal_name}`);
                        span.innerHTML = exterior.localized_name;
                    } else {
                        li.innerHTML += `<span class="tag tag_csgo_${exterior.internal_name}">${exterior.localized_name}</span>`;
                    }
                } else {
                    if (span) {
                        span.style['display'] = 'none';
                    }
                }
            }

            (<HTMLElement>document.querySelector('#j_market_card')).style['display'] = '';
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
