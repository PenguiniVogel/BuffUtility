// Start the extension

import Settings = ExtensionSettings.Settings;

declare var g: BuffTypes.g;
declare var storedSettings: ExtensionSettings.SettingsProperties;

SchemaHelper.init();
ExtensionSettings.load();

// currency stuff
let currencyCache = Cookie.read(GlobalConstants.BUFF_UTILITY_CURRENCY_CACHE);
CurrencyHelper.initialize(currencyCache, !currencyCache);

storedSettings = ExtensionSettings.getAll();

function adjustFloatBar(): void {
    let divFloatBar = document.querySelector('body > div.floatbar');

    // if not present, skip
    if (!divFloatBar) return;

    divFloatBar.setAttribute('id', GlobalConstants.BUFF_UTILITY_ID_HIDE_CUSTOM_FLOAT_BAR);

    let h = function () {
        document.querySelector(`#${GlobalConstants.BUFF_UTILITY_ID_HIDE_CUSTOM_FLOAT_BAR}`).setAttribute('style', 'display: none;');
        document.querySelector(`#${GlobalConstants.BUFF_UTILITY_ID_EXPAND_CUSTOM_FLOAT_BAR}`).setAttribute('style', 'padding: 10px 4px; cursor: pointer; user-select: none; text-align: center; background: #2f3744; color: #959595; text-decoration: none;');
    };

    let s = function () {
        document.querySelector(`#${GlobalConstants.BUFF_UTILITY_ID_HIDE_CUSTOM_FLOAT_BAR}`).setAttribute('style', '');
        document.querySelector(`#${GlobalConstants.BUFF_UTILITY_ID_EXPAND_CUSTOM_FLOAT_BAR}`).setAttribute('style', 'display: none;');
    };

    let p = <HTMLElement>document.createElement('p');

    p.setAttribute('class', 'gotop');
    p.setAttribute('style', 'cursor: pointer; user-select: none; text-align: center; padding: 22px 0px; color: #959595; text-decoration: none;');
    p.setAttribute('onclick', `(${h.toString()})();`);

    p.innerText = '>';

    divFloatBar.appendChild(p);

    let divExpandFloatBar = document.createElement('div');

    divExpandFloatBar.setAttribute('id', GlobalConstants.BUFF_UTILITY_ID_EXPAND_CUSTOM_FLOAT_BAR);
    divExpandFloatBar.setAttribute('class', 'floatbar');
    divExpandFloatBar.setAttribute('onclick', `(${s.toString()})();`);

    divExpandFloatBar.innerText = '<';

    divFloatBar.parentElement.appendChild(divExpandFloatBar);

    if (storedSettings[Settings.SHOW_FLOAT_BAR]) {
        s();
    } else {
        h();
    }
}

// TODO this needs to be executed upon transactions to update the converted balance
function adjustAccountBalance(): void {
    let balanceDiv = document.querySelector('div.store-account > h4');
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
`);

    let body = document.querySelector('body');
    body.setAttribute('class', `${body.getAttribute('class')} dark-theme`);
}
