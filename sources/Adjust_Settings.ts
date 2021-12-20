/**
 * Author: Felix Vogel
 */
/** */
module Adjust_Settings {

    // helper functions

    import settings = ExtensionSettings.settings;

    const enum OptionID {
        CURRENCY_SELECT = 'buff-utility-currency-select',
        CUSTOM_CURRENCY_RATE = 'buff-utility-custom-currency-rate',
        CUSTOM_CURRENCY_NAME = 'buff-utility-custom-currency-name',
        EXPAND_SCREENSHOTS = 'buff-utility-expand-screenshots',
        EXPAND_SCREENSHOT_BACKDROP = 'buff-utility-expand-screenshot-backdrop',
        DOMINATOR_SELECT = 'buff-utility-dominator-select',
        APPLY_STEAM_TAX = 'buff-utility-apply-steam-tax',
        APPLY_CURRENCY_TO_DIFFERENCE = 'buff-utility-apply-currency-to-difference',
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

    function makeTextOption(id: string, type: string, mappedOption: string, prefInfo: { title: string, description?: string }, table: HTMLElement): void {
        const containerTD = makeTD('', 't_Left');

        containerTD.innerHTML = Util.buildHTML('span', {
            content: [Util.buildHTML('div', {
                content: [Util.buildHTML('input', {
                    id: id,
                    attributes: {
                        'type': type,
                        'value': `${ExtensionSettings.settings[mappedOption]}`,
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

    export function readTextOption<T>(id: string, operation: (str: string) => T): T {
        return operation((<HTMLInputElement>document.getElementById(id)).value);
    }

    // add settings

    function init(): void {
        console.debug('[BuffUtility] Adjust_Settings');

        window.addEventListener('message', (e: MessageEvent) => {
            if (e.data == GlobalConstants.BUFF_UTILITY_SETTINGS) {
                let { settings } = ExtensionSettings;

                // copy data to see changes
                let old = JSON.parse(JSON.stringify(settings));

                // check changes
                settings.selected_currency = readSelectOption(OptionID.CURRENCY_SELECT);

                settings.apply_currency_to_difference = isCheckboxSelected(OptionID.APPLY_CURRENCY_TO_DIFFERENCE);
                settings.can_expand_screenshots = isCheckboxSelected(OptionID.EXPAND_SCREENSHOTS);
                settings.expand_screenshots_backdrop = isCheckboxSelected(OptionID.EXPAND_SCREENSHOT_BACKDROP);
                settings.apply_steam_tax = isCheckboxSelected(OptionID.APPLY_STEAM_TAX);

                settings.difference_dominator = +readSelectOption(OptionID.DOMINATOR_SELECT);

                settings.default_sort_by = readSelectOption(OptionID.SORT_BY, 'default');

                settings.custom_fop = readSelectOption(OptionID.CUSTOM_FOP, 'Auto');

                settings.custom_currency_rate = readTextOption(OptionID.CUSTOM_CURRENCY_RATE, (str) => Math.max(+(str?.length > 0 ? str : 0), 0.0001));
                settings.custom_currency_name = readTextOption(OptionID.CUSTOM_CURRENCY_NAME, (str) => {
                    if (str?.length == 0) str = 'CC';

                    return str;
                });

                settings.custom_currency_calculated_rate = 1 / settings.custom_currency_rate;
                settings.custom_currency_leading_zeros = Util.countLeadingZeros(`${settings.custom_currency_calculated_rate}`.split('.')[1] ?? '');

                // save any changes
                ExtensionSettings.save();

                // check changes
                let changes: string[] = Object.keys(settings)
                    .filter(x => settings[x] != old[x])
                    .map(x => `${x}: ${old[x]} -> ${settings[x]}`);

                if (changes.length > 0) {
                    console.debug(`[BuffUtility] Saved settings.\n`, changes.join('\n'));
                }
            }
        });

        // Get stuff
        let { settings } = ExtensionSettings;
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
                selected: x == settings.selected_currency
            };
        });

        remapped.push({
            value: GlobalConstants.BUFF_UTILITY_CUSTOM_CURRENCY,
            displayStr: 'Custom',
            selected: GlobalConstants.BUFF_UTILITY_CUSTOM_CURRENCY == settings.selected_currency
        });

        makeSelectOption(OptionID.CURRENCY_SELECT, remapped, {
            title: 'Display Currency'
        }, table);

        // apply currency to difference
        makeCheckboxOption(OptionID.APPLY_CURRENCY_TO_DIFFERENCE, 'apply_currency_to_difference', {
            title: 'Apply Currency to difference',
            description: 'Whether to show the difference on the listing page in your selected currency or RMB.'
        }, table);

        // expand screenshot
        makeCheckboxOption(OptionID.EXPAND_SCREENSHOTS, 'can_expand_screenshots', {
            title: 'Can expand preview',
            description: 'Can previews be expanded on sell listings. This only works if \'Preview screenshots\' is turned on and if the item has been inspected.'
        }, table);

        // expand screenshot backdrop
        makeCheckboxOption(OptionID.EXPAND_SCREENSHOT_BACKDROP, 'expand_screenshots_backdrop', {
            title: 'Expanded preview backdrop',
            description: 'Adds a transparent black backdrop to preview images to add some contrast.'
        }, table);

        // apply steam tax
        makeCheckboxOption(OptionID.APPLY_STEAM_TAX, 'apply_steam_tax', {
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
                selected: settings.difference_dominator == ExtensionSettings.DifferenceDominator.STEAM
            }, {
                value: `${ExtensionSettings.DifferenceDominator.BUFF}`,
                displayStr: 'Buff',
                selected: settings.difference_dominator == ExtensionSettings.DifferenceDominator.BUFF
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
                selected: ExtensionSettings.SORT_BY[x] == ExtensionSettings.settings.default_sort_by
            };
        }), {
            title: 'Default sort by',
            description: 'Default sort by for item listings\nDefault: Default\nNewest: Newest\nPrice Ascending: low to high\nPrice Descending: high to low\nFloat Ascending: low to high\nFloat Descending: high to low\nHot Descending: by heat..?'
        }, adv_table);

        // custom fop field
        makeSelectOption(OptionID.CUSTOM_FOP, Object.keys(ExtensionSettings.FOP_PRESETS).map(x => {
            return {
                value: x,
                displayStr: x,
                selected: x == ExtensionSettings.settings.custom_fop
            };
        }), {
            title: 'Custom FOP',
            description: 'Set the factor (or field) of preview, you should *not* change this from \'Auto\'.'
        }, adv_table);

        // custom currency fields
        makeTextOption(OptionID.CUSTOM_CURRENCY_RATE, 'number', 'custom_currency_rate', {
            title: 'Custom currency rate',
            description: 'Set the rate of the custom currency e.g.\n10 RMB -> 1 CC\nOnly active if \'Custom\' was selected in the \'Display Currency\' option.'
        }, adv_table);

        makeTextOption(OptionID.CUSTOM_CURRENCY_NAME, 'text', 'custom_currency_name', {
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

