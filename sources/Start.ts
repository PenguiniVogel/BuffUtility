/**
 * Start extension
 */
/** */
module Start {

    DEBUG && console.debug('[BuffUtility] Module.Start');

    // imports
    import Settings = ExtensionSettings.Settings;
    import getSetting = ExtensionSettings.getSetting;

    // module

    async function init(): Promise<void> {
        // make sure blur is off if disabled
        checkDataProtection();

        // float bar adjustment
        adjustFloatBar();

        // adjust account balance
        adjustAccountBalance();

        // add scheme css
        addSchemeCSS();

        if (DEBUG) {
            tests();
        }
    }

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
                let start_cached = Date.now();
                let r_cached = await InjectionService.requestObject('g');
                let ms_cached = Date.now() - start;

                console.group(`ObjectService Test`);
                console.debug('Start:', start);
                console.debug('Value:', r);
                console.debug('End.', `${ms}ms`);
                console.debug('Start - cached:', start_cached);
                console.debug('Value - cached:', r_cached);
                console.debug('End. - cached', `${ms_cached}ms`);
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

        // test exportBooleansToBytes and importBooleansFromBytes
        {
            // randomly generate 6 boolean states
            const test_data = [
                Math.random() > 0.5,
                Math.random() > 0.5,
                Math.random() > 0.5,
                Math.random() > 0.5,
                Math.random() > 0.5,
                Math.random() > 0.5
            ];

            let exported = Util.exportBooleansToBytes(test_data);

            console.debug(test_data, '->', exported);

            let imported = Util.importBooleansFromBytes(exported);

            console.debug(exported, '->', imported);

            let filtered = imported.filter((x, i) => x != test_data[i]);

            console.debug('If array is longer than 0, we failed:', filtered.length, filtered);
        }
    }

    async function checkDataProtection(): Promise<void> {
        // actually disable DATA_PROTECTION if it is disabled
        if (window.location.href.indexOf('/user-center/profile') > -1) {
            if (!await getSetting(Settings.DATA_PROTECTION)) {
                document.querySelectorAll('span#mobile:not([data-blur="false"]), a[href*="steamcommunity.com"]:not([data-blur="false"])').forEach(element => {
                    element.setAttribute('data-blur', 'false');
                });
            }
        }
    }

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
            let { convertedSymbol, convertedFormattedValue } = await Util.convertCNYRaw(balYuan);

            let balConverted = Util.buildHTML('span', {
                content: [
                    '<br>',
                    Util.buildHTML('span', {
                        class: 'c_Gray f_12px',
                        content: [ `(${convertedSymbol} ${convertedFormattedValue})` ]
                    })
                ]
            });

            balanceDiv.innerHTML += balConverted;
        }
    }

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
    `);

            let body = document.querySelector('body');
            body.setAttribute('class', `${body.getAttribute('class')} dark-theme`);
        }
    }

    init();

}
