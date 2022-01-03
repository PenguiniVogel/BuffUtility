/**
 * Author: Felix Vogel
 */
/** */
module Adjust_Settings {

    // imports
    import Settings = ExtensionSettings.Settings;

    // module

    const enum OptionID {
        CURRENCY_SELECT = 'buff-utility-currency-select',
        CUSTOM_CURRENCY_RATE = 'buff-utility-custom-currency-rate',
        CUSTOM_CURRENCY_NAME = 'buff-utility-custom-currency-name',
        EXPAND_SCREENSHOTS = 'buff-utility-expand-screenshots',
        EXPAND_SCREENSHOT_BACKDROP = 'buff-utility-expand-screenshot-backdrop',
        DOMINATOR_SELECT = 'buff-utility-dominator-select',
        APPLY_STEAM_TAX = 'buff-utility-apply-steam-tax',
        APPLY_CURRENCY_TO_DIFFERENCE = 'buff-utility-apply-currency-to-difference',
        EXPAND_TYPE = 'buff-utility-expand-type',
        CUSTOM_FOP = 'buff-utility-custom-fop',
        SORT_BY = 'buff-utility-sort-by'
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

    function makeCheckboxOption(id: string, mappedOption: ExtensionSettings.Settings, prefInfo: { title: string, description?: string }, table: HTMLElement): void {
        const containerTD = makeTD('', 't_Left');

        containerTD.innerHTML = Util.buildHTML('span', {
            content: [Util.buildHTML('div', {
                id: id,
                class: 'w-Checkbox',
                attributes: {
                    onclick: `window.postMessage('${GlobalConstants.BUFF_UTILITY_SETTINGS}', '*');`
                },
                content: [Util.buildHTML('span', {
                    class: ExtensionSettings.get[mappedOption] ? 'on' : '',
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
        return !!document.getElementById(id)?.querySelector('span.on');
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

    function readSelectOption(id: string): string {
        return (<HTMLSelectElement>document.getElementById(id)).selectedOptions?.item(0)?.getAttribute('value');
    }

    function makeTextOption(id: string, type: string, mappedOption: ExtensionSettings.Settings, prefInfo: { title: string, description?: string }, table: HTMLElement): void {
        const containerTD = makeTD('', 't_Left');

        containerTD.innerHTML = Util.buildHTML('span', {
            content: [Util.buildHTML('div', {
                content: [Util.buildHTML('input', {
                    id: id,
                    attributes: {
                        'type': type,
                        'value': `${ExtensionSettings.get[mappedOption]}`,
                        'onkeyup': `window.postMessage('${GlobalConstants.BUFF_UTILITY_SETTINGS}', '*');`
                    }
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

    export function readTextOption(id: string): string {
        return (<HTMLInputElement>document.getElementById(id))?.value;
    }

    // add settings

    function init(): void {
        console.debug('[BuffUtility] Adjust_Settings');

        window.addEventListener('message', (e: MessageEvent) => {
            if (e.data == GlobalConstants.BUFF_UTILITY_SETTINGS) {
                // check changes
                ExtensionSettings.save(Settings.SELECTED_CURRENCY, readSelectOption(OptionID.CURRENCY_SELECT));
                ExtensionSettings.save(Settings.APPLY_CURRENCY_TO_DIFFERENCE, isCheckboxSelected(OptionID.APPLY_CURRENCY_TO_DIFFERENCE));
                ExtensionSettings.save(Settings.CAN_EXPAND_SCREENSHOTS, isCheckboxSelected(OptionID.EXPAND_SCREENSHOTS));
                ExtensionSettings.save(Settings.EXPAND_SCREENSHOTS_BACKDROP, isCheckboxSelected(OptionID.EXPAND_SCREENSHOT_BACKDROP));
                ExtensionSettings.save(Settings.APPLY_STEAM_TAX, isCheckboxSelected(OptionID.APPLY_STEAM_TAX));
                ExtensionSettings.save(Settings.DIFFERENCE_DOMINATOR, readSelectOption(OptionID.DOMINATOR_SELECT));
                ExtensionSettings.save(Settings.DEFAULT_SORT_BY, readSelectOption(OptionID.SORT_BY));
                ExtensionSettings.save(Settings.EXPAND_TYPE, readSelectOption(OptionID.EXPAND_TYPE));
                ExtensionSettings.save(Settings.CUSTOM_FOP, readSelectOption(OptionID.CUSTOM_FOP));

                ExtensionSettings.save(Settings.CUSTOM_CURRENCY_RATE, readTextOption(OptionID.CUSTOM_CURRENCY_RATE));
                ExtensionSettings.save(Settings.CUSTOM_CURRENCY_NAME, readTextOption(OptionID.CUSTOM_CURRENCY_NAME));
                ExtensionSettings.save(Settings.CUSTOM_CURRENCY_CALCULATED_RATE, 1 / <number>ExtensionSettings.get(Settings.CUSTOM_CURRENCY_RATE));
                ExtensionSettings.save(Settings.CUSTOM_CURRENCY_LEADING_ZEROS, Util.countLeadingZeros(`${ExtensionSettings.get(Settings.CUSTOM_CURRENCY_CALCULATED_RATE)}`.split('.')[1] ?? ''));
            }
        });

        // Get stuff
        const userSettings = document.querySelector('div.user-setting');

        // Add normal settings
        const h3 = document.createElement('h3');
        h3.innerHTML = 'BuffUtility Settings';

        const table = document.createElement('table');
        table.setAttribute('class', 'list_tb');
        table.setAttribute('width', '100%');

        // currency selection
        const { rates, symbols } = CurrencyHelper.getData();

        let remapped = Object.keys(rates).map(x => {
            return {
                value: x,
                displayStr: `${x} - ${symbols[x].length == 0 ? '?' : symbols[x]}`,
                selected: x == ExtensionSettings.get(Settings.SELECTED_CURRENCY)
            };
        });

        remapped.push({
            value: GlobalConstants.BUFF_UTILITY_CUSTOM_CURRENCY,
            displayStr: 'Custom',
            selected: GlobalConstants.BUFF_UTILITY_CUSTOM_CURRENCY == ExtensionSettings.get(Settings.SELECTED_CURRENCY)
        });

        makeSelectOption(OptionID.CURRENCY_SELECT, remapped, {
            title: 'Display Currency'
        }, table);

        // apply currency to difference
        makeCheckboxOption(OptionID.APPLY_CURRENCY_TO_DIFFERENCE, Settings.APPLY_CURRENCY_TO_DIFFERENCE, {
            title: 'Apply Currency to difference',
            description: 'Whether to show the difference on the listing page in your selected currency or RMB.'
        }, table);

        // expand screenshot
        makeCheckboxOption(OptionID.EXPAND_SCREENSHOTS, Settings.CAN_EXPAND_SCREENSHOTS, {
            title: 'Can expand preview',
            description: 'Can previews be expanded on sell listings. This only works if \'Preview screenshots\' is turned on and if the item has been inspected.'
        }, table);

        // expand screenshot backdrop
        makeCheckboxOption(OptionID.EXPAND_SCREENSHOT_BACKDROP, Settings.EXPAND_SCREENSHOTS_BACKDROP, {
            title: 'Expanded preview backdrop',
            description: 'Adds a transparent black backdrop to preview images to add some contrast.'
        }, table);

        // apply steam tax
        makeCheckboxOption(OptionID.APPLY_STEAM_TAX, Settings.APPLY_STEAM_TAX, {
            title: 'Apply Steam Tax',
            description: 'Apply Steam Tax before calculating differences.\nThis will calculate the steam seller price from the provided reference price.'
        }, table);

        // append normal settings
        const blank20 = document.createElement('div');
        blank20.setAttribute('class', 'blank20');

        userSettings.append(h3, table, blank20);

        // Add advanced settings
        const adv_h3 = document.createElement('h3');
        adv_h3.innerHTML = 'BuffUtility Advanced Settings';

        const adv_table = document.createElement('table');
        adv_table.setAttribute('class', 'list_tb');
        adv_table.setAttribute('width', '100%');

        // dominator selection
        makeSelectOption(OptionID.DOMINATOR_SELECT, [
            {
                value: `${ExtensionSettings.DifferenceDominator.STEAM}`,
                displayStr: 'Steam',
                selected: ExtensionSettings.get(Settings.DIFFERENCE_DOMINATOR) == ExtensionSettings.DifferenceDominator.STEAM
            }, {
                value: `${ExtensionSettings.DifferenceDominator.BUFF}`,
                displayStr: 'Buff',
                selected: ExtensionSettings.get(Settings.DIFFERENCE_DOMINATOR) == ExtensionSettings.DifferenceDominator.BUFF
            }
        ], {
            title: 'Difference Dominator',
            description: 'Specify the dominator meaning:\nSteam: (scmp-bp)/scmp\nBuff: (scmp-bp)/bp\nUnless you know the difference might not want to change this setting.'
        }, adv_table);

        // default sort by
        makeSelectOption(OptionID.SORT_BY, Object.keys(ExtensionSettings.SORT_BY).map(x => {
            return {
                value: ExtensionSettings.SORT_BY[x],
                displayStr: x,
                selected: ExtensionSettings.SORT_BY[x] == ExtensionSettings.get(Settings.DEFAULT_SORT_BY)
            };
        }), {
            title: 'Default sort by',
            description: 'Default sort by for item listings\nDefault: Default\nNewest: Newest\nPrice Ascending: low to high\nPrice Descending: high to low\nFloat Ascending: low to high\nFloat Descending: high to low\nHot Descending: by heat..?'
        }, adv_table);

        // choose what to expand, preview or screenshot
        makeSelectOption(OptionID.EXPAND_TYPE, [
            {
                value: `${ExtensionSettings.ExpandScreenshotType.PREVIEW}`,
                displayStr: 'Preview',
                selected: ExtensionSettings.get(Settings.EXPAND_TYPE) == ExtensionSettings.ExpandScreenshotType.PREVIEW
            },
            {
                value: `${ExtensionSettings.ExpandScreenshotType.INSPECT}`,
                displayStr: 'Inspect',
                selected: ExtensionSettings.get(Settings.EXPAND_TYPE) == ExtensionSettings.ExpandScreenshotType.INSPECT
            }
        ], {
            title: 'Expand preview type',
            description: 'Either expand into a zoomed preview image or expand into the inspect image.'
        }, adv_table);

        // custom fop field
        makeSelectOption(OptionID.CUSTOM_FOP, [
            [ExtensionSettings.FOP_VALUES.Auto, 'Auto'],
            [ExtensionSettings.FOP_VALUES.w245xh230, 'w245xh230'],
            [ExtensionSettings.FOP_VALUES.w490xh460, 'w490xh460'],
            [ExtensionSettings.FOP_VALUES.w980xh920, 'w980xh920'],
            [ExtensionSettings.FOP_VALUES.w1960xh1840, 'w1960xh1840'],
            [ExtensionSettings.FOP_VALUES.w3920xh3680, 'w3920xh3680']
        ].map(x => {
            return {
                value: `${x[0]}`,
                displayStr: `${x[1]}`,
                selected: x[0] == ExtensionSettings.get(Settings.CUSTOM_FOP)
            };
        }), {
            title: 'Custom FOP',
            description: 'Set the factor (or field) of preview, you should *not* change this from \'Auto\'.'
        }, adv_table);

        // custom currency fields
        makeTextOption(OptionID.CUSTOM_CURRENCY_RATE, 'number', Settings.CUSTOM_CURRENCY_RATE, {
            title: 'Custom currency rate',
            description: 'Set the rate of the custom currency e.g.\n10 RMB -> 1 CC\nOnly active if \'Custom\' was selected in the \'Display Currency\' option.'
        }, adv_table);

        makeTextOption(OptionID.CUSTOM_CURRENCY_NAME, 'text', Settings.CUSTOM_CURRENCY_NAME, {
            title: 'Custom currency name',
            description: 'Set the name of the custom currency. Only active if \'Custom\' was selected in the \'Display Currency\' option.'
        }, adv_table);

        // append advanced settings
        const adv_blank20 = document.createElement('div');
        adv_blank20.setAttribute('class', 'blank20');

        userSettings.append(adv_h3, adv_table, adv_blank20);
    }

    init();

}

