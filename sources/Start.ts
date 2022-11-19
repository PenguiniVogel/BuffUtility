// Start the extension

declare var g: BuffTypes.g;

if (DEBUG) {
    async function tests() {
        // BrowserInterface test
        {
            await (async () => {
                let start = Date.now();
                let r = await BrowserInterface.sendMessage({ method: 'test' });
                let ms = Date.now() - start;

                console.group(`BrowserInterface Test`);
                console.debug('Start:', start);
                console.debug('Value:', r);
                console.debug('End.', `${ms}ms`);
                console.groupEnd();
            })();
        }

        // object service test
        {
            await (async () => {
                let start = Date.now();
                let r = await InjectionService.requestObject('g');
                let ms = Date.now() - start;

                console.group(`ObjectService Test`);
                console.debug('Start:', start);
                console.debug('Value:', r);
                console.debug('End.', `${ms}ms`);
                console.groupEnd();
            })();
        }

        // storage test
        {
            await (async () => {
                console.group(`Storage Test`);

                await BrowserInterface.Storage.set({
                    test: 'a'
                });

                console.debug('Wrote test: a');

                let read = await BrowserInterface.Storage.get<string>('test');

                console.debug(`Read test: ${read}`);
                console.groupEnd();
            })();
        }
    }

    tests();
}

// BrowserInterface ping system
{
    BrowserInterface.setupPingSystem();
}

// currency stuff, scoped to avoid pollution
{
    async function getCurrencyCache(): Promise<void> {
        let currencyCache = await BrowserInterface.Storage.get<any>(GlobalConstants.BUFF_UTILITY_CURRENCY_CACHE);
        let parsedCurrencyCache = Util.tryParseJson<CurrencyHelper.Data>(currencyCache);
        let dateToday = Util.formatDate(new Date());

        async function cacheCurrency(date: string): Promise<void> {
            let currencyName: string = await getSetting(Settings.SELECTED_CURRENCY);
            let rates = CurrencyHelper.getData().rates[currencyName];

            let segment: CurrencyHelper.Data = {
                date: date,
                rates: {
                    [currencyName]: rates
                },
                symbols: {}
            };

            console.debug(segment);

            if (await getSetting(Settings.EXPERIMENTAL_FETCH_NOTIFICATION)) {
                Util.signal(['Buff', 'toast'], null, [`Fetched current conversion rates: ${currencyName} -> ${rates[0].toFixed(rates[1])}`]);
            }

            await BrowserInterface.Storage.set({ [GlobalConstants.BUFF_UTILITY_CURRENCY_CACHE]: segment });
        }

        if (parsedCurrencyCache) {
            console.debug(parsedCurrencyCache.date, dateToday);
            if (parsedCurrencyCache.date != dateToday) {
                CurrencyHelper.initialize(true, () => {
                    cacheCurrency(dateToday);
                });
            } else {
                let cachedRates = Object.keys(parsedCurrencyCache.rates);
                for (let key of cachedRates) {
                    console.debug(`[BuffUtility] Reading cached current rates for ${key}: [${CurrencyHelper.getData().date}] ${CurrencyHelper.getData().rates[key]} -> [${parsedCurrencyCache.date}] ${parsedCurrencyCache.rates[key]}`);
                    CurrencyHelper.getData().rates[key] = parsedCurrencyCache.rates[key];
                }
            }
        } else {
            CurrencyHelper.initialize(true, () => {
                cacheCurrency(dateToday);
            });
        }

        // delete cookie
        Cookie.write(GlobalConstants.BUFF_UTILITY_CURRENCY_CACHE, '0', 0);
    }

    // pre parse to avoid async timing errors
    CurrencyHelper.initialize(false);

    getCurrencyCache();
}

// actually disable DATA_PROTECTION if it is disabled
(async () => {
    if (window.location.href.indexOf('/user-center/profile') > -1) {
        if (!await getSetting(Settings.DATA_PROTECTION)) {
            document.querySelectorAll('span#mobile:not([data-blur="false"]), a[href*="steamcommunity.com"]:not([data-blur="false"])').forEach(element => {
                element.setAttribute('data-blur', 'false');
            });
        }
    }
})();

