// Start the extension

import Settings = ExtensionSettings.Settings;

declare var g: BuffTypes.g;
declare var storedSettings: ExtensionSettings.SettingsProperties;

SchemaHelper.init();
ExtensionSettings.load();
CurrencyHelper.initialize();

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

adjustFloatBar();
