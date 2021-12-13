/**
 * Author: Felix Vogel
 */
/** */
module Adjust_Settings {

    // helper functions

    const enum OptionID {
        CURRENCY_SELECT = 'buff-utility-currency-select',
        EXPAND_SCREENSHOTS = 'buff-utility-expand-screenshots',
        EXPAND_SCREENSHOT_BACKDROP = 'buff-utility-expand-screenshot-backdrop',
        DOMINATOR_SELECT = 'buff-utility-dominator-select'
    }

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

    function makeCheckboxOption(id: string, mappedOption: string, prefInfo: { title: string, description?: string }, table: HTMLElement): void {
        const containerTD = makeTD('', 't_Left');

        containerTD.innerHTML = Util.buildHTML('span', {
            content: [Util.buildHTML('div', {
                id: id,
                class: 'w-Checkbox',
                attributes: {
                    onclick: `window.postMessage('${GlobalConstants.BUFF_UTILITY_SETTINGS}', '*');`
                },
                content: [Util.buildHTML('span', {
                    class: ExtensionSettings.settings[mappedOption] ? 'on' : '',
                    content: [
                        Util.buildHTML('i', { class: 'icon icon_checkbox' }),
                        ' Open '
                    ]
                })]
            })]
        });

        const tr = makeTR();
        tr.append(
            makeTD(`BuffUtility<br>${prefInfo.title} ${prefInfo.description ? Util.buildHTML('i', {
                class: 'icon icon_qa j_tips_handler',
                attributes: {
                    'data-title': 'Description',
                    'data-content': prefInfo.description,
                    'data-direction': 'right'
                }
            }) : ''}`, 't_Left c_Gray'),
            containerTD,
            makeTD('', 't_Right')
        );

        table.append(tr);
    }

    export function isCheckboxSelected(id: string): boolean {
        return !!document.getElementById(id).querySelector('span.on');
    }

    function makeSelectOption(id: string, options: { value: string, displayStr: string, selected?: boolean }[], prefInfo: { title: string, description?: string }, table: HTMLElement): void {
        const containerTD = makeTD('', 't_Left');
        containerTD.innerHTML = Util.buildHTML('div', {
            content: [Util.buildHTML('select', {
                id: id,
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
                content: options.map(x => `<option value="${x.value}" style="width: 101px;" ${x.selected ? 'selected' : ''}>${x.displayStr}</option>`)
            })]
        });

        const tr = makeTR();
        tr.append(
            makeTD(`BuffUtility<br>${prefInfo.title} ${prefInfo.description ? Util.buildHTML('i', {
                class: 'icon icon_qa j_tips_handler',
                attributes: {
                    'data-title': 'Description',
                    'data-content': prefInfo.description,
                    'data-direction': 'right'
                }
            }) : ''}`, 't_Left c_Gray'),
            containerTD,
            makeTD('', 't_Right')
        );

        table.append(tr);
    }

    function readSelectOption(id: string, fallback?: string): string {
        return (<HTMLSelectElement>document.getElementById(id)).selectedOptions?.item(0)?.getAttribute('value') ?? fallback;
    }

    // add settings

    function init(): void {
        console.debug('[BuffUtility] Adjust_Settings');

        window.addEventListener('message', (e: MessageEvent) => {
            if (e.data == GlobalConstants.BUFF_UTILITY_SETTINGS) {
                let old = JSON.parse(JSON.stringify(ExtensionSettings.settings));

                let { settings } = ExtensionSettings;

                // check changes
                settings.selected_currency = readSelectOption(OptionID.CURRENCY_SELECT);

                settings.can_expand_screenshots = isCheckboxSelected(OptionID.EXPAND_SCREENSHOTS);
                settings.expand_screenshots_backdrop = isCheckboxSelected(OptionID.EXPAND_SCREENSHOT_BACKDROP);

                settings.difference_dominator = +readSelectOption(OptionID.DOMINATOR_SELECT);

                // save any changes
                ExtensionSettings.save();

                let changes: string[] = Object.keys(settings)
                    .filter(x => settings[x] != old[x])
                    .map(x => `${x}: ${old[x]} -> ${settings[x]}`);

                if (changes.length > 0) {
                    console.debug(`[BuffUtility] Saved settings.\n`, changes.join('\n'));
                }
            }
        });

        // Add new section

        let { settings } = ExtensionSettings;
        const userSettings = document.querySelector('div.user-setting');

        const h3 = document.createElement('h3');
        h3.innerHTML = 'BuffUtility Settings';

        const table = document.createElement('table');
        table.setAttribute('class', 'list_tb');
        table.setAttribute('width', '100%');

        // currency selection
        makeSelectOption(OptionID.CURRENCY_SELECT, Object.keys(CurrencyHelper.getData().rates).map(x => {
            return {
                value: x,
                displayStr: `${x} - ${CurrencySymbols.SYMBOL_LIST[x]}`,
                selected: x == settings.selected_currency
            };
        }), {
            title: 'Display Currency'
        }, table);

        // expand screenshot
        makeCheckboxOption(OptionID.EXPAND_SCREENSHOTS, 'can_expand_screenshots', {
            title: 'Can expand screenshots',
            description: 'Can screenshots be expanded on sell listings. This only works if \'Preview screenshots\' is turned on and if the item has been inspected.'
        }, table);

        // expand screenshot backdrop
        makeCheckboxOption(OptionID.EXPAND_SCREENSHOT_BACKDROP, 'expand_screenshots_backdrop', {
            title: 'Expanded screenshot backdrop',
            description: 'Adds a transparent black backdrop to screenshot images to add some contrast.'
        }, table);

        // dominator selection
        makeSelectOption(OptionID.DOMINATOR_SELECT, [
            {
                value: `${ExtensionSettings.DifferenceDominator.STEAM}`,
                displayStr: 'Steam',
                selected: settings.difference_dominator == ExtensionSettings.DifferenceDominator.STEAM
            }, {
                value: `${ExtensionSettings.DifferenceDominator.BUFF}`,
                displayStr: 'Buff',
                selected: settings.difference_dominator == ExtensionSettings.DifferenceDominator.BUFF
            }
        ], {
            title: 'Difference Dominator',
            description: 'Specify the dominator meaning:\nSteam: (scmp-bp)/scmp\nBuff: (scmp-bp)/bp\nUnless you know the difference might not want to change this setting.'
        }, table);

        // append stuff

        const blank20 = document.createElement('div');
        blank20.setAttribute('class', 'blank20');

        userSettings.append(h3, table, blank20);
    }

    init();

}

