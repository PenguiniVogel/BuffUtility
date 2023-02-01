module Options {

    DEBUG && console.debug('[BuffUtility] Module.Options');

    // imports
    import Settings = ExtensionSettings.Settings;
    import resetSetting = ExtensionSettings.resetSetting;
    import setSetting = ExtensionSettings.setSetting;
    import getSetting = ExtensionSettings.getSetting;

    // module

    interface DisplayInfo {
        title: string,
        description: string,
        csgoOnly?: boolean,
        steamOnly?: boolean
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
                            content: [ info.title, info.csgoOnly ? ' <u style="color: var(--color-light);">(CS:GO Only)</u>' : '', info.steamOnly ? ' <u style="color: var(--color-steam);">(Steam Only)</u>' : '' ]
                        }),
                        Util.buildHTML('div', {
                            class: 'setting-description action',
                            content: [ `<span class="setting-description sym-expanded">►</span> Description</div>` ]
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
        });
    }

    function createInputOption(setting: Settings, info: DisplayInfo, type: string, value: any): string {
        return createSettingHTML(setting, info, Util.buildHTML('div', {
            class: 'label-over-input',
            content: [
                Util.buildHTML('label', {
                    attributes: {
                        'for': setting
                    },
                    content: [ 'Value:' ]
                }),
                Util.buildHTML('input', {
                    id: setting,
                    attributes: {
                        'type': type,
                        'data-target': 'input',
                        'value': `${value}`
                    }
                })
            ]
        }));
    }

    async function createCheckboxOption(setting: Settings, info: DisplayInfo): Promise<string> {
        return createSettingHTML(setting, info, Util.buildHTML('input', {
            id: setting,
            attributes: {
                'type': 'checkbox',
                'data-target': 'checkbox',
                [await getSetting(setting) ? 'checked' : 'no-checked']: ''
            }
        }));
    }

    function createSelectOption(setting: Settings, info: DisplayInfo, options: SelectOption[], selectedOption?: any): string {
        return createSettingHTML(setting, info, Util.buildHTML('select', {
            id: setting,
            attributes: {
                'data-target': 'select'
            },
            content: (options ?? []).map(option => `<option value="${option.value}" data-type="${(typeof option.value)}" ${(selectedOption == option.value) ? 'selected' : ''}>${option.displayText}</option>`)
        }));
    }

    async function createMultiCheckboxOption(setting: Settings, info: DisplayInfo, options: string[]): Promise<string> {
        const values: boolean[] = await getSetting(setting);

        return createSettingHTML(setting, info, Util.buildHTML('div', {
            id: setting,
            style: {
                'display': 'grid',
                'grid-template-columns': 'auto auto'
            },
            content: options.map((option, index) => Util.buildHTML('label', {
                attributes: {
                    'for': `${setting}-${index}`
                },
                style: {
                    'line-height': '25px',
                    'padding-right': '5px',
                    'border-bottom': '1px solid var(--color-light2-accent)'
                },
                content: [ option ]
            }) + Util.buildHTML('input', {
                id: `${setting}-${index}`,
                attributes: {
                    'type': 'checkbox',
                    'data-target': 'multi-checkbox',
                    'data-setting': setting,
                    'data-index': `${index}`,
                    [values[index] ? 'checked' : 'no-checked']: ''
                }
            }))
        }));
    }

    async function createMultiInputOption(setting: Settings, info: DisplayInfo, type: string, options: string[]): Promise<string> {
        const values: any[] = await getSetting(setting);

        return createSettingHTML(setting, info, Util.buildHTML('div', {
            id: setting,
            style: {
                'display': 'grid',
                'grid-template-columns': 'auto auto'
            },
            content: options.map((option, index) =>
                Util.buildHTML('label', {
                    attributes: {
                        'for': `${setting}-${index}`
                    },
                    style: {
                        'line-height': '25px',
                        'padding-right': '5px',
                        'border-bottom': '1px solid var(--color-light2-accent)'
                    },
                    content: [ option ]
                }) + Util.buildHTML('input', {
                    id: `${setting}-${index}`,
                    attributes: {
                        'type': type,
                        'data-target': 'multi-input',
                        'data-setting': setting,
                        'data-index': `${index}`,
                        'value': `${values[index]}`
                    }
                })
            )
        }));
    }

    async function init(): Promise<void> {
        let normalSettings: string = '';
        let advancedSettings: string = '';
        let experimentalSettings: string = '';
        let pseSettings: string = '';

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
        ], await getSetting(Settings.SELECTED_CURRENCY));

        // Settings.APPLY_CURRENCY_TO_DIFFERENCE
        normalSettings += await createCheckboxOption(Settings.APPLY_CURRENCY_TO_DIFFERENCE, {
            title: 'Apply Currency to difference',
            description: 'Whether to show the difference on the listing page in your selected currency or RMB.'
        });

        // Settings.CAN_EXPAND_SCREENSHOTS
        normalSettings += await createCheckboxOption(Settings.CAN_EXPAND_SCREENSHOTS, {
            title: 'Can expand preview',
            description: 'Can previews be expanded on sell listings. This only works if "Preview screenshots" is turned on and if the item has been inspected.',
            csgoOnly: true
        });

        // Settings.EXPAND_SCREENSHOTS_BACKDROP
        normalSettings += await createCheckboxOption(Settings.EXPAND_SCREENSHOTS_BACKDROP, {
            title: 'Expanded preview backdrop',
            description: 'Adds a transparent black backdrop to preview images to add some contrast.',
            csgoOnly: true
        });

        // Settings.APPLY_STEAM_TAX
        normalSettings += await createCheckboxOption(Settings.APPLY_STEAM_TAX, {
            title: 'Apply Steam Tax',
            description: 'Apply Steam Tax before calculating differences.<br/>This will calculate the steam seller price from the provided reference price.'
        });

        // Settings.SHOW_TOAST_ON_ACTION
        normalSettings += await createCheckboxOption(Settings.SHOW_TOAST_ON_ACTION, {
            title: 'Show Toast on action',
            description: 'If enabled, certain BuffUtility components will inform you via Buffs Toast system.'
        });

        // Settings.LISTING_OPTIONS
        normalSettings += await createMultiCheckboxOption(Settings.LISTING_OPTIONS, {
            title: 'Listing options',
            description: 'Define what options show up on each listing.<br/>3D Inspect: Buffs 3D Inspect.<br/>Inspect in server: Buffs inspect server.<br/>Copy !gen/!gengl: Quickly copy !gen codes.<br/>Share: Opens the share page.<br/>Match floatdb: Tries to find the skin on floatdb.<br/>Find Similar: Tries finding similar listings.<br/>Detail: A replacement button for the new detail UI.',
            csgoOnly: true
        }, [
            '3D Inspect',
            'Inspect in server',
            'Copy !gen/!gengl',
            'Share',
            'Match floatdb',
            'Find Similar',
            'Detail'
        ]);

        // Settings.SHOW_FLOAT_BAR
        normalSettings += await createCheckboxOption(Settings.SHOW_FLOAT_BAR, {
            title: 'Show float-bar',
            description: 'Show the float-bar buff has on the side, can be expanded back if hidden!'
        });

        // Settings.COLOR_LISTINGS
        normalSettings += await createMultiCheckboxOption(Settings.COLOR_LISTINGS, {
            title: 'Color purchase options',
            description: 'Color purchase options, this will paint purchase options red if not affordable with the current held balance.'
        }, [
            'Color Buy',
            'Color Bargain'
        ]);

        // Settings.USE_SCHEME
        normalSettings += await createCheckboxOption(Settings.USE_SCHEME, {
            title: 'Use Color Scheme',
            description: 'Use the defined color scheme (dark mode by default).'
        });

        // --- Advanced Settings ---

        // Settings.DIFFERENCE_DOMINATOR
        advancedSettings += createSelectOption(Settings.DIFFERENCE_DOMINATOR, {
            title: 'Difference Dominator',
            description: 'Specify the dominator meaning:<br>Steam: <code>(steam_price - buff_price) / steam_price</code><br>Buff: <code>(steam_price - buff_price) / buff_price</code><br>Unless you know the difference might not want to change this setting.<br>A short explanation being, if you buy from Buff and sell on Steam, you should choose "Buff".<br>If you buy from Steam, and sell on Buff, you should choose "Steam".'
        }, [
            {
                displayText: 'Steam',
                value: ExtensionSettings.DifferenceDominator.STEAM
            },
            {
                displayText: 'Buff',
                value: ExtensionSettings.DifferenceDominator.BUFF
            }
        ], await getSetting(Settings.DIFFERENCE_DOMINATOR));

        // Settings.DEFAULT_SORT_BY
        advancedSettings += createSelectOption(Settings.DEFAULT_SORT_BY, {
            title: 'Default sort by',
            description: 'Default sort by for item listings<br>Default: Default<br>Newest: Newest<br>Price Ascending: low to high<br>Price Descending: high to low<br>Float Ascending: low to high<br>Float Descending: high to low<br>Popular: by popularity.<br>Sticker: By Sticker price descending.',
            csgoOnly: true
        }, [
            {
                displayText: 'Default',
                value: ExtensionSettings.FILTER_SORT_BY.DEFAULT
            },
            {
                displayText: 'Newest',
                value: ExtensionSettings.FILTER_SORT_BY.NEWEST
            },
            {
                displayText: 'Price Ascending',
                value: ExtensionSettings.FILTER_SORT_BY.PRICE_ASCENDING
            },
            {
                displayText: 'Price Descending',
                value: ExtensionSettings.FILTER_SORT_BY.PRICE_DESCENDING
            },
            {
                displayText: 'Float Ascending',
                value: ExtensionSettings.FILTER_SORT_BY.FLOAT_ASCENDING
            },
            {
                displayText: 'Float Descending',
                value: ExtensionSettings.FILTER_SORT_BY.FLOAT_DESCENDING
            },
            {
                displayText: 'Popular',
                value: ExtensionSettings.FILTER_SORT_BY.HOT_DESCENDING
            },
            {
                displayText: 'Sticker',
                value: ExtensionSettings.FILTER_SORT_BY.STICKER
            }
        ], await getSetting(Settings.DEFAULT_SORT_BY));

        // Settings.DEFAULT_STICKER_SEARCH
        advancedSettings += createSelectOption(Settings.DEFAULT_STICKER_SEARCH, {
            title: 'Default sticker search',
            description: 'Search listings with sticker settings automatically.',
            csgoOnly: true
        }, [
            {
                displayText: 'All',
                value: ExtensionSettings.FILTER_STICKER_SEARCH.ALL
            },
            {
                displayText: 'Stickers',
                value: ExtensionSettings.FILTER_STICKER_SEARCH.STICKERS
            },
            {
                displayText: 'Stickers 100%',
                value: ExtensionSettings.FILTER_STICKER_SEARCH.STICKERS_100P
            },
            {
                displayText: 'No Stickers',
                value: ExtensionSettings.FILTER_STICKER_SEARCH.NO_STICKERS
            },
            {
                displayText: 'Quad Combos',
                value: ExtensionSettings.FILTER_STICKER_SEARCH.QUAD_COMBOS
            },
            {
                displayText: 'Quad Combos 100%',
                value: ExtensionSettings.FILTER_STICKER_SEARCH.QUAD_COMBOS_100P
            },
            {
                displayText: 'Save Custom',
                value: ExtensionSettings.FILTER_STICKER_SEARCH.SAVE_CUSTOM
            }
        ], await getSetting(Settings.DEFAULT_STICKER_SEARCH));

        // Settings.EXPAND_TYPE
        advancedSettings += createSelectOption(Settings.EXPAND_TYPE, {
            title: 'Expand preview type',
            description: 'Either expand into a zoomed preview image or expand into the inspect image.',
            csgoOnly: true
        }, [
            {
                displayText: 'Preview',
                value: ExtensionSettings.ExpandScreenshotType.PREVIEW
            },
            {
                displayText: 'Inspect',
                value: ExtensionSettings.ExpandScreenshotType.INSPECT
            }
        ], await getSetting(Settings.EXPAND_TYPE));

        // Settings.CUSTOM_FOP
        advancedSettings += createSelectOption(Settings.CUSTOM_FOP, {
            title: 'Custom Preview resolution',
            description: 'Set the resolution of preview images. You should <b>not</b> change this from <b>Auto</b> unless you have slow internet, then you should choose one of the lower values (e.g. 245, 490 or 980).',
            csgoOnly: true
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
        ], await getSetting(Settings.CUSTOM_FOP));

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
        ], await getSetting(Settings.LOCATION_RELOAD_NEWEST));

        // Settings.CUSTOM_CURRENCY_RATE
        advancedSettings += createInputOption(Settings.CUSTOM_CURRENCY_RATE, {
            title: 'Custom currency rate',
            description: 'Set the rate of the custom currency e.g.<br>10 RMB -> 1 CC<br>Only active if "Custom" was selected in the "Display Currency" option.'
        }, 'number', await getSetting(Settings.CUSTOM_CURRENCY_RATE));

        // Settings.CUSTOM_CURRENCY_NAME
        advancedSettings += createInputOption(Settings.CUSTOM_CURRENCY_NAME, {
            title: 'Custom currency name',
            description: 'Set the name of the custom currency.<br>Only active if "Custom" was selected in the "Display Currency" option.'
        }, 'text', await getSetting(Settings.CUSTOM_CURRENCY_NAME));

        // Settings.DATA_PROTECTION
        advancedSettings += await createCheckboxOption(Settings.DATA_PROTECTION, {
            title: 'Data protection',
            description: 'Blur some settings on the account page to protect yourself.'
        });

        // Settings.COLOR_SCHEME
        advancedSettings += await createMultiInputOption(Settings.COLOR_SCHEME, {
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
        experimentalSettings += await createCheckboxOption(Settings.EXPERIMENTAL_ALLOW_FAVOURITE_BARGAIN, {
            title: 'Favourite Bargain',
            description: '<u><b>BuffUtility<br>Experimental<br></b></u>Show the "Bargain" feature on favourites.<br><small>* Setting will be moved with 2.2.0 to advanced settings.</small>'
        });

        // Settings.EXPERIMENTAL_ADJUST_POPULAR
        experimentalSettings += await createCheckboxOption(Settings.EXPERIMENTAL_ADJUST_POPULAR, {
            title: 'Adjust Popular Tab',
            description: '<u><b>BuffUtility<br>Experimental<br></b></u>Adjust the "Popular" tab in the market page, adding some features.<br><small>* Setting will be removed with 2.2.0 and become default.</small>',
            csgoOnly: true
        });

        // Settings.EXPERIMENTAL_FETCH_NOTIFICATION
        experimentalSettings += await createCheckboxOption(Settings.EXPERIMENTAL_FETCH_NOTIFICATION, {
            title: 'Currency Fetch Notification',
            description: '<u><b>BuffUtility<br>Experimental<br></b></u>Show toast notification when currency rates were updated, happens once a day.<br><small>* Setting will be merged in 2.2.0 into "Show Toast on Action".</small>'
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
        experimentalSettings += await createCheckboxOption(Settings.EXPERIMENTAL_ADJUST_MARKET_CURRENCY, {
            title: 'Adjust Market Currency',
            description: '<u><b>BuffUtility<br>Experimental<br></b></u>Adjust shown market currency to selected currency.<br><small>* Setting will be moved with 2.2.0 to advanced settings.</small>'
        });

        // Settings.EXPERIMENTAL_FORMAT_CURRENCY
        experimentalSettings += await createCheckboxOption(Settings.EXPERIMENTAL_FORMAT_CURRENCY, {
            title: 'Format Currency',
            description: '<u><b>BuffUtility<br>Experimental<br></b></u>If set, will format numbers.<br>e.g. given 1234.56 will turn into 1,234.56'
        });

        // Settings.EXPERIMENTAL_ADJUST_SHOP
        experimentalSettings += await createCheckboxOption(Settings.EXPERIMENTAL_ADJUST_SHOP, {
            title: 'Adjust Shop Pages',
            description: '<u><b>BuffUtility<br>Experimental<br></b></u>Adjust the "Shop" pages. This adds features such as the share link and !gen/!gengl.<br><small>* Setting will be removed with 2.2.0 and become default behaviour.</small>',
            csgoOnly: true
        });

        // Settings.EXPERIMENTAL_ADJUST_SHARE
        experimentalSettings += await createCheckboxOption(Settings.EXPERIMENTAL_ADJUST_SHARE, {
            title: 'Adjust Share Pages',
            description: '<u><b>BuffUtility<br>Experimental<br></b></u>Adjust the "Share" pages. This adds the ability to find the listing directly from the share link.<br><small>* Setting will be moved with 2.2.0 to advanced settings.</small>',
            csgoOnly: true
        });

        // Settings.EXPERIMENTAL_ALLOW_BULK_BUY
        experimentalSettings += await createCheckboxOption(Settings.EXPERIMENTAL_ALLOW_BULK_BUY, {
            title: 'Allow bulk buy',
            description: '<u><b>BuffUtility<br>Experimental<br></b></u>Allow the bulk buy function to be used on the web version of Buff.<br><small>* Setting will be moved with 2.2.0 to advanced settings.</small>'
        });

        // Settings.EXPERIMENTAL_AUTOMATIC_BARGAIN
        experimentalSettings += await createCheckboxOption(Settings.EXPERIMENTAL_AUTOMATIC_BARGAIN, {
            title: 'Bargain Calculator',
            description: 'Gives you the ability to quickly bargain by doing the math for you.<br><code>&gt; minimum + ( ( listing - minimum ) * percentage )</code> is used to calculate the bargain price.'
        });

        experimentalSettings += createInputOption(Settings.EXPERIMENTAL_AUTOMATIC_BARGAIN_DEFAULT, {
            title: 'Bargain Calculator Default',
            description: 'Sets the default percentage value.<br>Allowed range is 1 to 99.<br>While you can set it outside the range, the value will be clamped between 1 and 99.'
        }, 'number', await getSetting(Settings.EXPERIMENTAL_AUTOMATIC_BARGAIN_DEFAULT));

        // Settings.EXPERIMENTAL_SHOW_LISTING_DATE
        experimentalSettings += await createCheckboxOption(Settings.EXPERIMENTAL_SHOW_LISTING_DATE, {
            title: 'Show Listing Date',
            description: '<u><b>BuffUtility<br>Experimental<br></b></u>Show an item\'s listing date in the market page.<br>Time zone differences are already considered and rounded towards full hours.'
        });

        // Settings.EXPERIMENTAL_ADJUST_TRADE_RECORDS
        experimentalSettings += await createCheckboxOption(Settings.EXPERIMENTAL_ADJUST_TRADE_RECORDS, {
            title: 'Adjust Trade Records',
            description: '<u><b>BuffUtility<br>Experimental<br></b></u>Adjust the "Trade Records" tab for an items page, showing things such as currency conversion, and difference to reference price.'
        });

        // Settings.EXPERIMENTAL_REMOVE_SALE_POPUP
        experimentalSettings += await createCheckboxOption(Settings.EXPERIMENTAL_REMOVE_SALE_POPUP, {
            title: 'Remove Sale Popup',
            description: 'The new Buff sale ui annoying you when you are trying to copy the price or other data? This removes the click events and prevents it from opening normally.',
            csgoOnly: true
        });

        // --- PSE Settings ---

        // Settings.PSE_ADVANCED_PAGE_NAVIGATION
        pseSettings += await createCheckboxOption(Settings.PSE_ADVANCED_PAGE_NAVIGATION, {
            title: 'History Page Navigation',
            description: 'Have many thousands of pages in your Market History? Ever wish you could jump to page 100? With this setting you can.',
            steamOnly: true
        });

        // Settings.PSE_ADVANCED_PAGE_NAVIGATION_SIZE
        pseSettings += createSelectOption(Settings.PSE_ADVANCED_PAGE_NAVIGATION_SIZE, {
            title: 'History Page Navigation Size',
            description: 'Wan\'t more than 10 items per page? Like on the sell order, this setting makes 10, 30 and 100 items per page available.',
            steamOnly: true
        }, [
            {
                displayText: '10',
                value: 10
            },
            {
                displayText: '30',
                value: 30
            },
            {
                displayText: '100',
                value: 100
            }
        ], await getSetting(Settings.PSE_ADVANCED_PAGE_NAVIGATION_SIZE));

        // Settings.PSE_CALCULATE_BUYORDER_SUMMARY
        pseSettings += await createCheckboxOption(Settings.PSE_CALCULATE_BUYORDER_SUMMARY, {
            title: 'Calculate BuyOrder Summary',
            description: 'Shows the buy order summary, total per buy order, max buy order you can place, and how much has been placed.',
            steamOnly: true
        });

        // Settings.PSE_BUYORDER_CANCEL_CONFIRMATION
        pseSettings += await createCheckboxOption(Settings.PSE_BUYORDER_CANCEL_CONFIRMATION, {
            title: 'BuyOrder Cancel Confirmation',
            description: 'Hate accidentally cancelling a buy order? Well no more! Now you get asked... once.',
            steamOnly: true
        });

        // Settings.PSE_BUYORDER_SCROLLING
        pseSettings += await createCheckboxOption(Settings.PSE_BUYORDER_SCROLLING, {
            title: 'BuyOrder Scrolling',
            description: 'Hate how it takes up the whole page? Now the content height gets reduced to 50vh, and a scrollbar shows instead. This also adds a search field next to the Name header to quickly look for buy-orders.',
            steamOnly: true
        });

        // Settings.PSE_GRAPH_SHOW_YEARS
        pseSettings += await createCheckboxOption(Settings.PSE_GRAPH_SHOW_YEARS, {
            title: 'Steam Graph - Show Years',
            description: 'Display the year in the Steam Median Sales graph.',
            steamOnly: true
        });

        // Settings.PSE_GRAPH_SHOW_VOLUME
        pseSettings += await createCheckboxOption(Settings.PSE_GRAPH_SHOW_VOLUME, {
            title: 'Steam Graph - Show Volume',
            description: 'Display the volume as additional series in the Steam Median Sales graph.',
            steamOnly: true
        });

        // Settings.PSE_FORCE_ITEM_ACTIVITY TODO
        // pseSettings += await createCheckboxOption(Settings.PSE_FORCE_ITEM_ACTIVITY, {
        //     title: 'Force Item Activity',
        //     description: ''
        // });

        // Settings.PSE_ADD_VIEW_ON_BUFF
        pseSettings += await createCheckboxOption(Settings.PSE_ADD_VIEW_ON_BUFF, {
            title: 'Add "View on Buff"',
            description: 'Add a quick button to open the buff.163 sale page for the specified item.',
            csgoOnly: true,
            steamOnly: true
        });

        // Settings.PSE_HIDE_ACCOUNT_DETAILS TODO
        // pseSettings += await createCheckboxOption(Settings.PSE_HIDE_ACCOUNT_DETAILS, {
        //     title: 'Hide Account Details',
        //     description: ''
        // });

        // Settings.PSE_MERGE_ACTIVE_LISTINGS
        pseSettings += await createCheckboxOption(Settings.PSE_MERGE_ACTIVE_LISTINGS, {
            title: 'Merge Active Listings',
            description: '',
            steamOnly: true
        });

        // append html
        document.querySelector('#settings-normal tbody').innerHTML = normalSettings;
        document.querySelector('#settings-advanced tbody').innerHTML = advancedSettings;
        document.querySelector('#settings-experimental tbody').innerHTML = experimentalSettings;
        document.querySelector('#settings-pse tbody').innerHTML = pseSettings;

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
                    element.onclick = async () => {
                        console.debug('multi-checkbox', element, (<HTMLInputElement>element).checked);

                        const setting: Settings = <Settings>element.getAttribute('data-setting');
                        const index = parseInt(element.getAttribute('data-index'));

                        let values: boolean[] = await getSetting(setting);
                        values[index] = (<HTMLInputElement>element).checked;

                        setSetting(setting, values);
                    };
                    break;
                case 'select':
                    element.onchange = () => {
                        const id = <Settings>element.getAttribute('id');
                        const selectedOptions = <HTMLCollectionOf<HTMLOptionElement>>((<HTMLSelectElement>element).selectedOptions ?? []);
                        const selectedOption = selectedOptions[0];
                        
                        console.debug('select', element, selectedOption);

                        if (selectedOption) {
                            const value = selectedOption.getAttribute('value');
                            const type = selectedOption.getAttribute('data-type');

                            switch (type) {
                                case 'number':
                                    setSetting(id, parseFloat(value));
                                    break;
                                default:
                                    setSetting(id, value);
                                    break;
                            }
                        }
                    };
                    break;
                case 'multi-input':
                    element.onchange = async () => {
                        console.debug('multi-input', element, (<HTMLInputElement>element).value);

                        const setting: Settings = <Settings>element.getAttribute('data-setting');
                        const index = parseInt(element.getAttribute('data-index'));

                        let values: any[] = await getSetting(setting);
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

        // add events [data-page]
        (<NodeListOf<HTMLElement>>document.querySelectorAll('[data-page]')).forEach(element => {
            element.onclick = () => {
                let selfPage = element.getAttribute('data-page');
                (<NodeListOf<HTMLElement>>document.querySelectorAll('[data-page]')).forEach(_page => {
                    let isSelf = selfPage == _page.getAttribute('data-page');

                    _page.setAttribute('class', isSelf ? 'active' : '');
                    document.querySelector(`#page-${_page.getAttribute('data-page')}`).setAttribute('style', isSelf ? '' : 'display: none;');
                });
            };
        });

        // add event reset-all
        document.querySelector('#reset-all').addEventListener('click', async () => {
            if (confirm('This will reset ALL settings to their default value and cannot be undone.')) {
                await ExtensionSettings.resetAllSettings();
                alert('Please refresh the options to see the changes.');
            }
        });
    }

    init();

}
