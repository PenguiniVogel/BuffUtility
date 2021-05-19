/**
 * Author: Felix Vogel
 */
module Cookie {

    export const KEY_BUFF_UTILITY_SELECTED_CURRENCY: string = 'buff_utility_selected_currency';

    export function read(name: string): string {
        let result = new RegExp(`(?:^|; )${encodeURIComponent(name)}=([^;]*)`).exec(document.cookie);

        return result ? result[1] : null;
    }

    export function write(name: string, value: string, days: number = 365 * 20): void {
        let date = new Date();

        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));

        document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
    }

}

/**
 * Author: Felix Vogel
 */
module BuffUtility {

    interface CurrencyRates {
        date: string,
        rates: {
            //symbol: [rate, decimals]
            [name: string]: [number, number]
        }
    }

    const ATTR_CONVERTED_CURRENCY: string = 'data-buff-utility-converted-currency';
    const ATTR_CONVERTED_BUY_ORDER: string = 'data-buff-utility-converted-buy-order';
    const NOT_CONVERTED_CURRENCY: string = `:not([${ATTR_CONVERTED_CURRENCY}])`;
    const NOT_CONVERTED_BUY_ORDER: string = `:not([${ATTR_CONVERTED_BUY_ORDER}])`;

    const BUFF_UTILITY_HOVER = 'data-buff-utility-target="converted-hover-currency"';

    /**
     * pattern: the url pattern
     * queries: the queries to convert
     * @private
     */
    const selectors: { pattern: RegExp, queries: string[], ignoreLog?: boolean }[] = [
        {
            pattern: /^.*buff.163.com.*$/,
            queries: [
                `h4${NOT_CONVERTED_CURRENCY} > #navbar-cash-amount`
            ]
        },
        {
            pattern: /^.*buff.163.com\/user-center\/asset\/recharge.*$/,
            queries: [
                `div${NOT_CONVERTED_CURRENCY} > #alipay_amount`,
                `div${NOT_CONVERTED_CURRENCY} > #cash_amount`,
                `div${NOT_CONVERTED_CURRENCY} > #frozen_amount`
            ]
        },
        {
            pattern: /^.*buff.163.com\/market\/(buy_order\/to_create)?\?game=.*$/,
            queries: [
                `#j_list_card > ul > li > p${NOT_CONVERTED_CURRENCY} > strong.f_Strong`
            ]
        },
        {
            pattern: /^.*buff.163.com\/market\/buy_order\/to_create\?game=.*$/,
            queries: [
                `td > ul > li${NOT_CONVERTED_CURRENCY} > strong.f_Strong.sell-MinPrice`,
                `td > ul > li${NOT_CONVERTED_CURRENCY} > strong.f_Strong.buy-MaxPrice`
            ]
        },
        {
            pattern: /^.*buff.163.com\/market\/buy_order\/to_create\?game=.*$/,
            queries: [
                `tr > td > span.f_Strong.total_amount`
            ],
            ignoreLog: true
        },
        {
            pattern: /^.*buff.163.com\/market\/goods\?.*(?:tab=(?:selling|buying))?.*$/,
            queries: [
                `.list_tb_csgo > tr > td > div${NOT_CONVERTED_CURRENCY} > strong.f_Strong`,
                `#j_popup_supply_sell_preview td > ul > li:nth-child(2) > span${NOT_CONVERTED_CURRENCY}.f_Strong > span`
            ]
        },
        {
            pattern: /^.*buff.163.com\/market\/goods\?.*(?:tab=(?:selling|buying))?.*$/,
            queries: [
                `#supply_sell_total_price`
            ],
            ignoreLog: true
        },
        {
            pattern: /^.*buff.163.com\/market\/(?:goods\?.*tab=history.*|sell_order\/history.*|buy_order\/(?:wait_supply|supplied|history).*)$/,
            queries: [
                `.list_tb_csgo > tr > td${NOT_CONVERTED_CURRENCY} > strong.f_Strong`
            ]
        },
        {
            pattern: /^.*buff.163.com\/market\/sell_order\/to_deliver.*$/,
            queries: [
                `.list_tb_csgo > tr > td${NOT_CONVERTED_CURRENCY} > strong.f_Strong`
            ],
            ignoreLog: true
        },
        {
            pattern: /^.*buff.163.com\/market\/sell_order\/stat.*$/,
            queries: [
                `#j_sold-count > div.count-item > ul > li${NOT_CONVERTED_CURRENCY}:first-child > h5`
            ]
        },
        {
            pattern: /^.*buff.163.com\/market\/steam_inventory.*$/,
            queries: [
                `#j_list_card > ul > li > p${NOT_CONVERTED_CURRENCY} > strong.f_Strong`
            ]
        },
        {
            pattern: /^.*buff.163.com\/market\/steam_inventory.*$/,
            queries: [
                `.list_tb-body tr > td${NOT_CONVERTED_CURRENCY} > strong.f_Strong`,
                `p > span.f_Strong.real_income`
            ],
            ignoreLog: true
        },
        {
            pattern: /^.*buff.163.com\/market\/sell_order\/on_sale.*$/,
            queries: [
                `p > span.f_Strong.real_income`,
                `#popup-container .list_tb_csgo td${NOT_CONVERTED_CURRENCY} > strong.f_Strong`
            ],
            ignoreLog: true
        }
    ];

    /**
     * Stores the currently selected currency
     * @private
     */
    let selectedCurrency: string = 'USD';

