module Options {

    import resetSetting = ExtensionSettings.resetSetting;
    import setSetting = ExtensionSettings.setSetting;
    import getSetting = ExtensionSettings.getSetting;

    interface DisplayInfo {
        title: string,
        description: string
    }

    interface SelectOption {
        displayText: string,
        value: any
    }

    function createSettingHTML(info: DisplayInfo, settingHTML: string): string {
        return Util.buildHTML('tr', {
            content: [
                Util.buildHTML('td', {
                    content: [
                        Util.buildHTML('div', {
                            class: 'setting-title',
                            content: [ info.title ]
                        }),
                        Util.buildHTML('div', {
                            class: 'setting-description action',
                            content: [ `<span class="setting-description sym-expanded">-</span> Description</div>` ]
                        }),
                        Util.buildHTML('div', {
                            class: 'setting-description text-expanded',
                            content: [ info.description ]
                        }),
                    ]
                }),
                Util.buildHTML('td', {
                    content: [ settingHTML ]
                }),
                Util.buildHTML('td')
            ]
        }) + Util.buildHTML('tr', {
            content: [
                '<td><hr /></td>'
            ]
        });
    }

    function createInputOption(setting: Settings, info: DisplayInfo, type: string, value: any): string {
        return createSettingHTML(info, Util.buildHTML('input', {
            id: setting,
            attributes: {
                'type': type,
                'data-target': 'input',
                'value': `${value}`
            }
        }));
    }

    function createCheckboxOption(setting: Settings, info: DisplayInfo): string {
        return createSettingHTML(info, Util.buildHTML('input', {
            id: setting,
            attributes: {
                'type': 'checkbox',
                'data-target': 'checkbox',
                [getSetting(setting) ? 'checked' : 'no-checked']: ''
            }
        }));
    }

    function createSelectOption(setting: Settings, info: DisplayInfo, options: SelectOption[], selectedOption?: any): string {
        return createSettingHTML(info, Util.buildHTML('select', {
            id: setting,
            attributes: {
                'data-target': 'select'
            },
            content: (options ?? []).map(option => `<option value="${option.value}" ${(selectedOption == option.value) ? 'selected' : ''}>${option.displayText}</option>`)
        }));
    }

    function createMultiCheckboxOption(setting: Settings, info: DisplayInfo, options: string[]): string {
        const values: boolean[] = getSetting(setting);
        return createSettingHTML(info, Util.buildHTML('div', {
            id: setting,
            content: options.map((option, index) => Util.buildHTML('div', {
                content: [
                    Util.buildHTML('label', {
                        attributes: {
                            'for': `${setting}-${index}`
                        },
                        content: option
                    }),
                    Util.buildHTML('input', {
                        id: `${setting}-${index}`,
                        attributes: {
                            'type': 'checkbox',
                            'data-target': 'multi',
                            'data-setting': setting,
                            'data-index': `${index}`,
                            [values[index] ? 'checked' : 'no-checked']: ''
                        }
                    })
                ]
            }))
        }));
    }

