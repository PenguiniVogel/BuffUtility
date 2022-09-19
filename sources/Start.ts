// Start the extension

import Settings = ExtensionSettings.Settings;

declare var g: BuffTypes.g;

SchemaHelper.init();

// currency stuff
{
    let currencyCache = Cookie.read(GlobalConstants.BUFF_UTILITY_CURRENCY_CACHE);
    let parsedCurrencyCache = Util.tryParseJson<CurrencyHelper.Data>(currencyCache);
    let dateToday = Util.formatDate(new Date());

    function cacheCurrency(date: string): void {
        let currencyName: string = storedSettings[Settings.SELECTED_CURRENCY];
        let rates = CurrencyHelper.getData().rates[currencyName];

        let segment: CurrencyHelper.Data = {
            date: date,
            rates: {
                [currencyName]: rates
            },
            symbols: {}
        };

        console.debug(segment);

        if (storedSettings[Settings.EXPERIMENTAL_FETCH_NOTIFICATION]) {
            Util.signal(['Buff', 'toast'], null, [`Fetched current conversion rates: ${currencyName} -> ${rates[0].toFixed(rates[1])}`]);
        }

        Cookie.write(GlobalConstants.BUFF_UTILITY_CURRENCY_CACHE, JSON.stringify(segment));
    }

    if (parsedCurrencyCache) {
        console.debug(parsedCurrencyCache.date, dateToday);
        if (parsedCurrencyCache.date != dateToday) {
            CurrencyHelper.initialize(true, () => {
                cacheCurrency(dateToday);
            });
        } else {
            CurrencyHelper.initialize(false);
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
}

function adjustFloatBar(): void {
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

    if (storedSettings[Settings.SHOW_FLOAT_BAR]) {
        showFloatBar();
    } else {
        hideFloatBar();
    }
}

// TODO this needs to be executed upon transactions to update the converted balance
function adjustAccountBalance(): void {
    let balanceDiv = document.querySelector('div.store-account > h4');
    if (!balanceDiv) return;
    let balYuan: number = +(<HTMLElement>balanceDiv.querySelector('#navbar-cash-amount')).innerText.replace('¥ ', '');

    let balConverted = Util.buildHTML('span', {
        content: [
            '<br>',
            Util.buildHTML('span', {
                class: 'c_Gray f_12px',
                content: [ `(${Util.convertCNY(balYuan)})` ]
            })
        ]
    });

    balanceDiv.innerHTML += balConverted;
}

adjustFloatBar();
adjustAccountBalance();

if (storedSettings[Settings.USE_SCHEME]) {
    InjectionServiceLib.injectCSS(`
/* market */
.dark-theme #j_market_card,
.dark-theme #j_list_card li {
    background: ${storedSettings[Settings.COLOR_SCHEME][0]};
}

.dark-theme #j_list_card li {
    border-color: ${storedSettings[Settings.COLOR_SCHEME][2]};
}

.dark-theme #j_list_card li, 
.dark-theme #j_list_card li a, 
.dark-theme #j_list_card li p {
    color: ${storedSettings[Settings.COLOR_SCHEME][2]};
}

.dark-theme .pager li.disabled * {
    color: ${storedSettings[Settings.COLOR_SCHEME][3]} !important;
    border-color: ${storedSettings[Settings.COLOR_SCHEME][2]} !important;
    background: ${storedSettings[Settings.COLOR_SCHEME][0]} !important;
}

.dark-theme .pager .next, .dark-theme .pager .page-link {
    color: ${storedSettings[Settings.COLOR_SCHEME][2]} !important;
}

/* listings */
.dark-theme .detail-tab-cont,
.dark-theme div.desc_content {
    background: ${storedSettings[Settings.COLOR_SCHEME][0]};
}

.dark-theme div.stickers {
    background: transparent;
}

.dark-theme .des_row,
.dark-theme .pager li.disabled span,
.dark-theme .list_tb th {
    background: ${storedSettings[Settings.COLOR_SCHEME][0]} !important;
    border-color: ${storedSettings[Settings.COLOR_SCHEME][2]} !important;
}

.dark-theme .list_tb td {
    border-color: ${storedSettings[Settings.COLOR_SCHEME][2]} !important;
}

.dark-theme .detail-tab-cont tr:hover {
    background: ${storedSettings[Settings.COLOR_SCHEME][1]};
}

.dark-theme tr[id], 
.dark-theme span.c_Gray, 
.dark-theme .j_shoptip_handler, 
.dark-theme .wear-value, 
.dark-theme a.ctag,
.dark-theme .pager li .page-link,
.dark-theme .desc_content {
    color: ${storedSettings[Settings.COLOR_SCHEME][2]};
    border-color: ${storedSettings[Settings.COLOR_SCHEME][2]};
}

/* settings */
.dark-theme,
.dark-theme .user-setting,
.dark-theme .user-setting h3,
.dark-theme .user-setting label[for],
.dark-theme .user-setting select,
.dark-theme .user-setting input[type] {
    background: ${storedSettings[Settings.COLOR_SCHEME][0]};
    color: ${storedSettings[Settings.COLOR_SCHEME][2]};
}

/* inventory */
.dark-theme .detail-tab-cont .market-card {
    background: ${storedSettings[Settings.COLOR_SCHEME][0]};
}

/* favorites */
.dark-theme .l_Layout .cont_main .user-record {
    background: ${storedSettings[Settings.COLOR_SCHEME][0]};
}
.dark-theme .l_Layout .cont_main .user-record a,
.dark-theme .l_Layout .cont_main .user-record .delete-bookmark {
    color: ${storedSettings[Settings.COLOR_SCHEME][2]} !important;
}
`);

    let body = document.querySelector('body');
    body.setAttribute('class', `${body.getAttribute('class')} dark-theme`);
}
