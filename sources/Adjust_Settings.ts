module Adjust_Settings {

    // imports
    import Settings = ExtensionSettings.Settings;

    // module

    interface PrefInfo {
        title: string,
        description?: string,
        dangerous?: boolean
    }

    const DANGER_SETTINGS: Settings[] = [
        Settings.EXPERIMENTAL_FETCH_FAVOURITE_BARGAIN_STATUS,
        Settings.EXPERIMENTAL_FETCH_ITEM_PRICE_HISTORY
    ];

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

    function makeDangerButton(mappedOption: Settings, prefInfo: PrefInfo, table: HTMLElement): void {
        const containerTD = makeTD('', 't_Left');

        containerTD.innerHTML = Util.buildHTML('button', {
            attributes: {
                'onclick': `window.postMessage(['${GlobalConstants.BUFF_UTILITY_SETTINGS_AGREE_DANGER}', '${mappedOption}'], '*');`
            },
            style: {
                'background': '#b00000',
                'color': '#f6f6f6',
                'font-weight': '800',
                'cursor': 'pointer'
            },
            content: 'Enable'
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
            makeTD('<button class="buff-utility-reset">Reset</button>', 't_Right')
        );

        table.append(tr);
    }

    function makeCheckboxOption(mappedOption: Settings, prefInfo: PrefInfo, table: HTMLElement): void {
        if (prefInfo['dangerous'] == true && !ExtensionSettings.hasBeenAgreed(mappedOption)) {
            makeDangerButton(mappedOption, prefInfo, table);
            return;
        }

        const containerTD = makeTD('', 't_Left');

        containerTD.innerHTML = Util.buildHTML('span', {
            content: [Util.buildHTML('div', {
                id: getOptionID(mappedOption),
                class: 'w-Checkbox',
                attributes: {
                    onclick: `window.postMessage('${GlobalConstants.BUFF_UTILITY_SETTINGS}', '*');`
                },
                content: [Util.buildHTML('span', {
                    class: <boolean>getSetting(mappedOption) ? 'on' : '',
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
            makeTD('<button class="buff-utility-reset">Reset</button>', 't_Right')
        );

        table.append(tr);
    }

    function readCheckboxSelected(option: Settings): boolean {
        return !!document.getElementById(getOptionID(option))?.querySelector('span.on');
    }

    function makeMultiCheckboxOption(mappedOption: Settings, options: string[], prefInfo: PrefInfo, table: HTMLElement): void {
        if (prefInfo['dangerous'] == true && !ExtensionSettings.hasBeenAgreed(mappedOption)) {
            makeDangerButton(mappedOption, prefInfo, table);
            return;
        }

        const containerTD = makeTD('', 't_Left');

        let option: boolean[] = getSetting(mappedOption);

        let html = '';
        for (let i = 0, l = option.length; i < l; i ++) {
            html += Util.buildHTML('span', {
                content: [Util.buildHTML('div', {
                    id: `${getOptionID(mappedOption)}-${i}`,
                    class: 'w-Checkbox',
                    attributes: {
                        onclick: `window.postMessage('${GlobalConstants.BUFF_UTILITY_SETTINGS}', '*');`
                    },
                    content: [Util.buildHTML('span', {
                        class: option[i] ? 'on' : '',
                        content: [
                            Util.buildHTML('i', { class: 'icon icon_checkbox' }),
                            ` ${options[i] ?? 'Open'} `
                        ]
                    })]
                })]
            });
        }

        containerTD.innerHTML = html;

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
            makeTD('<button class="buff-utility-reset">Reset</button>', 't_Right')
        );

        table.append(tr);
    }

    function readMultiCheckboxOption(option: Settings): boolean[] {
        let options = document.querySelectorAll(`[id^=${getOptionID(option)}-]`);

        let result = [];
        for (let i = 0, l = options.length; i < l; i ++) {
            result[i] = !!options[i]?.querySelector('span.on');
        }

        return result;
    }

    function makeSelectOption(mappedOption: Settings, options: { value: string, displayStr: string, selected?: boolean }[], prefInfo: PrefInfo, table: HTMLElement): void {
        if (prefInfo['dangerous'] == true && !ExtensionSettings.hasBeenAgreed(mappedOption)) {
            makeDangerButton(mappedOption, prefInfo, table);
            return;
        }

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
            makeTD('<button class="buff-utility-reset">Reset</button>', 't_Right')
        );

        table.append(tr);
    }

    function readSelectOption(option: Settings): string {
        return (<HTMLSelectElement>document.getElementById(getOptionID(option)))?.selectedOptions?.item(0)?.getAttribute('value');
    }

    function makeTextOption(mappedOption: Settings, type: string, prefInfo: PrefInfo, table: HTMLElement): void {
        if (prefInfo['dangerous'] == true && !ExtensionSettings.hasBeenAgreed(mappedOption)) {
            makeDangerButton(mappedOption, prefInfo, table);
            return;
        }

        const containerTD = makeTD('', 't_Left');

        containerTD.innerHTML = Util.buildHTML('span', {
            content: [Util.buildHTML('div', {
                content: [Util.buildHTML('input', {
                    id: getOptionID(mappedOption),
                    attributes: {
                        'type': type,
                        'value': `${getSetting(mappedOption)}`,
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
            makeTD('<button class="buff-utility-reset">Reset</button>', 't_Right')
        );

        table.append(tr);
    }

    function readTextOption(option: Settings): string {
        return (<HTMLInputElement>document.getElementById(getOptionID(option)))?.value;
    }

    function makeColorOption(mappedOption: Settings, options: string[], prefInfo: PrefInfo, table: HTMLElement): void {
        if (prefInfo['dangerous'] == true && !ExtensionSettings.hasBeenAgreed(mappedOption)) {
            makeDangerButton(mappedOption, prefInfo, table);
            return;
        }

        const containerTD = makeTD('', 't_Left');

        let option: string[] = getSetting(mappedOption);

        let html = '';
        for (let i = 0, l = option.length; i < l; i ++) {
            html += Util.buildHTML('div', {
                style: {
                    'display': 'grid',
                    'grid-template-columns': '140px 10px',
                    'margin-bottom': '5px'
                },
                content: [
                    Util.buildHTML('label', {
                        attributes: {
                            'for': `${getOptionID(mappedOption)}-${i}`
                        },
                        content: [options[i]]
                    }),
                    Util.buildHTML('input', {
                        attributes: {
                            'id': `${getOptionID(mappedOption)}-${i}`,
                            'type': 'color',
                            'value': `${option[i]}`,
                            'onchange': `window.postMessage('${GlobalConstants.BUFF_UTILITY_SETTINGS}', '*');`
                        }
                    }),
                ]
            });
        }

        containerTD.innerHTML = html;

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
            makeTD(`<div id="bu_color_preview" style="background: ${option[0]}; padding: 10px;">
<div style="text-align: center; background: ${option[0]}; color: ${option[2]}; border: 1px solid ${option[2]}; padding: 5px;">Text on normal <u>background</u></div>
<div style="text-align: center; background: ${option[1]}; color: ${option[2]}; border: 1px solid ${option[2]}; padding: 5px;">Text on hover <u>background</u></div>
<div style="text-align: center; background: ${option[0]}; color: ${option[3]}; border: 1px solid ${option[2]}; padding: 5px;">Disabled on <u>background</u></div>
<div style="text-align: center; background: ${option[1]}; color: ${option[3]}; border: 1px solid ${option[2]}; padding: 5px;">Disabled on hover <u>background</u></div>
</div>`, 't_Right')
        );

        table.append(tr);
    }

    function renderColorPreview(colors: string[]): void {
        let container = document.getElementById('bu_color_preview');

        container.setAttribute('style', `background: ${colors[0]}; padding: 10px;`);

        container.innerHTML = `<div style="text-align: center; background: ${colors[0]}; color: ${colors[2]}; border: 1px solid ${colors[2]}; padding: 5px;">Text on normal <u>background</u></div>
<div style="text-align: center; background: ${colors[1]}; color: ${colors[2]}; border: 1px solid ${colors[2]}; padding: 5px;">Text on hover <u>background</u></div>
<div style="text-align: center; background: ${colors[0]}; color: ${colors[3]}; border: 1px solid ${colors[2]}; padding: 5px;">Disabled on <u>background</u></div>
<div style="text-align: center; background: ${colors[1]}; color: ${colors[3]}; border: 1px solid ${colors[2]}; padding: 5px;">Disabled on hover <u>background</u></div>`;
    }

    function readColorOption(option: Settings): string[] {
        let options = <NodeListOf<HTMLInputElement>>document.querySelectorAll(`[id^=${getOptionID(option)}-]`);

        let result = [];
        for (let i = 0, l = options.length; i < l; i ++) {
            result[i] = options[i]?.value;
        }

        return result;
    }

    // add settings

    function init(): void {
        console.debug('[BuffUtility] Adjust_Settings');

        window.addEventListener('message', (e: MessageEvent) => {
            if (e.data == GlobalConstants.BUFF_UTILITY_SETTINGS) {
                // check changes
                ExtensionSettings.setSetting(Settings.SELECTED_CURRENCY, readSelectOption(Settings.SELECTED_CURRENCY));
                ExtensionSettings.setSetting(Settings.APPLY_CURRENCY_TO_DIFFERENCE, readCheckboxSelected(Settings.APPLY_CURRENCY_TO_DIFFERENCE));
                ExtensionSettings.setSetting(Settings.CAN_EXPAND_SCREENSHOTS, readCheckboxSelected(Settings.CAN_EXPAND_SCREENSHOTS));
                ExtensionSettings.setSetting(Settings.EXPAND_SCREENSHOTS_BACKDROP, readCheckboxSelected(Settings.EXPAND_SCREENSHOTS_BACKDROP));
                ExtensionSettings.setSetting(Settings.APPLY_STEAM_TAX, readCheckboxSelected(Settings.APPLY_STEAM_TAX));
                ExtensionSettings.setSetting(Settings.SHOW_TOAST_ON_ACTION, readCheckboxSelected(Settings.SHOW_TOAST_ON_ACTION));
                ExtensionSettings.setSetting(Settings.LISTING_OPTIONS, readMultiCheckboxOption(Settings.LISTING_OPTIONS));
                ExtensionSettings.setSetting(Settings.SHOW_FLOAT_BAR, readCheckboxSelected(Settings.SHOW_FLOAT_BAR));
                ExtensionSettings.setSetting(Settings.COLOR_LISTINGS, readMultiCheckboxOption(Settings.COLOR_LISTINGS));
                ExtensionSettings.setSetting(Settings.USE_SCHEME, readCheckboxSelected(Settings.USE_SCHEME));

                ExtensionSettings.setSetting(Settings.DIFFERENCE_DOMINATOR, readSelectOption(Settings.DIFFERENCE_DOMINATOR));
                ExtensionSettings.setSetting(Settings.DEFAULT_SORT_BY, readSelectOption(Settings.DEFAULT_SORT_BY));
                ExtensionSettings.setSetting(Settings.DEFAULT_STICKER_SEARCH, readSelectOption(Settings.DEFAULT_STICKER_SEARCH));
                ExtensionSettings.setSetting(Settings.EXPAND_TYPE, readSelectOption(Settings.EXPAND_TYPE));
                ExtensionSettings.setSetting(Settings.CUSTOM_FOP, readSelectOption(Settings.CUSTOM_FOP));
                ExtensionSettings.setSetting(Settings.LOCATION_RELOAD_NEWEST, readSelectOption(Settings.LOCATION_RELOAD_NEWEST));

                ExtensionSettings.setSetting(Settings.CUSTOM_CURRENCY_RATE, readTextOption(Settings.CUSTOM_CURRENCY_RATE));
                ExtensionSettings.setSetting(Settings.CUSTOM_CURRENCY_NAME, readTextOption(Settings.CUSTOM_CURRENCY_NAME));
                ExtensionSettings.setSetting(Settings.CUSTOM_CURRENCY_CALCULATED_RATE, 1 / getSetting(Settings.CUSTOM_CURRENCY_RATE));
                ExtensionSettings.setSetting(Settings.CUSTOM_CURRENCY_LEADING_ZEROS, Util.countLeadingZeros(`${getSetting(Settings.CUSTOM_CURRENCY_CALCULATED_RATE)}`.split('.')[1] ?? ''));

                ExtensionSettings.setSetting(Settings.DATA_PROTECTION, readCheckboxSelected(Settings.DATA_PROTECTION));

                let colors = readColorOption(Settings.COLOR_SCHEME);
                ExtensionSettings.setSetting(Settings.COLOR_SCHEME, colors);
                renderColorPreview(colors);

                ExtensionSettings.setSetting(Settings.EXPERIMENTAL_ALLOW_FAVOURITE_BARGAIN, readCheckboxSelected(Settings.EXPERIMENTAL_ALLOW_FAVOURITE_BARGAIN));
                ExtensionSettings.setSetting(Settings.EXPERIMENTAL_ADJUST_POPULAR, readCheckboxSelected(Settings.EXPERIMENTAL_ADJUST_POPULAR));
                ExtensionSettings.setSetting(Settings.EXPERIMENTAL_FETCH_NOTIFICATION, readCheckboxSelected(Settings.EXPERIMENTAL_FETCH_NOTIFICATION));
                ExtensionSettings.setSetting(Settings.EXPERIMENTAL_FETCH_FAVOURITE_BARGAIN_STATUS, readCheckboxSelected(Settings.EXPERIMENTAL_FETCH_FAVOURITE_BARGAIN_STATUS));
                ExtensionSettings.setSetting(Settings.EXPERIMENTAL_FETCH_ITEM_PRICE_HISTORY, readSelectOption(Settings.EXPERIMENTAL_FETCH_ITEM_PRICE_HISTORY));
                ExtensionSettings.setSetting(Settings.EXPERIMENTAL_ADJUST_MARKET_CURRENCY, readCheckboxSelected(Settings.EXPERIMENTAL_ADJUST_MARKET_CURRENCY));
                ExtensionSettings.setSetting(Settings.EXPERIMENTAL_FORMAT_CURRENCY, readSelectOption(Settings.EXPERIMENTAL_FORMAT_CURRENCY));

                // write settings
                ExtensionSettings.finalize();
            }

            if (typeof e.data == 'object' && e.data['length'] == 2 && e.data[0] == GlobalConstants.BUFF_UTILITY_SETTINGS_AGREE_DANGER) {
                PopupHelper.show(Util.buildHTML('div', {
                    content: [
                        Util.buildHTML('div', {
                            content: 'What you are about to enable, is considered <span style="color: #d00000; font-weight: 800;">DANGEROUS</span>.<br /><span style="font-weight: 800;">ONLY ENABLE IF YOU ARE AWARE OF THE RISKS.</span><br /><span style="font-size: 11px;">What does it mean when I say "Dangerous"? Simple: This setting violates Buff API integrity, therefor your account could be banned. This will eventually be rectified over a custom proxy, until then, you should not enable these.</span>'
                        }),
                        Util.buildHTML('input', {
                            attributes: {
                                'placeholder': 'Please type: enable',
                                'onkeyup': 'if(this.value == \'enable\') { document.getElementById(\'buff_utility_popup_confirm\').setAttribute(\'class\', \'i_Btn i_Btn_main\'); } else { document.getElementById(\'buff_utility_popup_confirm\').setAttribute(\'class\', \'i_Btn i_Btn_main i_Btn_disabled\'); }'
                            },
                            style: {
                                'margin-top': '5px'
                            }
                        })
                    ]
                }), {
                    onconfirm: () => {
                        if (document.getElementById('buff_utility_popup_confirm').getAttribute('class').indexOf('i_Btn_disabled') == -1) {
                            let stored = getSetting(Settings.STORE_DANGER_AGREEMENTS);

                            switch (e.data[1]) {
                                case Settings.EXPERIMENTAL_FETCH_FAVOURITE_BARGAIN_STATUS:
                                    stored[0] = true;
                                    break;
                                case Settings.EXPERIMENTAL_FETCH_ITEM_PRICE_HISTORY:
                                    stored[1] = true;
                                    break;
                            }

                            ExtensionSettings.setSetting(Settings.STORE_DANGER_AGREEMENTS, stored);
                            ExtensionSettings.finalize();

                            PopupHelper.hide();
                        }
                    }
                });
            }
        });

        // Get stuff
        const userSettings = document.querySelector('div.user-setting');

        // styles
        const customStyle = document.createElement('style');

        customStyle.innerHTML = `
tr button.buff-utility-reset {
    display: none;
}

tr:hover button.buff-utility-reset {
    display: block;
}
        `;

        userSettings.append(customStyle);

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
                selected: x == getSetting(Settings.SELECTED_CURRENCY)
            };
        });

        remapped.push({
            value: GlobalConstants.BUFF_UTILITY_CUSTOM_CURRENCY,
            displayStr: 'Custom',
            selected: GlobalConstants.BUFF_UTILITY_CUSTOM_CURRENCY == getSetting(Settings.SELECTED_CURRENCY)
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

        // listing options
        makeMultiCheckboxOption(Settings.LISTING_OPTIONS, [
            '3D Inspect',
            'Inspect in server',
            'Copy !gen/!gengl',
            'Share',
            'Match floatdb',
            'Narrow'
        ], {
            title: 'Listing options',
            description: 'Define what options show up on each listing'
        }, table);

        // show float bar
        makeCheckboxOption(Settings.SHOW_FLOAT_BAR, {
            title: 'Show float-bar',
            description: 'Show the float-bar buff has on the side, can be expanded back if hidden!'
        }, table);

        // color listings
        makeMultiCheckboxOption(Settings.COLOR_LISTINGS, [
            'Color Buy',
            'Color Bargain'
        ], {
            title: 'Color purchase options',
            description: 'Color purchase options, this will paint purchase options red if not affordable with the current held balance.'
        }, table);

        // use scheme
        makeCheckboxOption(Settings.USE_SCHEME, {
            title: 'Use Color Scheme',
            description: 'Use the defined color scheme (dark mode by default)'
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
                selected: getSetting(Settings.DIFFERENCE_DOMINATOR) == ExtensionSettings.DifferenceDominator.STEAM
            }, {
                value: `${ExtensionSettings.DifferenceDominator.BUFF}`,
                displayStr: 'Buff',
                selected: getSetting(Settings.DIFFERENCE_DOMINATOR) == ExtensionSettings.DifferenceDominator.BUFF
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
                selected: ExtensionSettings.FILTER_SORT_BY[x] == getSetting(Settings.DEFAULT_SORT_BY)
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
                selected: ExtensionSettings.FILTER_STICKER_SEARCH[x] == getSetting(Settings.DEFAULT_STICKER_SEARCH)
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
                selected: getSetting(Settings.EXPAND_TYPE) == ExtensionSettings.ExpandScreenshotType.PREVIEW
            },
            {
                value: `${ExtensionSettings.ExpandScreenshotType.INSPECT}`,
                displayStr: 'Inspect',
                selected: getSetting(Settings.EXPAND_TYPE) == ExtensionSettings.ExpandScreenshotType.INSPECT
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
                selected: x[0] == getSetting(Settings.CUSTOM_FOP)
            };
        }), {
            title: 'Custom FOP',
            description: 'Set the factor (or field) of preview, you should *not* change this from \'Auto\'.'
        }, adv_table);

        // location reload newest
        makeSelectOption(Settings.LOCATION_RELOAD_NEWEST, [
            [ExtensionSettings.LOCATION_RELOAD_NEWEST_VALUES.NONE, 'None'],
            [ExtensionSettings.LOCATION_RELOAD_NEWEST_VALUES.BULK, 'Bulk'],
            [ExtensionSettings.LOCATION_RELOAD_NEWEST_VALUES.SORT, 'Sort'],
            [ExtensionSettings.LOCATION_RELOAD_NEWEST_VALUES.CENTER, 'Center'],
            [ExtensionSettings.LOCATION_RELOAD_NEWEST_VALUES.LEFT, 'Left']
        ].map(x => {
            return {
                value: `${x[0]}`,
                displayStr: `${x[1]}`,
                selected: x[0] == getSetting(Settings.LOCATION_RELOAD_NEWEST)
            };
        }), {
            title: 'Location Reload Newest',
            description: 'Sets the location of the forced newest reload.\nNone: Don\'t show\nBulk: Next to \'Bulk Buy\'\nSort: Next to sorting\nCenter: In the center\nLeft: Left most position'
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

        // data protection
        makeCheckboxOption(Settings.DATA_PROTECTION, {
            title: 'Data protection',
            description: 'Blur some settings on the account page to protect yourself'
        }, adv_table);

        // color scheme
        makeColorOption(Settings.COLOR_SCHEME, [
            'Background',
            'Background Hover',
            'Text Color',
            'Text Color Disabled'
        ], {
            title: 'Color Scheme',
            description: 'Color Scheme for whatever theme you want (Dark-Theme by default)'
        }, adv_table);

        // append advanced settings
        const adv_blank20 = document.createElement('div');
        adv_blank20.setAttribute('class', 'blank20');

        userSettings.append(adv_h3, adv_table, adv_blank20);

        // Add experimental settings
        const ex_h3 = document.createElement('h3');
        ex_h3.innerHTML = 'BuffUtility Experimental Settings';

        const ex_table = document.createElement('table');
        ex_table.setAttribute('class', 'list_tb');
        ex_table.setAttribute('width', '100%');

        // experimental bargain favourites
        makeCheckboxOption(Settings.EXPERIMENTAL_ALLOW_FAVOURITE_BARGAIN, {
            title: 'Favourite Bargain',
            description: '!!!BuffUtility!!!\n!!!Experimental!!!\nShow the \'Bargain\' feature on favourites. Setting will be moved with 2.1.7 to advanced settings.'
        }, ex_table);

        // experimental adjust popular tab
        makeCheckboxOption(Settings.EXPERIMENTAL_ADJUST_POPULAR, {
            title: 'Adjust Popular Tab',
            description: '!!!BuffUtility!!!\n!!!Experimental!!!\nAdjust the \'Popular\' tab in the market page, adding some features. Setting will be removed with 2.1.7 and become default.'
        }, ex_table);

        // experimental fetch notification
        makeCheckboxOption(Settings.EXPERIMENTAL_FETCH_NOTIFICATION, {
            title: 'Currency Fetch Notification',
            description: '!!!BuffUtility!!!\n!!!Experimental!!!\nShow toast notification when currency rates were updated, happens once a day. Setting will be merged in 2.1.7 into \'Show Toast on Action\'.'
        }, ex_table);

        // experimental fetch bargain status
        makeCheckboxOption(Settings.EXPERIMENTAL_FETCH_FAVOURITE_BARGAIN_STATUS, {
            title: 'Fetch Favourite Bargain Status',
            description: '!!!BuffUtility!!!\n!!!Experimental!!!\n!!!Danger!!!\n!!!READ!!!\nThis will check the bargain status on favourites, to adjust the buttons accordingly, HOWEVER this is somewhat dangerous, as it will push API requests that are normally uncommon, use with caution. Setting will stay experimental until a better alternative is possibly discovered.',
            dangerous: true
        }, ex_table);

        // experimental fetch item price history
        makeSelectOption(Settings.EXPERIMENTAL_FETCH_ITEM_PRICE_HISTORY, [
            {
                value: `${ExtensionSettings.PriceHistoryRange.OFF}`,
                displayStr: 'Off',
                selected: getSetting(Settings.EXPERIMENTAL_FETCH_ITEM_PRICE_HISTORY) == ExtensionSettings.PriceHistoryRange.OFF
            },
            {
                value: `${ExtensionSettings.PriceHistoryRange.WEEKLY}`,
                displayStr: '7 Days',
                selected: getSetting(Settings.EXPERIMENTAL_FETCH_ITEM_PRICE_HISTORY) == ExtensionSettings.PriceHistoryRange.WEEKLY
            },
            {
                value: `${ExtensionSettings.PriceHistoryRange.MONTHLY}`,
                displayStr: '30 Days',
                selected: getSetting(Settings.EXPERIMENTAL_FETCH_ITEM_PRICE_HISTORY) == ExtensionSettings.PriceHistoryRange.MONTHLY
            }
        ], {
            title: 'Fetch item price history',
            description: '!!!BuffUtility!!!\n!!!Experimental!!!\n!!!Danger!!!\n!!!READ!!!\nThis will add a price history to the header of item pages, HOWEVER this is somewhat dangerous, as it will push API requests that are normally uncommon, use with caution. Setting will stay experimental until a better alternative is possibly discovered.',
            dangerous: true
        }, ex_table);

        // experimental adjust market currency
        makeCheckboxOption(Settings.EXPERIMENTAL_ADJUST_MARKET_CURRENCY, {
            title: 'Adjust Market Currency',
            description: '!!!BuffUtility!!!\n!!!Experimental!!!\nAdjust shown market currency to selected currency.'
        }, ex_table);

        // experimental compress currency
        makeSelectOption(Settings.EXPERIMENTAL_FORMAT_CURRENCY, [
            // NONE,
            // FORMATTED,
            // COMPRESSED,
            // SPACE_MATCH
            {
                value: `${ExtensionSettings.CurrencyNumberFormats.NONE}`,
                displayStr: 'None',
                selected: getSetting(Settings.EXPERIMENTAL_FORMAT_CURRENCY) == ExtensionSettings.CurrencyNumberFormats.NONE
            },
            {
                value: `${ExtensionSettings.CurrencyNumberFormats.FORMATTED}`,
                displayStr: 'Formatted',
                selected: getSetting(Settings.EXPERIMENTAL_FORMAT_CURRENCY) == ExtensionSettings.CurrencyNumberFormats.FORMATTED
            },
            {
                value: `${ExtensionSettings.CurrencyNumberFormats.COMPRESSED}`,
                displayStr: 'Compressed',
                selected: getSetting(Settings.EXPERIMENTAL_FORMAT_CURRENCY) == ExtensionSettings.CurrencyNumberFormats.COMPRESSED
            },
            {
                value: `${ExtensionSettings.CurrencyNumberFormats.SPACE_MATCH}`,
                displayStr: 'Space Match',
                selected: getSetting(Settings.EXPERIMENTAL_FORMAT_CURRENCY) == ExtensionSettings.CurrencyNumberFormats.SPACE_MATCH
            }
        ], {
            title: 'Compress Currency',
            description: '!!!BuffUtility!!!\n!!!Experimental!!!\nNone: Don\'t format at all.\nFormatted: Taken e.g. 1234.89 will be transformed to 1,234.89.\nCompressed: Taken e.g. 1234.89 will be transformed to 1.2K.\nSpace Match: Will either use Formatted or Compressed depending on space.'
        }, ex_table);

        // append experimental settings
        const ex_blank20 = document.createElement('div');
        ex_blank20.setAttribute('class', 'blank20');

        userSettings.append(ex_h3, ex_table, ex_blank20);

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

        // userSettings.append(leech_h3, leech_table, leech_blank20);

        // if #buffutility is present jump to the h3
        if (window?.location?.href?.indexOf('#buffutility') > -1) {
            window.scrollTo(0, h3.offsetTop);
        }
    }

    init();

}