async function adjustFloatBar(): Promise<void> {
    let divFloatBar = document.querySelector('body > div.floatbar');

    // if not present, skip
    if (!divFloatBar) return;

    divFloatBar.setAttribute('id', GlobalConstants.BUFF_UTILITY_ID_HIDE_CUSTOM_FLOAT_BAR);

    let hideFloatBar = function () {
        document.querySelector(`#${GlobalConstants.BUFF_UTILITY_ID_HIDE_CUSTOM_FLOAT_BAR}`).setAttribute('style', 'display: none;');
        document.querySelector(`#${GlobalConstants.BUFF_UTILITY_ID_EXPAND_CUSTOM_FLOAT_BAR}`).setAttribute('style', 'padding: 10px 4px; cursor: pointer; user-select: none; text-align: center; background: #2f3744; color: #959595; text-decoration: none;');
    };

    let showFloatBar = function () {
        document.querySelector(`#${GlobalConstants.BUFF_UTILITY_ID_HIDE_CUSTOM_FLOAT_BAR}`).setAttribute('style', '');
        document.querySelector(`#${GlobalConstants.BUFF_UTILITY_ID_EXPAND_CUSTOM_FLOAT_BAR}`).setAttribute('style', 'display: none;');
    };

    let p = <HTMLElement>document.createElement('p');

    p.setAttribute('class', 'gotop');
    p.setAttribute('style', 'cursor: pointer; user-select: none; text-align: center; padding: 22px 0px; color: #959595; text-decoration: none;');
    p.setAttribute('onclick', `(${hideFloatBar.toString()})();`);

    p.innerText = '>';

    divFloatBar.appendChild(p);

    let divExpandFloatBar = document.createElement('div');

    divExpandFloatBar.setAttribute('id', GlobalConstants.BUFF_UTILITY_ID_EXPAND_CUSTOM_FLOAT_BAR);
    divExpandFloatBar.setAttribute('class', 'floatbar');
    divExpandFloatBar.setAttribute('onclick', `(${showFloatBar.toString()})();`);

    divExpandFloatBar.innerText = '<';

    divFloatBar.parentElement.appendChild(divExpandFloatBar);

    if (await getSetting(Settings.SHOW_FLOAT_BAR)) {
        showFloatBar();
    } else {
        hideFloatBar();
    }
}

async function adjustAccountBalance(): Promise<void> {
    let balanceDiv = document.querySelector('div.store-account > h4');
    if (!balanceDiv) return;
    let balYuan: number = +(<HTMLElement>balanceDiv.querySelector('#navbar-cash-amount')).innerText.replace('¥ ', '');

    if (isFinite(balYuan)) {
        let { convertedSymbol, convertedValue } = await Util.convertCNYRaw(balYuan);
        let formatted = Util.formatNumber(convertedValue, false, ExtensionSettings.CurrencyNumberFormats.FORMATTED);

        let balConverted = Util.buildHTML('span', {
            content: [
                '<br>',
                Util.buildHTML('span', {
                    class: 'c_Gray f_12px',
                    content: [ `(${convertedSymbol} ${Util.embedDecimalSmall(formatted.strNumber)})` ]
                })
            ]
        });

        balanceDiv.innerHTML += balConverted;
    }
}

adjustFloatBar();
adjustAccountBalance();

// scheme css

