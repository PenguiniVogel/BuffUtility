/**
 * Author: Felix Vogel
 */
/** */
module Adjust_Settings {

    function init(): void {
        console.debug('[BuffUtility] Adjust_Settings');

        window.addEventListener('message', (e) => {
            if (e.data == GlobalConstants.BUFF_UTILITY_SETTINGS) {
                let old = JSON.parse(JSON.stringify(ExtensionSettings.settings));

                // check changes
                ExtensionSettings.settings.selected_currency = (<HTMLSelectElement>document.getElementById('buff-utility-currency-select')).selectedOptions?.item(0)?.getAttribute('value') ?? 'USD';

                ExtensionSettings.settings.can_expand_screenshots = !!document.getElementById('buff-utility-expand-screenshots').querySelector('span.on');
                ExtensionSettings.settings.expand_screenshots_backdrop = !!document.getElementById('buff-utility-expand-screenshot-backdrop').querySelector('span.on');

                // save any changes
                ExtensionSettings.save();

                let changes: string[] = [];
                let settingsKeys = Object.keys(ExtensionSettings.settings);
                for (let l_Key of settingsKeys) {
                    if (ExtensionSettings.settings[l_Key] != old[l_Key]) {
                        changes.push(`${l_Key}: ${old[l_Key]} -> ${ExtensionSettings.settings[l_Key]}`);
                    }
                }

                if (changes.length > 0) {
                    console.debug(`[BuffUtility] Saved settings.\n`, changes.join('\n'));
                }
            }
        });

        // Add new section
        function makeTR(): HTMLElement {
            return document.createElement('tr');
        }

        function makeTD(text: string, cls: string, width: string = '120'): HTMLElement {
            let td = document.createElement('td');
            td.setAttribute('class', cls);
            td.setAttribute('width', width);

            td.innerHTML = text;

            return td;
        }

        const userSettings = document.querySelector('div.user-setting');

        const h3 = document.createElement('h3');
        h3.innerHTML = 'BuffUtility Settings';

        const table = document.createElement('table');
        table.setAttribute('class', 'list_tb');
        table.setAttribute('width', '100%');

        // currency selection
        {
            const keys = Object.keys(CurrencyHelper.getData().rates);

            const containerTD = makeTD('', 't_Left');
            containerTD.innerHTML = Util.buildHTML('div', {
                content: [Util.buildHTML('select', {
                    id: 'buff-utility-currency-select',
                    style: {
                        'font-size': '12px',
                        'width': '120px',
                        'height': '32px',
                        'max-height': '300px',
                        'overflow': 'auto'
                    },
                    attributes: {
                        'onchange': `window.postMessage('${GlobalConstants.BUFF_UTILITY_SETTINGS}', '*');`
                    },
                    content: keys.map(x => `<option value="${x}" style="width: 101px;" ${(x == ExtensionSettings.settings.selected_currency) ? 'selected' : ''}>${x} - ${CurrencySymbols.SYMBOL_LIST[x]}</option>`)
                })]
            });

            const tr = makeTR();
            tr.append(makeTD('BuffUtility<br>Display Currency', 't_Left c_Gray'), containerTD, makeTD('', 't_Right'));

            table.append(tr);
        }

        // expand screenshot
        {
            const containerTD = makeTD('', 't_Left');

            containerTD.innerHTML = Util.buildHTML('span', {
                content: [Util.buildHTML('div', {
                    id: 'buff-utility-expand-screenshots',
                    class: 'w-Checkbox',
                    attributes: {
                        onclick: `window.postMessage('${GlobalConstants.BUFF_UTILITY_SETTINGS}', '*');`
                    },
                    content: [Util.buildHTML('span', {
                        class: ExtensionSettings.settings.can_expand_screenshots ? 'on' : '',
                        content: [
                            Util.buildHTML('i', { class: 'icon icon_checkbox' }),
                            ' Can expand screenshots '
                        ]
                    })]
                })]
            });

            const tr = makeTR();
            tr.append(makeTD('BuffUtility<br>Can expand screenshots', 't_Left c_Gray'), containerTD, makeTD('', 't_Right'));

            table.append(tr);
        }

        // expand screenshot backdrop
        {
            const containerTD = makeTD('', 't_Left');

            containerTD.innerHTML = Util.buildHTML('span', {
                content: [Util.buildHTML('div', {
                    id: 'buff-utility-expand-screenshot-backdrop',
                    class: 'w-Checkbox',
                    attributes: {
                        onclick: `window.postMessage('${GlobalConstants.BUFF_UTILITY_SETTINGS}', '*');`
                    },
                    content: [Util.buildHTML('span', {
                        class: ExtensionSettings.settings.expand_screenshots_backdrop ? 'on' : '',
                        content: [
                            Util.buildHTML('i', { class: 'icon icon_checkbox' }),
                            ' Do expanded screenshots have a backdrop '
                        ]
                    })]
                })]
            });

            const tr = makeTR();
            tr.append(makeTD('BuffUtility<br>Expanded screenshot backdrop', 't_Left c_Gray'), containerTD, makeTD('', 't_Right'));

            table.append(tr);
        }

        // append stuff

        const blank20 = document.createElement('div');
        blank20.setAttribute('class', 'blank20');

        userSettings.append(h3, table, blank20);
    }

    init();

}