    async function init(): Promise<void> {
        // make sure settings are loaded
        await ExtensionSettings.isLoaded();

        let normalSettings: string = '';
        let advancedSettings: string = '';
        let experimentalSettings: string = '';

        // --- Normal Settings ---

        // Settings.SELECTED_CURRENCY
        CurrencyHelper.initialize(false);
        const currencyData = CurrencyHelper.getData();
        normalSettings += createSelectOption(Settings.SELECTED_CURRENCY, {
            title: 'Display Currency',
            description: 'Set the display currency to be used across BuffUtility'
        }, Object.keys(currencyData.rates).map(key => {
            return {
                displayText: `${key} - ${currencyData.symbols[key] ?? '?'}`,
                value: key
            };
        }), getSetting(Settings.SELECTED_CURRENCY));

        // Settings.APPLY_CURRENCY_TO_DIFFERENCE
        normalSettings += createCheckboxOption(Settings.APPLY_CURRENCY_TO_DIFFERENCE, {
            title: 'Apply Currency to difference',
            description: 'Whether to show the difference on the listing page in your selected currency or RMB.'
        });

        // Settings.CAN_EXPAND_SCREENSHOTS
        normalSettings += createCheckboxOption(Settings.CAN_EXPAND_SCREENSHOTS, {
            title: 'Can expand preview',
            description: 'Can previews be expanded on sell listings. This only works if "Preview screenshots" is turned on and if the item has been inspected.'
        });

        // Settings.EXPAND_SCREENSHOTS_BACKDROP
        normalSettings += createCheckboxOption(Settings.EXPAND_SCREENSHOTS_BACKDROP, {
            title: 'Expanded preview backdrop',
            description: 'Adds a transparent black backdrop to preview images to add some contrast.'
        });

        // Settings.APPLY_STEAM_TAX
        normalSettings += createCheckboxOption(Settings.APPLY_STEAM_TAX, {
            title: 'Apply Steam Tax',
            description: 'Apply Steam Tax before calculating differences.<br/>This will calculate the steam seller price from the provided reference price.'
        });

        // Settings.SHOW_TOAST_ON_ACTION
        normalSettings += createCheckboxOption(Settings.SHOW_TOAST_ON_ACTION, {
            title: 'Show Toast on action',
            description: 'If enabled, certain BuffUtility components will inform you via Buffs Toast system.'
        });

        // Settings.LISTING_OPTIONS
        normalSettings += createMultiCheckboxOption(Settings.LISTING_OPTIONS, {
            title: 'Listing options',
            description: 'Define what options show up on each listing'
        }, [
            '3D Inspect',
            'Inspect in server',
            'Copy !gen/!gengl',
            'Share',
            'Match floatdb',
            'Narrow'
        ]);

        // Settings.SHOW_FLOAT_BAR
        normalSettings += createCheckboxOption(Settings.SHOW_FLOAT_BAR, {
            title: 'Show float-bar',
            description: 'Show the float-bar buff has on the side, can be expanded back if hidden!'
        });

        // Settings.COLOR_LISTINGS
        createMultiCheckboxOption(Settings.COLOR_LISTINGS, {
            title: 'Color purchase options',
            description: 'Color purchase options, this will paint purchase options red if not affordable with the current held balance.'
        }, [
            'Color Buy',
            'Color Bargain'
        ]);

        // Settings.USE_SCHEME
        createCheckboxOption(Settings.USE_SCHEME, {
            title: 'Use Color Scheme',
            description: 'Use the defined color scheme (dark mode by default)'
        });

        // --- Advanced Settings ---
        // Settings.DIFFERENCE_DOMINATOR
        advancedSettings += createSelectOption(Settings.DIFFERENCE_DOMINATOR, {
            title: 'Difference Dominator',
            description: 'Specify the dominator meaning:<br>Steam: (scmp-bp)/scmp\nBuff: (scmp-bp)/bp<br>Unless you know the difference might not want to change this setting.'
        }, [
            {
                displayText: 'Steam',
                value: ExtensionSettings.DifferenceDominator.STEAM
            },
            {
                displayText: 'Buff',
                value: ExtensionSettings.DifferenceDominator.BUFF
            }
        ], getSetting(Settings.DIFFERENCE_DOMINATOR));

        // Settings.DEFAULT_SORT_BY
        advancedSettings += createSelectOption(Settings.DEFAULT_SORT_BY, {
            title: 'Default sort by',
            description: 'Default sort by for item listings<br>Default: Default<br>Newest: Newest<br>Price Ascending: low to high<br>Price Descending: high to low<br>Float Ascending: low to high<br>Float Descending: high to low<br>Hot Descending: by popularity'
        }, Object.keys(ExtensionSettings.FILTER_SORT_BY).map(option => {
            return {
                displayText: option,
                value: ExtensionSettings.FILTER_SORT_BY[option]
            };
        }), getSetting(Settings.DEFAULT_SORT_BY));

        // Settings.DEFAULT_STICKER_SEARCH
        advancedSettings += createSelectOption(Settings.DEFAULT_STICKER_SEARCH, {
            title: 'Default sticker search',
            description: 'Search listings with sticker settings automatically.'
        }, Object.keys(ExtensionSettings.FILTER_STICKER_SEARCH).map(option => {
            return {
                displayText: option,
                value: ExtensionSettings.FILTER_STICKER_SEARCH[option]
            };
        }), getSetting(Settings.DEFAULT_STICKER_SEARCH));

        // Settings.EXPAND_TYPE
        advancedSettings += createSelectOption(Settings.EXPAND_TYPE, {
            title: 'Expand preview type',
            description: 'Either expand into a zoomed preview image or expand into the inspect image.'
        }, [
            {
                displayText: 'Preview',
                value: ExtensionSettings.ExpandScreenshotType.PREVIEW
            },
            {
                displayText: 'Inspect',
                value: ExtensionSettings.ExpandScreenshotType.INSPECT
            }
        ], getSetting(Settings.EXPAND_TYPE));

        // Settings.CUSTOM_FOP
        advancedSettings += createSelectOption(Settings.CUSTOM_FOP, {
            title: 'Custom FOP',
            description: 'Set the factor (or field) of preview, you should <b>not</b> change this from \'Auto\'.'
        }, [

        ], getSetting(Settings.CUSTOM_FOP));

        // Settings.LOCATION_RELOAD_NEWEST
        // Settings.CUSTOM_CURRENCY_RATE
        // Settings.CUSTOM_CURRENCY_NAME
        // Settings.DATA_PROTECTION
        // Settings.COLOR_SCHEME

        // --- Experimental Settings ---
        // Settings.EXPERIMENTAL_ALLOW_FAVOURITE_BARGAIN
        // Settings.EXPERIMENTAL_ADJUST_POPULAR
        // Settings.EXPERIMENTAL_FETCH_NOTIFICATION
        // Settings.EXPERIMENTAL_FETCH_FAVOURITE_BARGAIN_STATUS - disabled
        // Settings.EXPERIMENTAL_FETCH_ITEM_PRICE_HISTORY - disabled
        // Settings.EXPERIMENTAL_ADJUST_MARKET_CURRENCY
        // Settings.EXPERIMENTAL_FORMAT_CURRENCY
        // Settings.EXPERIMENTAL_ADJUST_SHOP
        // Settings.EXPERIMENTAL_ALLOW_BULK_BUY

        // append html
        document.querySelector('#settings-normal tbody').innerHTML = normalSettings;
        document.querySelector('#settings-advanced tbody').innerHTML = advancedSettings;
        document.querySelector('#settings-experimental tbody').innerHTML = experimentalSettings;

        // add events
        (<NodeListOf<HTMLElement>>document.querySelectorAll('[data-target]')).forEach(element => {
            switch (element.getAttribute('data-target')) {
                case 'checkbox':
                    element.onclick = () => {
                        console.debug('checkbox', element, (<HTMLInputElement>element).checked);

                        setSetting(<Settings>element.getAttribute('id'), (<HTMLInputElement>element).checked);
                    };
                    break;
                case 'input':
                    element.onkeyup = () => {
                        console.debug('input', element, (<HTMLInputElement>element).value);

                        setSetting(<Settings>element.getAttribute('id'), (<HTMLInputElement>element).value);
                    };
                    break;
                case 'multi':
                    element.onclick = () => {
                        console.debug('checkbox', element, (<HTMLInputElement>element).checked);

                        let values: boolean[] = getSetting(<Settings>element.getAttribute('data-setting'));
                        let index = parseInt(element.getAttribute('data-index'));
                        values[index] = (<HTMLInputElement>element).checked;
                        setSetting(<Settings>element.getAttribute('data-setting'), values);
                    };
                    break;
                case 'select':
                    element.onchange = () => {
                        console.debug('select', element, (<HTMLSelectElement>element).selectedOptions[0]);

                        setSetting(<Settings>element.getAttribute('id'), (<HTMLSelectElement>element).selectedOptions[0].getAttribute('value') ?? 'USD');
                    };
                    break;
            }
        });

        (<NodeListOf<HTMLElement>>document.querySelectorAll('.setting-description.action')).forEach(element => {
            element.onclick = () => {
                let collapsedText = <HTMLElement>element.parentElement.querySelector('.setting-description.text-collapsed');
                let symCollapsed = <HTMLElement>element.querySelector('.setting-description.sym-collapsed');
                let expandedText = <HTMLElement>element.parentElement.querySelector('.setting-description.text-expanded');
                let symExpanded = <HTMLElement>element.querySelector('.setting-description.sym-expanded');

                if (collapsedText) {
                    collapsedText.setAttribute('class', 'setting-description text-expanded');
                    symCollapsed.innerText = '-';
                    symCollapsed.setAttribute('class', 'setting-description sym-expanded');
                }

                if (expandedText) {
                    expandedText.setAttribute('class', 'setting-description text-collapsed');
                    symExpanded.innerText = '+';
                    symExpanded.setAttribute('class', 'setting-description sym-collapsed');
                }
            };
        });
    }

    init();

}