    let cachedCurrencyRates: CurrencyRates;

    /**
     * Stores the select element
     */
    let currencySelection: HTMLSelectElement;

    export function init(): void {
        console.info('[BuffUtility] Initialized.');

        let cookieValue: string = 'USD';

        try {
            cookieValue = Cookie.read(Cookie.KEY_BUFF_UTILITY_SELECTED_CURRENCY);
        } catch {
            console.info('[BuffUtility] Cookie was not found.');

            Cookie.write(Cookie.KEY_BUFF_UTILITY_SELECTED_CURRENCY, 'USD');
        }

        selectedCurrency = cookieValue;

        addCurrencySelection();

        setInterval(() => {
            convertSelectors();

            if (/^.*buff.163.com\/market\/sell_order\/on_sale.*$/.test(window.location.href)) {
                addSellingAfterFeeGain();
            }

            if (/^.*buff.163.com\/market\/sell_order\/history.*$/.test(window.location.href)) {
                addBuyOrderGain();
            }

            if (/^.*buff.163.com\/market\/goods\?.*tab=buying.*$/.test(window.location.href)) {
                addBuyOrderGain();
            }
        }, 1000);
    }

    /**
     * Add the currency selection to the main navigation bar
     * @private
     */
    function addCurrencySelection(): void {
        let req = new XMLHttpRequest();

        req.onreadystatechange = () => {
            if (req.readyState == 4 && req.status == 200) {
                if (typeof req.response == 'object') {
                    cachedCurrencyRates = req.response;
                } else {
                    cachedCurrencyRates = JSON.parse(req.responseText);
                }

                let options: string = '';

                let keys = Object.keys(cachedCurrencyRates.rates);
                for (let l_Key of keys) {
                    options += `<option${(l_Key.indexOf(selectedCurrency) > -1 ? ' selected' : '')}>${l_Key}</option>`;
                }

                let nav: HTMLElement = <HTMLElement>document.querySelector('div.nav.nav_entries');

                let currencyDiv: HTMLElement = document.createElement('div');
                currencyDiv.setAttribute('style', 'position: relative; float: right;');

                currencySelection = document.createElement('select');

                currencySelection.innerHTML = options;

                currencySelection.onchange = () => {
                    selectedCurrency = currencySelection?.selectedOptions?.item(0)?.innerText ?? 'USD';

                    console.info(`[BuffUtility] Currency changed -> ${selectedCurrency}`, cachedCurrencyRates.rates[selectedCurrency]);

                    Cookie.write(Cookie.KEY_BUFF_UTILITY_SELECTED_CURRENCY, `${selectedCurrency}`);

                    updateConvertedCurrency();
                };

                currencyDiv.append(currencySelection);

                nav.prepend(currencyDiv);
            }
        };

        req.open('GET', 'https://felixvogel.github.io/currency-repository/rates.json');
        req.send();
    }

    /**
     * Convert the specified amount of yuan to the currently selected currency
     * @param yuan The amount of yuan
     * @private
     */
    function convertCurrency(yuan: number): string {
        let selectedRate: [number, number] = cachedCurrencyRates.rates[selectedCurrency];

        return `~${selectedCurrency} ${(yuan * selectedRate[0]).toFixed(selectedRate[1])}`;
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
    function readYuan(element: HTMLElement): number {
        let priceString: string = element.innerHTML.replace(/¥|<\/?small>|<\/?big>/g, '').trim();

        let price: number = 0.0;
        try {
            price = parseFloat(priceString);
        } catch {
            console.error(`[BuffUtility] Price parsing failed for: ${element.innerHTML}`);
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

            parent.innerHTML += `<strong style="color: #eea20e; font-size: 11px;">${createCurrencyHoverContainer(`(¥ ${price.toFixed(2)})`, price)}</strong>`;
        }
    }

    function addBuyOrderGain(): void {
        let elements: NodeListOf<Element> = document.querySelectorAll(`.list_tb_csgo > tr > td > div${NOT_CONVERTED_BUY_ORDER} > strong.f_Strong, .list_tb_csgo > tr > td${NOT_CONVERTED_BUY_ORDER} > strong.f_Strong`);

        for (let i = 0, l = elements.length; i < l; i ++) {
            let baseElement: HTMLElement = <HTMLElement>elements.item(i);
            let priceElement: HTMLElement = baseElement.querySelector('e');
            let parent: HTMLElement = baseElement.parentElement;

            let price: number = readYuan(priceElement) * 0.975;

            parent.setAttribute(ATTR_CONVERTED_BUY_ORDER, '');

            parent.innerHTML += `<div style="font-size: 12px; margin-top: 3px;" class="f_Strong">${createCurrencyHoverContainer(`(¥ ${price.toFixed(2)})`, price)}</div>`;
        }
    }

    /**
     * Adds the converted currency to each listing on the market
     * @private
     */
    function convertSelectors(): void {
        for (let l_Selector of selectors) {
            if (l_Selector.pattern.test(window.location.href)) {
                let elements: NodeListOf<Element> = document.querySelectorAll(l_Selector.queries.join(', '));

                if (elements.length > 0) {
                    if (!l_Selector.ignoreLog) {
                        console.info(`[BuffUtility] Converting ${elements.length} element(s).`, l_Selector, selectedCurrency, cachedCurrencyRates.rates[selectedCurrency]);
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

BuffUtility.init();
