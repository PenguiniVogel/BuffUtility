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

    function createSettingHTML(setting: Settings, info: DisplayInfo, settingHTML: string): string {
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
                        Util.buildHTML('button', {
                            attributes: {
                                'data-reset': setting
                            },
                            content: [ 'Reset' ]
                        })
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
        return createSettingHTML(setting, info, Util.buildHTML('input', {
            id: setting,
            attributes: {
                'type': type,
                'data-target': 'input',
                'value': `${value}`
            }
        }));
    }

    function createCheckboxOption(setting: Settings, info: DisplayInfo): string {
        return createSettingHTML(setting, info, Util.buildHTML('input', {
            id: setting,
            attributes: {
                'type': 'checkbox',
                'data-target': 'checkbox',
                [getSetting(setting) ? 'checked' : 'no-checked']: ''
            }
        }));
    }

    function createSelectOption(setting: Settings, info: DisplayInfo, options: SelectOption[], selectedOption?: any): string {
        return createSettingHTML(setting, info, Util.buildHTML('select', {
            id: setting,
            attributes: {
                'data-target': 'select'
            },
            content: (options ?? []).map(option => `<option value="${option.value}" ${(selectedOption == option.value) ? 'selected' : ''}>${option.displayText}</option>`)
        }));
    }

    function createMultiCheckboxOption(setting: Settings, info: DisplayInfo, options: string[]): string {
        const values: boolean[] = getSetting(setting);
        return createSettingHTML(setting, info, Util.buildHTML('div', {
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
                            'data-target': 'multi-checkbox',
                            'data-setting': setting,
                            'data-index': `${index}`,
                            [values[index] ? 'checked' : 'no-checked']: ''
                        }
                    })
                ]
            }))
        }));
    }

    function createMultiInputOption(setting: Settings, info: DisplayInfo, type: string, options: string[]): string {
        const values: any[] = getSetting(setting);
        return createSettingHTML(setting, info, Util.buildHTML('div', {
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
                            'type': type,
                            'data-target': 'multi-input',
                            'data-setting': setting,
                            'data-index': `${index}`,
                            'value': `${values[index]}`
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
            description: 'Set the display currency to be used across BuffUtility.'
        }, [
            ...Object.keys(currencyData.rates).map(key => {
                return {
                    displayText: `${key} - ${currencyData.symbols[key] ?? '?'}`,
                    value: key
                };
            }),
            {
                displayText: 'Custom - CC',
                value: GlobalConstants.BUFF_UTILITY_CUSTOM_CURRENCY
            }
        ], getSetting(Settings.SELECTED_CURRENCY));

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
            description: 'Define what options show up on each listing.'
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
        normalSettings += createMultiCheckboxOption(Settings.COLOR_LISTINGS, {
            title: 'Color purchase options',
            description: 'Color purchase options, this will paint purchase options red if not affordable with the current held balance.'
        }, [
            'Color Buy',
            'Color Bargain'
        ]);

        // Settings.USE_SCHEME
        normalSettings += createCheckboxOption(Settings.USE_SCHEME, {
            title: 'Use Color Scheme',
            description: 'Use the defined color scheme (dark mode by default).'
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
            description: 'Default sort by for item listings<br>Default: Default<br>Newest: Newest<br>Price Ascending: low to high<br>Price Descending: high to low<br>Float Ascending: low to high<br>Float Descending: high to low<br>Hot Descending: by popularity.<br>Sticker: By Sticker price descending.'
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
            title: 'Custom Preview resolution',
            description: 'Set the resolution of preview images. You should <b>not</b> change this from <b>Auto</b> unless you have slow internet, then you should choose one of the lower values (e.g. 245, 490 or 980).'
        }, [
            {
                displayText: 'Auto',
                value: ExtensionSettings.FOP_VALUES.Auto
            },
            {
                displayText: 'w245/h230',
                value: ExtensionSettings.FOP_VALUES.w245xh230
            },
            {
                displayText: 'w490/h460',
                value: ExtensionSettings.FOP_VALUES.w490xh460
            },
            {
                displayText: 'w980/h920',
                value: ExtensionSettings.FOP_VALUES.w980xh920
            },
            {
                displayText: 'w1960/h1840',
                value: ExtensionSettings.FOP_VALUES.w1960xh1840
            },
            {
                displayText: 'w3920/h3680',
                value: ExtensionSettings.FOP_VALUES.w3920xh3680
            }
        ], getSetting(Settings.CUSTOM_FOP));

        // Settings.LOCATION_RELOAD_NEWEST
        advancedSettings += createSelectOption(Settings.LOCATION_RELOAD_NEWEST, {
            title: 'Location Reload Newest',
            description: 'Sets the location of the forced newest reload.<br>None: Don\'t show<br>Bulk: Next to "Bulk Buy"<br>Sort: Next to sorting<br>Center: In the center<br>Left: Left most position.'
        }, [
            {
                displayText: 'None',
                value: ExtensionSettings.LOCATION_RELOAD_NEWEST_VALUES.NONE
            },
            {
                displayText: 'Bulk',
                value: ExtensionSettings.LOCATION_RELOAD_NEWEST_VALUES.BULK
            },
            {
                displayText: 'Sort',
                value: ExtensionSettings.LOCATION_RELOAD_NEWEST_VALUES.SORT
            },
            {
                displayText: 'Center',
                value: ExtensionSettings.LOCATION_RELOAD_NEWEST_VALUES.CENTER
            },
            {
                displayText: 'Left',
                value: ExtensionSettings.LOCATION_RELOAD_NEWEST_VALUES.LEFT
            }
        ], getSetting(Settings.LOCATION_RELOAD_NEWEST));

        // Settings.CUSTOM_CURRENCY_RATE
        advancedSettings += createInputOption(Settings.CUSTOM_CURRENCY_RATE, {
            title: 'Custom currency rate',
            description: 'Set the rate of the custom currency e.g.<br>10 RMB -> 1 CC<br>Only active if "Custom" was selected in the "Display Currency" option.'
        }, 'number', getSetting(Settings.CUSTOM_CURRENCY_RATE));

        // Settings.CUSTOM_CURRENCY_NAME
        advancedSettings += createInputOption(Settings.CUSTOM_CURRENCY_NAME, {
            title: 'Custom currency name',
            description: 'Set the name of the custom currency.<br>Only active if "Custom" was selected in the "Display Currency" option.'
        }, 'text', getSetting(Settings.CUSTOM_CURRENCY_NAME));

        // Settings.DATA_PROTECTION
        advancedSettings += createCheckboxOption(Settings.DATA_PROTECTION, {
            title: 'Data protection',
            description: 'Blur some settings on the account page to protect yourself.'
        });

        // Settings.COLOR_SCHEME
        advancedSettings += createMultiInputOption(Settings.COLOR_SCHEME, {
            title: 'Color Scheme',
            description: 'Color Scheme for whatever theme you want (Dark-Theme by default)'
        }, 'color', [
            'Background',
            'Background Hover',
            'Text Color',
            'Text Color Disabled'
        ]);

        // --- Experimental Settings ---
        // Settings.EXPERIMENTAL_ALLOW_FAVOURITE_BARGAIN
        experimentalSettings += createCheckboxOption(Settings.EXPERIMENTAL_ALLOW_FAVOURITE_BARGAIN, {
            title: 'Favourite Bargain',
            description: '<u><b>BuffUtility<br>Experimental<br></b></u>Show the "Bargain" feature on favourites.<br><small>* Setting will be moved with 2.1.9 to advanced settings.</small>'
        });

        // Settings.EXPERIMENTAL_ADJUST_POPULAR
        experimentalSettings += createCheckboxOption(Settings.EXPERIMENTAL_ADJUST_POPULAR, {
            title: 'Adjust Popular Tab',
            description: '<u><b>BuffUtility<br>Experimental<br></b></u>Adjust the "Popular" tab in the market page, adding some features.<br><small>* Setting will be removed with 2.1.9 and become default.</small>'
        });

        // Settings.EXPERIMENTAL_FETCH_NOTIFICATION
        experimentalSettings += createCheckboxOption(Settings.EXPERIMENTAL_FETCH_NOTIFICATION, {
            title: 'Currency Fetch Notification',
            description: '<u><b>BuffUtility<br>Experimental<br></b></u>Show toast notification when currency rates were updated, happens once a day.<br><small>* Setting will be merged in 2.1.9 into "Show Toast on Action".</small>'
        });

        // Settings.EXPERIMENTAL_FETCH_FAVOURITE_BARGAIN_STATUS - disabled until proxy works
        // experimentalSettings += createCheckboxOption(Settings.EXPERIMENTAL_FETCH_FAVOURITE_BARGAIN_STATUS, {
        //     title: 'Fetch Favourite Bargain Status',
        //     description: '!!!BuffUtility!!!\\n!!!Experimental!!!\\n!!!Danger!!!\\n!!!READ!!!\\nThis will check the bargain status on favourites, to adjust the buttons accordingly, HOWEVER this is somewhat dangerous, as it will push API requests that are normally uncommon, use with caution. Setting will stay experimental until a better alternative is possibly discovered.'
        // });

        // Settings.EXPERIMENTAL_FETCH_ITEM_PRICE_HISTORY - disabled until proxy works
        // experimentalSettings += createSelectOption(Settings.EXPERIMENTAL_FETCH_ITEM_PRICE_HISTORY, {
        //     title: 'Fetch item price history',
        //     description: '!!!BuffUtility!!!\\n!!!Experimental!!!\\n!!!Danger!!!\\n!!!READ!!!\\nThis will add a price history to the header of item pages, HOWEVER this is somewhat dangerous, as it will push API requests that are normally uncommon, use with caution. Setting will stay experimental until a better alternative is possibly discovered.'
        // }, [
        //     {
        //         displayText: 'Off',
        //         value: ExtensionSettings.PriceHistoryRange.OFF
        //     },
        //     {
        //         displayText: '7 Days',
        //         value: ExtensionSettings.PriceHistoryRange.WEEKLY
        //     },
        //     {
        //         displayText: '30 Days',
        //         value: ExtensionSettings.PriceHistoryRange.MONTHLY
        //     }
        // ], getSetting(Settings.EXPERIMENTAL_FETCH_ITEM_PRICE_HISTORY));

        // Settings.EXPERIMENTAL_ADJUST_MARKET_CURRENCY
        experimentalSettings += createCheckboxOption(Settings.EXPERIMENTAL_ADJUST_MARKET_CURRENCY, {
            title: 'Adjust Market Currency',
            description: '<u><b>BuffUtility<br>Experimental<br></b></u>Adjust shown market currency to selected currency.<br><small>* Setting will be moved with 2.1.9 to advanced settings.</small>'
        });

        // Settings.EXPERIMENTAL_FORMAT_CURRENCY
        experimentalSettings += createSelectOption(Settings.EXPERIMENTAL_FORMAT_CURRENCY, {
            title: 'Format Currency',
            description: '<u><b>BuffUtility<br>Experimental<br></b></u>None: Don\'t format at all.<br>Formatted: Taken e.g. 1234.89 will be transformed to 1,234.89.<br>Compressed: Taken e.g. 1234.89 will be transformed to 1.2<small>K</small>.<br>Space Match: Will either use Formatted or Compressed depending on space.<br><small>* Setting will be moved with 2.1.9 to advanced settings.</small>'
        }, [
            {
                displayText: 'None',
                value: ExtensionSettings.CurrencyNumberFormats.NONE
            },
            {
                displayText: 'Formatted',
                value: ExtensionSettings.CurrencyNumberFormats.FORMATTED
            },
            {
                displayText: 'Compressed',
                value: ExtensionSettings.CurrencyNumberFormats.COMPRESSED
            },
            {
                displayText: 'Space Match',
                value: ExtensionSettings.CurrencyNumberFormats.SPACE_MATCH
            }
        ], getSetting(Settings.EXPERIMENTAL_FORMAT_CURRENCY));

        // Settings.EXPERIMENTAL_ADJUST_SHOP
        experimentalSettings += createCheckboxOption(Settings.EXPERIMENTAL_ADJUST_SHOP, {
            title: 'Adjust Shop Pages',
            description: '<u><b>BuffUtility<br>Experimental<br></b></u>Adjust the "Shop" pages. This adds features such as the share link and !gen/!gengl.<br><small>* Setting will be removed with 2.1.9 and become default behaviour.</small>'
        });

        // Settings.EXPERIMENTAL_ALLOW_BULK_BUY
        experimentalSettings += createCheckboxOption(Settings.EXPERIMENTAL_ALLOW_BULK_BUY, {
            title: 'Allow bulk buy',
            description: '<u><b>BuffUtility<br>Experimental<br></b></u>Allow the bulk buy function to be used on the web version of Buff.<br><small>* Setting will be moved with 2.1.9 to advanced settings.</small>'
        });

        // append html
        document.querySelector('#settings-normal tbody').innerHTML = normalSettings;
        document.querySelector('#settings-advanced tbody').innerHTML = advancedSettings;
        document.querySelector('#settings-experimental tbody').innerHTML = experimentalSettings;

        // add events [data-target]
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
                case 'multi-checkbox':
                    element.onclick = () => {
                        console.debug('multi-checkbox', element, (<HTMLInputElement>element).checked);

                        const setting: Settings = <Settings>element.getAttribute('data-setting');
                        const index = parseInt(element.getAttribute('data-index'));

                        let values: boolean[] = getSetting(setting);
                        values[index] = (<HTMLInputElement>element).checked;

                        setSetting(setting, values);
                    };
                    break;
                case 'select':
                    element.onchange = () => {
                        console.debug('select', element, (<HTMLSelectElement>element).selectedOptions[0]);

                        setSetting(<Settings>element.getAttribute('id'), (<HTMLSelectElement>element).selectedOptions[0].getAttribute('value') ?? 'USD');
                    };
                    break;
                case 'multi-input':
                    element.onchange = () => {
                        console.debug('multi-input', element, (<HTMLInputElement>element).value);

                        const setting: Settings = <Settings>element.getAttribute('data-setting');
                        const index = parseInt(element.getAttribute('data-index'));

                        let values: any[] = getSetting(setting);
                        values[index] = (<HTMLInputElement>element).value;

                        setSetting(setting, values);
                    };
                    break;
            }
        });

        // add events .setting-table button[data-reset]
        (<NodeListOf<HTMLElement>>document.querySelectorAll('.setting-table button[data-reset]')).forEach(element => {
            element.onclick = () => {
                resetSetting(<Settings>element.getAttribute('data-reset'));
            };
        });

        // add events .setting-description.action
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
