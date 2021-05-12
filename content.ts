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

    /**
     * The currency symbol and conversion table
     * @private
     */
    const currencyTable: { [name: string]: [string, number] } = {
        'USD': ['$', 0.16],
        'EUR': ['€', 0.13]
    };

    /**
     * Stores the currently selected currency
     * @private
     */
    let selectedCurrency: number = 0;

    /**
     * Stores the select element
     */
    let currencySelection: HTMLSelectElement;

    export function init(): void {
        console.info('[BuffUtility] Initialized.');

        let cookieValue: number = 0;

        try {
            cookieValue = parseInt(Cookie.read(Cookie.KEY_BUFF_UTILITY_SELECTED_CURRENCY));
        } catch {
            console.info('[BuffUtility] Cookie was not found.');

            Cookie.write(Cookie.KEY_BUFF_UTILITY_SELECTED_CURRENCY, '0');
        }

        selectedCurrency = cookieValue;

        addCurrencySelection();

        setInterval(() => {
            if (window.location.href.indexOf('/sell_order/on_sale') > -1) {
                convertSellPrice();
            } else {
                convertMarketPrice();
            }
        }, 1000);
    }

    /**
     * Add the currency selection to the main navigation bar
     * @private
     */
    function addCurrencySelection(): void {
        let nav: HTMLElement = <HTMLElement>document.querySelector('div.nav.nav_entries');

        let currencyDiv: HTMLElement = document.createElement('div');
        currencyDiv.setAttribute('style', 'position: relative; float: right;');

        let options: string = '';

        let currencies: string[] = Object.keys(currencyTable);
        for (let i = 0, l = currencies.length; i < l; i ++) {
            options += `<option${(i == selectedCurrency ? ' selected' : '')}>${currencies[i]}</option>`;
        }

        currencySelection = document.createElement('select');

        currencySelection.innerHTML = options;

        currencySelection.onchange = () => {
            console.info(`[BuffUtility] Currency changed -> ${currencySelection.selectedOptions.item(0).innerText}`);

            Cookie.write(Cookie.KEY_BUFF_UTILITY_SELECTED_CURRENCY, `${currencySelection.selectedIndex}`);

            updateConvertedCurrency();
        };

        currencyDiv.append(currencySelection);

        nav.prepend(currencyDiv);
    }

    /**
     * Convert the specified amount of yuan to the currently selected currency
     * @param yuan The amount of yuan
     * @private
     */
    function convertCurrency(yuan: number): string {
        let selectedCur: string = currencySelection.selectedOptions?.item(0)?.innerText ?? 'USD';

        return `~${currencyTable[selectedCur][0]} ${(yuan * currencyTable[selectedCur][1]).toFixed(2)}`;
    }

    /**
     * Create a <e> hover element that stores the converted currency
     * @param text The display text
     * @param yuan The amount of yuan to convert
     * @private
     */
    function createCurrencyHoverContainer(text: string, yuan: number): string {
        return `<e title="${convertCurrency(yuan)}" data-du-target="converted-hover-currency">${text}</e>`;
    }

    /**
     * Reads the amount of yuan in the specified element
     * @param element The element to read from
     * @private
     */
    function readYuan(element: HTMLElement): number {
        let priceString: string = element.innerHTML.replace(/¥|<small>|<\/small>/g, '').trim();

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
    function convertSellPrice(): void {
        let elements: NodeListOf<Element> = document.querySelectorAll('p:not([converted]) strong.sell_order_price');

        for (let i = 0, l = elements.length; i < l; i ++) {
            let priceElement: HTMLElement = <HTMLElement>elements.item(i);
            let parent: HTMLElement = priceElement.parentElement;

            let price: number = readYuan(priceElement) * 0.975;

            parent.setAttribute('converted', '');
            parent.innerHTML += `<strong style="color: #eea20e; font-size: 11px;">${createCurrencyHoverContainer(`(¥ ${price.toFixed(2)})`, price)}</strong>`;
        }
    }

    /**
     * Adds the converted currency to each listing on the market
     * @private
     */
    function convertMarketPrice(): void {
        let elements: NodeListOf<Element> = document.querySelectorAll('li p:not([converted]) strong.f_Strong, td div:not([converted]) strong.f_Strong, .list_tb_csgo td:not([converted]) strong.f_Strong');

        for (let i = 0, l = elements.length; i < l; i ++) {
            let strong: HTMLElement = <HTMLElement>elements.item(i);
            let parent: HTMLElement = strong.parentElement;

            parent.setAttribute('converted', '');

            let price: number = readYuan(strong);

            strong.innerHTML = createCurrencyHoverContainer(strong.innerHTML, price);
        }
    }

    /**
     * Updates converted currencies when switching to a different currency
     * @private
     */
    function updateConvertedCurrency(): void {
        convertSellPrice();
        convertMarketPrice();

        let hovers: NodeListOf<Element> = document.querySelectorAll('e[data-du-target="converted-hover-currency"]');

        for (let i = 0, l = hovers.length; i < l; i ++) {
            let e: HTMLElement = <HTMLElement>hovers.item(i);

            e.setAttribute('title', convertCurrency(readYuan(e)));
        }
    }

}

BuffUtility.init();