async function addSchemeCSS(): Promise<void> {
    if (await getSetting(Settings.USE_SCHEME)) {
        let colors = await getSetting(Settings.COLOR_SCHEME);
        InjectionServiceLib.injectCSS(`
    /* variables */
    .dark-theme {
        /* #121212 */
        --bu-color-0: ${colors[0]};
        /* #1f1f1f */
        --bu-color-1: ${colors[1]};
        /* #bfbfbf */
        ---bu-color-2: ${colors[2]};
        /* #696969 */
        --bu-color-3: ${colors[3]};
    }
    
    /* market */
    .dark-theme #j_market_card,
    .dark-theme #j_list_card li {
        background: var(--bu-color-0, #121212);
    }
    
    .dark-theme #j_list_card li {
        border-color: var(--bu-color-2, #bfbfbf);
    }
    
    .dark-theme #j_list_card li, 
    .dark-theme #j_list_card li a, 
    .dark-theme #j_list_card li p {
        color: var(--bu-color-2, #bfbfbf);
    }
    
    .dark-theme .pager li.disabled * {
        color: var(--bu-color-3, #696969) !important;
        border-color: var(--bu-color-2, #bfbfbf) !important;
        background: var(--bu-color-0, #121212) !important;
    }
    
    .dark-theme .pager .next, .dark-theme .pager .page-link {
        color: var(--bu-color-2, #bfbfbf) !important;
    }
    
    /* listings */
    .dark-theme .detail-tab-cont,
    .dark-theme div.desc_content {
        background: var(--bu-color-0, #121212);
    }
    
    .dark-theme div.stickers {
        background: transparent;
    }
    
    .dark-theme .des_row,
    .dark-theme .pager li.disabled span,
    .dark-theme .list_tb th {
        background: var(--bu-color-0, #121212) !important;
        border-color: var(--bu-color-2, #bfbfbf) !important;
    }
    
    .dark-theme .list_tb td {
        border-color: var(--bu-color-2, #bfbfbf) !important;
    }
    
    .dark-theme .detail-tab-cont tr:hover {
        background: var(--bu-color-1, #1f1f1f);
    }
    
    .dark-theme tr[id], 
    .dark-theme span.c_Gray, 
    .dark-theme .j_shoptip_handler, 
    .dark-theme .wear-value, 
    .dark-theme a.ctag,
    .dark-theme .pager li .page-link,
    .dark-theme .desc_content {
        color: var(--bu-color-2, #bfbfbf);
        border-color: var(--bu-color-2, #bfbfbf);
    }
    
    /* shop pages */
    .dark-theme .l_Layout .market-card, 
    .dark-theme .shop .list_card,
    .dark-theme .shop .shop-recommend-cont,
    .dark-theme .shop .shop-recommend-cont .slider-handle,
    .dark-theme .shop .shop-recommend-list li {
        background: var(--bu-color-0, #121212) !important;
    }
    .dark-theme .shop .shop-recommend-list h3 a {
        color: var(--bu-color-2, #bfbfbf);
    }
    
    /* settings */
    .dark-theme,
    .dark-theme .user-setting,
    .dark-theme .user-setting h3,
    .dark-theme .user-setting label[for],
    .dark-theme .user-setting select,
    .dark-theme .user-setting input[type],
    .dark-theme .user-wallet,
    .dark-theme .user-wallet .user-pay-desc,
    .dark-theme .user-rights,
    .dark-theme .user-feedback {
        background: var(--bu-color-0, #121212) !important;
        color: var(--bu-color-2, #bfbfbf);
    }
    
    /* inventory */
    .dark-theme .detail-tab-cont .market-card {
        background: var(--bu-color-0, #121212);
    }
    
    /* favorites */
    .dark-theme .l_Layout .cont_main .user-record {
        background: var(--bu-color-0, #121212);
    }
    .dark-theme .l_Layout .cont_main .user-record a,
    .dark-theme .l_Layout .cont_main .user-record .delete-bookmark {
        color: var(--bu-color-2, #bfbfbf) !important;
    }
    .dark-theme .l_Layout .cont_main .user-record .i_Btn_hollow {
        background-color: #959595;
        color: #fff;
    }
    
    /* bargain popup */
    .dark-theme .popup_supply .popup-header,
    .dark-theme .popup_supply .popup-cont,
    .dark-theme .popup_supply .popup-cont .popup-good-summary,
    .dark-theme .popup_supply .popup-cont .popup-good-summary .input-cont .j_filter {
        background: var(--bu-color-0, #121212);
    }
    .dark-theme .popup_supply .input-cont .c_Gray {
        color: var(--bu-color-2, #bfbfbf) !important;
    }
    
    /* selling popup */
    .dark-theme .popup_charge .popup-header,
    .dark-theme .popup_charge .popup-cont {
        background: var(--bu-color-0, #121212);
    }
    .dark-theme .popup_charge .popup-cont .list_tb_csgo tr:hover {
        background: var(--bu-color-1, #1f1f1f);
    }
    
    /* selling description popup */
    .dark-theme .popup_guide_sell .popup-header,
    .dark-theme .popup_guide_sell .popup-cont {
        background: var(--bu-color-0, #121212);
    }
    .dark-theme .popup_guide_sell textarea {
        background: var(--bu-color-0, #121212);
        color: var(--bu-color-2, #bfbfbf) !important;
    }
    
    /* applied sticker popup */
    .dark-theme .popup_flower .popup-header,
    .dark-theme .popup_flower .popup-cont,
    .dark-theme .popup_flower .popup-cont li {
        background: var(--bu-color-0, #121212) !important;
    }
    .dark-theme .popup_flower .popup-cont tr:hover {
        background: var(--bu-color-1, #1f1f1f) !important;
    }
    
    /* payment methods popup */
    .dark-theme .popup .popup-header,
    .dark-theme .popup .popup-tip,
    .dark-theme .popup .popup-cont {
        background: var(--bu-color-0, #121212);
    }
    /* float range popup */
    .dark-theme .popup_custom {
        background: var(--bu-color-0, #121212);
    }
    .dark-theme .popup_custom .popup_custom-title {
        color: var(--bu-color-2, #bfbfbf) !important;
    }
    /* confirmation popup */
    .dark-theme .popup_common {
        background: var(--bu-color-0, #121212);
    }
    .dark-theme .popup_common .popup-cont h2 {
        color: var(--bu-color-2, #bfbfbf) !important;
    }
    `);

        let body = document.querySelector('body');
        body.setAttribute('class', `${body.getAttribute('class')} dark-theme`);
    }
}

addSchemeCSS();
