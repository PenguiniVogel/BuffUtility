/**
 * Author: Felix Vogel
 */
/** */
module Adjust_Settings {

    // imports
    import Settings = ExtensionSettings.Settings;

    // module

    function getOptionID(option: Settings): string {
        return `buff-utility-${option}`;
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

    function makeCheckboxOption(mappedOption: ExtensionSettings.Settings, prefInfo: { title: string, description?: string }, table: HTMLElement): void {
        const containerTD = makeTD('', 't_Left');

        containerTD.innerHTML = Util.buildHTML('span', {
            content: [Util.buildHTML('div', {
                id: getOptionID(mappedOption),
                class: 'w-Checkbox',
                attributes: {
                    onclick: `window.postMessage('${GlobalConstants.BUFF_UTILITY_SETTINGS}', '*');`
                },
                content: [Util.buildHTML('span', {
                    class: storedSettings[mappedOption] ? 'on' : '',
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

    export function isCheckboxSelected(option: Settings): boolean {
        return !!document.getElementById(getOptionID(option))?.querySelector('span.on');
    }

    function makeSelectOption(mappedOption: Settings, options: { value: string, displayStr: string, selected?: boolean }[], prefInfo: { title: string, description?: string }, table: HTMLElement): void {
        const containerTD = makeTD('', 't_Left');
        containerTD.innerHTML = Util.buildHTML('div', {
            content: [Util.buildHTML('select', {
                id: getOptionID(mappedOption),
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

    function readSelectOption(option: Settings): string {
        return (<HTMLSelectElement>document.getElementById(getOptionID(option))).selectedOptions?.item(0)?.getAttribute('value');
    }

    function makeTextOption(mappedOption: ExtensionSettings.Settings, type: string, prefInfo: { title: string, description?: string }, table: HTMLElement): void {
        const containerTD = makeTD('', 't_Left');

        containerTD.innerHTML = Util.buildHTML('span', {
            content: [Util.buildHTML('div', {
                content: [Util.buildHTML('input', {
                    id: getOptionID(mappedOption),
                    attributes: {
                        'type': type,
                        'value': `${storedSettings[mappedOption]}`,
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

    export function readTextOption(option: Settings): string {
        return (<HTMLInputElement>document.getElementById(getOptionID(option)))?.value;
    }

    // add settings

    function init(): void {
        console.debug('[BuffUtility] Adjust_Settings');

        window.addEventListener('message', (e: MessageEvent) => {
            if (e.data == GlobalConstants.BUFF_UTILITY_SETTINGS) {
                // check changes
                ExtensionSettings.save(Settings.SELECTED_CURRENCY, readSelectOption(Settings.SELECTED_CURRENCY));
                ExtensionSettings.save(Settings.APPLY_CURRENCY_TO_DIFFERENCE, isCheckboxSelected(Settings.APPLY_CURRENCY_TO_DIFFERENCE));
                ExtensionSettings.save(Settings.CAN_EXPAND_SCREENSHOTS, isCheckboxSelected(Settings.CAN_EXPAND_SCREENSHOTS));
                ExtensionSettings.save(Settings.EXPAND_SCREENSHOTS_BACKDROP, isCheckboxSelected(Settings.EXPAND_SCREENSHOTS_BACKDROP));
                ExtensionSettings.save(Settings.APPLY_STEAM_TAX, isCheckboxSelected(Settings.APPLY_STEAM_TAX));
                ExtensionSettings.save(Settings.SHOW_TOAST_ON_ACTION, isCheckboxSelected(Settings.SHOW_TOAST_ON_ACTION));
                ExtensionSettings.save(Settings.DIFFERENCE_DOMINATOR, readSelectOption(Settings.DIFFERENCE_DOMINATOR));
                ExtensionSettings.save(Settings.DEFAULT_SORT_BY, readSelectOption(Settings.DEFAULT_SORT_BY));
                ExtensionSettings.save(Settings.DEFAULT_STICKER_SEARCH, readSelectOption(Settings.DEFAULT_STICKER_SEARCH));
                ExtensionSettings.save(Settings.EXPAND_TYPE, readSelectOption(Settings.EXPAND_TYPE));
                ExtensionSettings.save(Settings.CUSTOM_FOP, readSelectOption(Settings.CUSTOM_FOP));

                ExtensionSettings.save(Settings.CUSTOM_CURRENCY_RATE, readTextOption(Settings.CUSTOM_CURRENCY_RATE));
                ExtensionSettings.save(Settings.CUSTOM_CURRENCY_NAME, readTextOption(Settings.CUSTOM_CURRENCY_NAME));
                ExtensionSettings.save(Settings.CUSTOM_CURRENCY_CALCULATED_RATE, 1 / storedSettings[Settings.CUSTOM_CURRENCY_RATE]);
                ExtensionSettings.save(Settings.CUSTOM_CURRENCY_LEADING_ZEROS, Util.countLeadingZeros(`${storedSettings[Settings.CUSTOM_CURRENCY_CALCULATED_RATE]}`.split('.')[1] ?? ''));

                ExtensionSettings.save(Settings.LEECH_CONTRIBUTOR_KEY, readTextOption(Settings.LEECH_CONTRIBUTOR_KEY));
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
                selected: x == storedSettings[Settings.SELECTED_CURRENCY]
            };
        });

        remapped.push({
            value: GlobalConstants.BUFF_UTILITY_CUSTOM_CURRENCY,
            displayStr: 'Custom',
            selected: GlobalConstants.BUFF_UTILITY_CUSTOM_CURRENCY == storedSettings[Settings.SELECTED_CURRENCY]
        });

        makeSelectOption(Settings.SELECTED_CURRENCY, remapped, {
            title: 'Display Currency'
        }, table);

        // apply currency to difference
        makeCheckboxOption(Settings.APPLY_CURRENCY_TO_DIFFERENCE, {
            title: 'Apply Currency to difference',
            description: 'Whether to show the difference on the listing page in your selected currency or RMB.'
        }, table);

        // expand screenshot
        makeCheckboxOption(Settings.CAN_EXPAND_SCREENSHOTS, {
            title: 'Can expand preview',
            description: 'Can previews be expanded on sell listings. This only works if \'Preview screenshots\' is turned on and if the item has been inspected.'
        }, table);

        // expand screenshot backdrop
        makeCheckboxOption(Settings.EXPAND_SCREENSHOTS_BACKDROP, {
            title: 'Expanded preview backdrop',
            description: 'Adds a transparent black backdrop to preview images to add some contrast.'
        }, table);

        // apply steam tax
        makeCheckboxOption(Settings.APPLY_STEAM_TAX, {
            title: 'Apply Steam Tax',
            description: 'Apply Steam Tax before calculating differences.\nThis will calculate the steam seller price from the provided reference price.'
        }, table);

        // show toast on action
        makeCheckboxOption(Settings.SHOW_TOAST_ON_ACTION, {
            title: 'Show Toast on action',
            description: 'If enabled, respective components will inform you via Buffs Toast system'
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
        makeSelectOption(Settings.DIFFERENCE_DOMINATOR, [
            {
                value: `${ExtensionSettings.DifferenceDominator.STEAM}`,
                displayStr: 'Steam',
                selected: storedSettings[Settings.DIFFERENCE_DOMINATOR] == ExtensionSettings.DifferenceDominator.STEAM
            }, {
                value: `${ExtensionSettings.DifferenceDominator.BUFF}`,
                displayStr: 'Buff',
                selected: storedSettings[Settings.DIFFERENCE_DOMINATOR] == ExtensionSettings.DifferenceDominator.BUFF
            }
        ], {
            title: 'Difference Dominator',
            description: 'Specify the dominator meaning:\nSteam: (scmp-bp)/scmp\nBuff: (scmp-bp)/bp\nUnless you know the difference might not want to change this setting.'
        }, adv_table);

        // default sort by
        makeSelectOption(Settings.DEFAULT_SORT_BY, Object.keys(ExtensionSettings.FILTER_SORT_BY).map(x => {
            return {
                value: ExtensionSettings.FILTER_SORT_BY[x],
                displayStr: x,
                selected: ExtensionSettings.FILTER_SORT_BY[x] == storedSettings[Settings.DEFAULT_SORT_BY]
            };
        }), {
            title: 'Default sort by',
            description: 'Default sort by for item listings\nDefault: Default\nNewest: Newest\nPrice Ascending: low to high\nPrice Descending: high to low\nFloat Ascending: low to high\nFloat Descending: high to low\nHot Descending: by heat..?'
        }, adv_table);

        // default sticker search
        makeSelectOption(Settings.DEFAULT_STICKER_SEARCH, Object.keys(ExtensionSettings.FILTER_STICKER_SEARCH).map(x => {
            return {
                value: ExtensionSettings.FILTER_STICKER_SEARCH[x],
                displayStr: x,
                selected: ExtensionSettings.FILTER_STICKER_SEARCH[x] == storedSettings[Settings.DEFAULT_STICKER_SEARCH]
            };
        }), {
            title: 'Default sticker search',
            description: 'Search listings with sticker settings automatically'
        }, adv_table);

        // choose what to expand, preview or screenshot
        makeSelectOption(Settings.EXPAND_TYPE, [
            {
                value: `${ExtensionSettings.ExpandScreenshotType.PREVIEW}`,
                displayStr: 'Preview',
                selected: storedSettings[Settings.EXPAND_TYPE] == ExtensionSettings.ExpandScreenshotType.PREVIEW
            },
            {
                value: `${ExtensionSettings.ExpandScreenshotType.INSPECT}`,
                displayStr: 'Inspect',
                selected: storedSettings[Settings.EXPAND_TYPE] == ExtensionSettings.ExpandScreenshotType.INSPECT
            }
        ], {
            title: 'Expand preview type',
            description: 'Either expand into a zoomed preview image or expand into the inspect image.'
        }, adv_table);

        // custom fop field
        makeSelectOption(Settings.CUSTOM_FOP, [
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
                selected: x[0] == storedSettings[Settings.CUSTOM_FOP]
            };
        }), {
            title: 'Custom FOP',
            description: 'Set the factor (or field) of preview, you should *not* change this from \'Auto\'.'
        }, adv_table);

        // custom currency fields
        makeTextOption(Settings.CUSTOM_CURRENCY_RATE, 'number', {
            title: 'Custom currency rate',
            description: 'Set the rate of the custom currency e.g.\n10 RMB -> 1 CC\nOnly active if \'Custom\' was selected in the \'Display Currency\' option.'
        }, adv_table);

        makeTextOption(Settings.CUSTOM_CURRENCY_NAME, 'text', {
            title: 'Custom currency name',
            description: 'Set the name of the custom currency. Only active if \'Custom\' was selected in the \'Display Currency\' option.'
        }, adv_table);

        // append advanced settings
        const adv_blank20 = document.createElement('div');
        adv_blank20.setAttribute('class', 'blank20');

        userSettings.append(adv_h3, adv_table, adv_blank20);

        // Add leech settings
        const leech_h3 = document.createElement('h3');
        leech_h3.innerHTML = 'BuffLEECH Settings';

        const leech_table = document.createElement('table');
        leech_table.setAttribute('class', 'list_tb');
        leech_table.setAttribute('width', '100%');

        // contributor key
        makeTextOption(Settings.LEECH_CONTRIBUTOR_KEY, 'text', {
            title: 'Contributor Key',
            description: 'Set your BuffLEECH contributor key here'
        }, leech_table);

        // append leech settings
        const leech_blank20 = document.createElement('div');
        leech_blank20.setAttribute('class', 'blank20');

        userSettings.append(leech_h3, leech_table, leech_blank20);
    }

    init();

}

