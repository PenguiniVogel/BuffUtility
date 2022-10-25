// imports
import Settings = ExtensionSettings.Settings;

// Start the extension

declare var g: BuffTypes.g;

SchemaHelper.init();

// currency stuff
{
    let currencyCache = Cookie.read(GlobalConstants.BUFF_UTILITY_CURRENCY_CACHE);
    let parsedCurrencyCache = Util.tryParseJson<CurrencyHelper.Data>(currencyCache);
    let dateToday = Util.formatDate(new Date());

    function cacheCurrency(date: string): void {
        let currencyName: string = getSetting(Settings.SELECTED_CURRENCY);
        let rates = CurrencyHelper.getData().rates[currencyName];

        let segment: CurrencyHelper.Data = {
            date: date,
            rates: {
                [currencyName]: rates
            },
            symbols: {}
        };

        console.debug(segment);

        if (getSetting(Settings.EXPERIMENTAL_FETCH_NOTIFICATION)) {
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

    if (getSetting(Settings.SHOW_FLOAT_BAR)) {
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

if (getSetting(Settings.USE_SCHEME)) {
    InjectionServiceLib.injectCSS(`
/* market */
.dark-theme #j_market_card,
.dark-theme #j_list_card li {
    background: ${getSetting(Settings.COLOR_SCHEME)[0]};
}

.dark-theme #j_list_card li {
    border-color: ${getSetting(Settings.COLOR_SCHEME)[2]};
}

.dark-theme #j_list_card li, 
.dark-theme #j_list_card li a, 
.dark-theme #j_list_card li p {
    color: ${getSetting(Settings.COLOR_SCHEME)[2]};
}

.dark-theme .pager li.disabled * {
    color: ${getSetting(Settings.COLOR_SCHEME)[3]} !important;
    border-color: ${getSetting(Settings.COLOR_SCHEME)[2]} !important;
    background: ${getSetting(Settings.COLOR_SCHEME)[0]} !important;
}

.dark-theme .pager .next, .dark-theme .pager .page-link {
    color: ${getSetting(Settings.COLOR_SCHEME)[2]} !important;
}

/* listings */
.dark-theme .detail-tab-cont,
.dark-theme div.desc_content {
    background: ${getSetting(Settings.COLOR_SCHEME)[0]};
}

.dark-theme div.stickers {
    background: transparent;
}

.dark-theme .des_row,
.dark-theme .pager li.disabled span,
.dark-theme .list_tb th {
    background: ${getSetting(Settings.COLOR_SCHEME)[0]} !important;
    border-color: ${getSetting(Settings.COLOR_SCHEME)[2]} !important;
}

.dark-theme .list_tb td {
    border-color: ${getSetting(Settings.COLOR_SCHEME)[2]} !important;
}

.dark-theme .detail-tab-cont tr:hover {
    background: ${getSetting(Settings.COLOR_SCHEME)[1]};
}

.dark-theme tr[id], 
.dark-theme span.c_Gray, 
.dark-theme .j_shoptip_handler, 
.dark-theme .wear-value, 
.dark-theme a.ctag,
.dark-theme .pager li .page-link,
.dark-theme .desc_content {
    color: ${getSetting(Settings.COLOR_SCHEME)[2]};
    border-color: ${getSetting(Settings.COLOR_SCHEME)[2]};
}

/* shop pages */
.dark-theme .l_Layout .market-card, 
.dark-theme .shop .list_card,
.dark-theme .shop .shop-recommend-cont,
.dark-theme .shop .shop-recommend-cont .slider-handle,
.dark-theme .shop .shop-recommend-list li {
    background: ${getSetting(Settings.COLOR_SCHEME)[0]} !important;
}
.dark-theme .shop .shop-recommend-list h3 a {
    color: ${getSetting(Settings.COLOR_SCHEME)[2]};
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
    background: ${getSetting(Settings.COLOR_SCHEME)[0]} !important;
    color: ${getSetting(Settings.COLOR_SCHEME)[2]};
}

/* inventory */
.dark-theme .detail-tab-cont .market-card {
    background: ${getSetting(Settings.COLOR_SCHEME)[0]};
}

/* favorites */
.dark-theme .l_Layout .cont_main .user-record {
    background: ${getSetting(Settings.COLOR_SCHEME)[0]};
}
.dark-theme .l_Layout .cont_main .user-record a,
.dark-theme .l_Layout .cont_main .user-record .delete-bookmark {
    color: ${getSetting(Settings.COLOR_SCHEME)[2]} !important;
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
    background: ${getSetting(Settings.COLOR_SCHEME)[0]};
}
.dark-theme .popup_supply .input-cont .c_Gray {
    color: ${getSetting(Settings.COLOR_SCHEME)[2]} !important;
}

/* selling popup */
.dark-theme .popup_charge .popup-header,
.dark-theme .popup_charge .popup-cont {
    background: ${getSetting(Settings.COLOR_SCHEME)[0]};
}
.dark-theme .popup_charge .popup-cont .list_tb_csgo tr:hover {
    background: ${getSetting(Settings.COLOR_SCHEME)[1]};
}

/* selling description popup */
.dark-theme .popup_guide_sell .popup-header,
.dark-theme .popup_guide_sell .popup-cont {
    background: ${getSetting(Settings.COLOR_SCHEME)[0]};
}
.dark-theme .popup_guide_sell textarea {
    background: ${getSetting(Settings.COLOR_SCHEME)[0]};
    color: ${getSetting(Settings.COLOR_SCHEME)[2]} !important;
}

/* applied sticker popup */
.dark-theme .popup_flower .popup-header,
.dark-theme .popup_flower .popup-cont,
.dark-theme .popup_flower .popup-cont li {
    background: ${getSetting(Settings.COLOR_SCHEME)[0]} !important;
}
.dark-theme .popup_flower .popup-cont tr:hover {
    background: ${getSetting(Settings.COLOR_SCHEME)[1]} !important;
}

/* payment methods popup */
.dark-theme .popup .popup-header,
.dark-theme .popup .popup-tip,
.dark-theme .popup .popup-cont {
    background: ${getSetting(Settings.COLOR_SCHEME)[0]};
}
/* float range popup */
.dark-theme .popup_custom {
    background: ${getSetting(Settings.COLOR_SCHEME)[0]};
}
.dark-theme .popup_custom .popup_custom-title {
    color: ${getSetting(Settings.COLOR_SCHEME)[2]} !important;
}
/* confirmation popup */
.dark-theme .popup_common {
    background: ${getSetting(Settings.COLOR_SCHEME)[0]};
}
.dark-theme .popup_common .popup-cont h2 {
    color: ${getSetting(Settings.COLOR_SCHEME)[2]} !important;
}
`);

    let body = document.querySelector('body');
    body.setAttribute('class', `${body.getAttribute('class')} dark-theme`);
}
