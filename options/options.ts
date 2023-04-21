module Options {

    DEBUG && console.debug('[BuffUtility] Module.Options');

    // imports
    import Settings = ExtensionSettings.Settings;
    import resetSetting = ExtensionSettings.resetSetting;
    import setSetting = ExtensionSettings.setSetting;
    import getSetting = ExtensionSettings.getSetting;

    // module

    const VERSION: number = 223;

    const enum SettingsCategory {
        NORMAL,
        ADVANCED,
        PSE,
        MODULE
    }

    interface DisplayInfo {
        title: string,
        description: string,
        tags?: {
            isExperimental?: boolean,
            csgoOnly?: boolean,
            steamOnly?: boolean,
            requiresRequest?: boolean,
            isModule?: boolean
        }
    }

    interface SelectOption {
        displayText: string,
        value: any
    }

    function createSettingHTML(setting: Settings, info: DisplayInfo, settingHTML: string): string {
        function translateExperimental(tags: DisplayInfo['tags'] = {}): string {
            if (tags.isExperimental) {
                return `<div style="padding: 2px; border: 1px solid #fffdfd; color: #fffdfd; background: #306eb6; display: inline-block; width: 17px; text-align: center; margin-right: 3px;" title="BuffUtility Experimental Setting! May have bugs or other issues!">E</div>`;
            }

            return '';
        }

        function translateTags(tags: DisplayInfo['tags'] = {}): string {
            let tagString = '';

            if (tags.csgoOnly) {
                tagString += ' <u style="color: var(--color-light);">(CS:GO Only)</u>';
            }

            if (tags.steamOnly) {
                tagString += ' <u style="color: var(--color-steam);">(Steam Only)</u>';
            }

            if (tags.requiresRequest) {
                tagString += ' <u style="color: #b91010;" title="This feature is a REQUIRE REQUEST feature, use with caution.">(RR ⚠)</u>';
            }

            if (tags.isModule) {
                tagString += ' <u style="color: #fffdfd; background: #006447; padding: 1px; border: 1px solid #eee;">Module</u>';
            }

            return tagString;
        }
        
        return Util.buildHTML('tr', {
            content: [
                Util.buildHTML('td', {
                    content: [
                        Util.buildHTML('div', {
                            class: 'setting-title',
                            content: [ translateExperimental(info.tags), info.title, translateTags(info.tags) ]
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

    function createButtonOption(setting: Settings, info: DisplayInfo, handler: string): string {
        return createSettingHTML(setting, info, Util.buildHTML('button', {
            attributes: {
                'data-target': 'button',
                'data-setting': setting,
                'data-handler': handler
            },
            content: [ 'Activate' ]
        }));
    }

    async function init(): Promise<void> {
        let normalSettings: string = '';
        let experimentalSettings: string = '';
        let pseSettings: string = '';
        let modulesSettings: string = '';

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

        normalSettings += createSelectOption(Settings.LISTING_DIFFERENCE_STYLE, {
            title: 'Listing Difference Style',
            description: 'Change the difference style'
        }, [
            {
                displayText: 'None',
                value: ExtensionSettings.ListingDifferenceStyle.NONE
            },
            {
                displayText: `${GlobalConstants.SYMBOL_YUAN} Difference`,
                value: ExtensionSettings.ListingDifferenceStyle.CURRENCY_DIFFERENCE
            },
            {
                displayText: 'Converted Difference',
                value: ExtensionSettings.ListingDifferenceStyle.CONVERTED_CURRENCY_DIFFERENCE
            },
            {
                displayText: '% Difference',
                value: ExtensionSettings.ListingDifferenceStyle.PERCENTAGE_DIFFERENCE
            },
        ], await getSetting(Settings.LISTING_DIFFERENCE_STYLE));

        // Settings.CAN_EXPAND_SCREENSHOTS
        normalSettings += await createCheckboxOption(Settings.CAN_EXPAND_SCREENSHOTS, {
            title: 'Can expand preview',
            description: 'Can previews be expanded on sell listings. This only works if "Preview screenshots" is turned on and if the item has been inspected.',
            tags: {
                csgoOnly: true
            }
        });

        // Settings.EXPAND_SCREENSHOTS_BACKDROP
        normalSettings += await createCheckboxOption(Settings.EXPAND_SCREENSHOTS_BACKDROP, {
            title: 'Expanded preview backdrop',
            description: 'Adds a transparent black backdrop to preview images to add some contrast.',
            tags: {
                csgoOnly: true
            }
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
            tags: {
                csgoOnly: true
            }
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

        // Settings.DIFFERENCE_DOMINATOR
        normalSettings += createSelectOption(Settings.DIFFERENCE_DOMINATOR, {
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
        normalSettings += createSelectOption(Settings.DEFAULT_SORT_BY, {
            title: 'Default sort by',
            description: 'Default sort by for item listings<br>Default: Default<br>Newest: Newest<br>Price Ascending: low to high<br>Price Descending: high to low<br>Float Ascending: low to high<br>Float Descending: high to low<br>Popular: by popularity.<br>Sticker: By Sticker price descending.',
            tags: {
                csgoOnly: true
            }
        }, [
            {
                displayText: 'Default',
                value: ExtensionSettings.FilterSortBy.DEFAULT
            },
            {
                displayText: 'Latest',
                value: ExtensionSettings.FilterSortBy.LATEST
            },
            {
                displayText: 'Price Ascending',
                value: ExtensionSettings.FilterSortBy.PRICE_ASCENDING
            },
            {
                displayText: 'Price Descending',
                value: ExtensionSettings.FilterSortBy.PRICE_DESCENDING
            },
            {
                displayText: 'Float Ascending',
                value: ExtensionSettings.FilterSortBy.FLOAT_ASCENDING
            },
            {
                displayText: 'Float Descending',
                value: ExtensionSettings.FilterSortBy.FLOAT_DESCENDING
            },
            {
                displayText: 'Popular',
                value: ExtensionSettings.FilterSortBy.HOT_DESCENDING
            },
            {
                displayText: 'Sticker',
                value: ExtensionSettings.FilterSortBy.STICKER
            },
            {
                displayText: 'Time Cost Ascending',
                value: ExtensionSettings.FilterSortBy.TIME_COST
            }
        ], await getSetting(Settings.DEFAULT_SORT_BY));

        // Settings.DEFAULT_STICKER_SEARCH
        normalSettings += createSelectOption(Settings.DEFAULT_STICKER_SEARCH, {
            title: 'Default sticker search',
            description: 'Search listings with sticker settings automatically.',
            tags: {
                csgoOnly: true
            }
        }, [
            {
                displayText: 'All',
                value: ExtensionSettings.FilterStickerSearch.ALL
            },
            {
                displayText: 'Stickers',
                value: ExtensionSettings.FilterStickerSearch.STICKERS
            },
            {
                displayText: 'Stickers 100%',
                value: ExtensionSettings.FilterStickerSearch.STICKERS_100P
            },
            {
                displayText: 'No Stickers',
                value: ExtensionSettings.FilterStickerSearch.NO_STICKERS
            },
            {
                displayText: 'Quad Combos',
                value: ExtensionSettings.FilterStickerSearch.QUAD_COMBOS
            },
            {
                displayText: 'Quad Combos 100%',
                value: ExtensionSettings.FilterStickerSearch.QUAD_COMBOS_100P
            },
            {
                displayText: 'Save Custom',
                value: ExtensionSettings.FilterStickerSearch.SAVE_CUSTOM
            }
        ], await getSetting(Settings.DEFAULT_STICKER_SEARCH));

        // Settings.EXPAND_TYPE
        normalSettings += createSelectOption(Settings.EXPAND_TYPE, {
            title: 'Expand preview type',
            description: 'Either expand into a zoomed preview image or expand into the inspect image.',
            tags: {
                csgoOnly: true
            }
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
        normalSettings += createSelectOption(Settings.CUSTOM_FOP, {
            title: 'Custom Preview resolution',
            description: 'Set the resolution of preview images. You should <b>not</b> change this from <b>Auto</b> unless you have slow internet, then you should choose one of the lower values (e.g. 245, 490 or 980).',
            tags: {
                csgoOnly: true
            }
        }, [
            {
                displayText: 'Auto',
                value: ExtensionSettings.FopValues.Auto
            },
            {
                displayText: 'w245/h230',
                value: ExtensionSettings.FopValues.w245xh230
            },
            {
                displayText: 'w490/h460',
                value: ExtensionSettings.FopValues.w490xh460
            },
            {
                displayText: 'w980/h920',
                value: ExtensionSettings.FopValues.w980xh920
            },
            {
                displayText: 'w1960/h1840',
                value: ExtensionSettings.FopValues.w1960xh1840
            },
            {
                displayText: 'w3920/h3680',
                value: ExtensionSettings.FopValues.w3920xh3680
            }
        ], await getSetting(Settings.CUSTOM_FOP));

        // Settings.LOCATION_RELOAD_NEWEST
        normalSettings += createSelectOption(Settings.LOCATION_RELOAD_NEWEST, {
            title: 'Location Reload Newest',
            description: 'Sets the location of the forced newest reload.<br>None: Don\'t show<br>Bulk: Next to "Bulk Buy"<br>Sort: Next to sorting<br>Center: In the center<br>Left: Left most position.'
        }, [
            {
                displayText: 'None',
                value: ExtensionSettings.ReloadNewestLocation.NONE
            },
            {
                displayText: 'Bulk',
                value: ExtensionSettings.ReloadNewestLocation.BULK
            },
            {
                displayText: 'Sort',
                value: ExtensionSettings.ReloadNewestLocation.SORT
            },
            {
                displayText: 'Center',
                value: ExtensionSettings.ReloadNewestLocation.CENTER
            },
            {
                displayText: 'Left',
                value: ExtensionSettings.ReloadNewestLocation.LEFT
            }
        ], await getSetting(Settings.LOCATION_RELOAD_NEWEST));

        // Settings.CUSTOM_CURRENCY_RATE
        normalSettings += createInputOption(Settings.CUSTOM_CURRENCY_RATE, {
            title: 'Custom currency rate',
            description: 'Set the rate of the custom currency e.g.<br>10 RMB -> 1 CC<br>Only active if "Custom" was selected in the "Display Currency" option.'
        }, 'number', await getSetting(Settings.CUSTOM_CURRENCY_RATE));

        // Settings.CUSTOM_CURRENCY_NAME
        normalSettings += createInputOption(Settings.CUSTOM_CURRENCY_NAME, {
            title: 'Custom currency name',
            description: 'Set the name of the custom currency.<br>Only active if "Custom" was selected in the "Display Currency" option.'
        }, 'text', await getSetting(Settings.CUSTOM_CURRENCY_NAME));

        // Settings.DATA_PROTECTION
        normalSettings += await createCheckboxOption(Settings.DATA_PROTECTION, {
            title: 'Data protection',
            description: 'Blur some settings on the account page to protect yourself.'
        });

        // Settings.COLOR_SCHEME
        normalSettings += await createMultiInputOption(Settings.COLOR_SCHEME, {
            title: 'Color Scheme',
            description: 'Color Scheme for whatever theme you want (Dark-Theme by default)'
        }, 'color', [
            'Background',
            'Background Hover',
            'Text Color',
            'Text Color Disabled'
        ]);

        // Settings.ALLOW_EXTENSION_REQUESTS
        if (!await getSetting(Settings.ALLOW_EXTENSION_REQUESTS)) {
            normalSettings += createButtonOption(Settings.ALLOW_EXTENSION_REQUESTS, {
                title: 'Allow Extension Requests',
                description: 'Allow BuffUtility to make Buff requests within its context.<br>This is potentially very dangerous, so unless there is a reason, and you are aware of the consequences: <b>DO NOT ENABLE THIS</b>'
            }, 'sendAllowExtensionRequests');
        }

        // --- Experimental Settings ---

        // Settings.EXPERIMENTAL_ALLOW_FAVOURITE_BARGAIN
        experimentalSettings += await createCheckboxOption(Settings.EXPERIMENTAL_ALLOW_FAVOURITE_BARGAIN, {
            title: 'Favourite Bargain',
            description: 'Show the "Bargain" feature on favourites.',
            tags: {
                isExperimental: true
            }
        });

        // Settings.EXPERIMENTAL_ADJUST_POPULAR
        experimentalSettings += await createCheckboxOption(Settings.EXPERIMENTAL_ADJUST_POPULAR, {
            title: 'Adjust Popular Tab',
            description: 'Adjust the "Popular" tab in the market page, adding some features.<br><small>* Setting will be removed and become default eventually.</small>',
            tags: {
                isExperimental: true,
                csgoOnly: true
            }
        });

        // Settings.EXPERIMENTAL_FETCH_NOTIFICATION
        experimentalSettings += await createCheckboxOption(Settings.EXPERIMENTAL_FETCH_NOTIFICATION, {
            title: 'Currency Fetch Notification',
            description: 'Show toast notification when currency rates were updated, happens once a day.<br><small>* Setting will be merged into "Show Toast on Action" eventually.</small>',
            tags: {
                isExperimental: true
            }
        });

        // Settings.EXPERIMENTAL_FETCH_FAVOURITE_BARGAIN_STATUS
        if (await getSetting(Settings.ALLOW_EXTENSION_REQUESTS)) {
            experimentalSettings += await createCheckboxOption(Settings.EXPERIMENTAL_FETCH_FAVOURITE_BARGAIN_STATUS, {
                title: 'Fetch Favourite Bargain Status',
                description: 'This will check the bargain status on favourites, to adjust the buttons accordingly, HOWEVER this is somewhat dangerous, as it will push API requests that are normally uncommon, use with caution. Setting will stay experimental until a better alternative is possibly discovered.',
                tags: {
                    isExperimental: true,
                    requiresRequest: true
                }
            });
        }

        // Settings.EXPERIMENTAL_FETCH_ITEM_PRICE_HISTORY
        if (await getSetting(Settings.ALLOW_EXTENSION_REQUESTS)) {
            experimentalSettings += createSelectOption(Settings.EXPERIMENTAL_FETCH_ITEM_PRICE_HISTORY, {
                title: 'Fetch item price history',
                description: 'This will add a price history to the header of item pages, HOWEVER this is somewhat dangerous, as it will push API requests that are normally uncommon, use with caution. Setting will stay experimental until a better alternative is possibly discovered.',
                tags: {
                    isExperimental: true,
                    requiresRequest: true
                }
            }, [
                {
                    displayText: 'Off',
                    value: ExtensionSettings.PriceHistoryRange.OFF
                },
                {
                    displayText: '7 Days',
                    value: ExtensionSettings.PriceHistoryRange.WEEKLY
                },
                {
                    displayText: '30 Days',
                    value: ExtensionSettings.PriceHistoryRange.MONTHLY
                }
            ], await ExtensionSettings.getRequestSetting(Settings.EXPERIMENTAL_FETCH_ITEM_PRICE_HISTORY));
        }

        // Settings.EXPERIMENTAL_ADJUST_MARKET_CURRENCY
        experimentalSettings += await createCheckboxOption(Settings.EXPERIMENTAL_ADJUST_MARKET_CURRENCY, {
            title: 'Adjust Market Currency',
            description: 'Adjust shown market currency to selected currency.',
            tags: {
                isExperimental: true
            }
        });

        // Settings.EXPERIMENTAL_FORMAT_CURRENCY
        experimentalSettings += await createCheckboxOption(Settings.EXPERIMENTAL_FORMAT_CURRENCY, {
            title: 'Format Currency',
            description: 'If set, will format numbers.<br>e.g. given 1234.56 will turn into 1,234.56',
            tags: {
                isExperimental: true
            }
        });

        // Settings.EXPERIMENTAL_ADJUST_SHOP
        experimentalSettings += await createCheckboxOption(Settings.EXPERIMENTAL_ADJUST_SHOP, {
            title: 'Adjust Shop Pages',
            description: 'Adjust the "Shop" pages. This adds features such as the share link and !gen/!gengl.<br><small>* Setting will be removed with and become default eventually.</small>',
            tags: {
                isExperimental: true,
                csgoOnly: true
            }
        });

        // Settings.EXPERIMENTAL_ADJUST_SHARE
        experimentalSettings += await createCheckboxOption(Settings.EXPERIMENTAL_ADJUST_SHARE, {
            title: 'Adjust Share Pages',
            description: 'Adjust the "Share" pages. This adds the ability to find the listing directly from the share link.',
            tags: {
                isExperimental: true,
                csgoOnly: true
            }
        });

        // Settings.EXPERIMENTAL_ALLOW_BULK_BUY
        experimentalSettings += await createCheckboxOption(Settings.EXPERIMENTAL_ALLOW_BULK_BUY, {
            title: 'Allow bulk buy',
            description: 'Allow the bulk buy function to be used on the web version of Buff',
            tags: {
                isExperimental: true
            }
        });

        // Settings.EXPERIMENTAL_AUTOMATIC_BARGAIN
        experimentalSettings += await createCheckboxOption(Settings.EXPERIMENTAL_AUTOMATIC_BARGAIN, {
            title: 'Bargain Calculator',
            description: 'Gives you the ability to quickly bargain by doing the math for you.<br><code>&gt; minimum + ( ( listing - minimum ) * percentage )</code> is used to calculate the bargain price.',
            tags: {
                isExperimental: true
            }
        });

        experimentalSettings += createInputOption(Settings.EXPERIMENTAL_AUTOMATIC_BARGAIN_DEFAULT, {
            title: 'Bargain Calculator Default',
            description: 'Sets the default percentage value.<br>Allowed range is 1 to 99.<br>While you can set it outside the range, the value will be clamped between 1 and 99.',
            tags: {
                isExperimental: true
            }
        }, 'number', await getSetting(Settings.EXPERIMENTAL_AUTOMATIC_BARGAIN_DEFAULT));

        // Settings.EXPERIMENTAL_SHOW_LISTING_DATE
        experimentalSettings += await createCheckboxOption(Settings.EXPERIMENTAL_SHOW_LISTING_DATE, {
            title: 'Show Listing Date',
            description: 'Show an item\'s listing date in the market page.<br>Time zone differences are already considered and rounded towards full hours.',
            tags: {
                isExperimental: true
            }
        });

        // Settings.EXPERIMENTAL_ADJUST_TRADE_RECORDS
        experimentalSettings += await createCheckboxOption(Settings.EXPERIMENTAL_ADJUST_TRADE_RECORDS, {
            title: 'Adjust Trade Records',
            description: 'Adjust the "Trade Records" tab for an items page, showing things such as currency conversion, and difference to reference price.',
            tags: {
                isExperimental: true
            }
        });

        // Settings.EXPERIMENTAL_SHOW_SOUVENIR_TEAMS
        experimentalSettings += await createCheckboxOption(Settings.EXPERIMENTAL_SHOW_SOUVENIR_TEAMS, {
            title: 'Show Souvenir Teams',
            description: 'Utilize the attributes field in market listings and favorites to display the teams of a souvenir package.',
            tags: {
                isExperimental: true
            }
        });

        // --- PSE Settings ---

        // Settings.PSE_ADVANCED_PAGE_NAVIGATION
        pseSettings += await createCheckboxOption(Settings.PSE_ADVANCED_PAGE_NAVIGATION, {
            title: 'History Page Navigation',
            description: 'Have many thousands of pages in your Market History? Ever wish you could jump to page 100? With this setting you can.',
            tags: {
                steamOnly: true
            }
        });

        // Settings.PSE_ADVANCED_PAGE_NAVIGATION_SIZE
        pseSettings += createSelectOption(Settings.PSE_ADVANCED_PAGE_NAVIGATION_SIZE, {
            title: 'History Page Navigation Size',
            description: 'Wan\'t more than 10 items per page? Like on the sell order, this setting makes 10, 30 and 100 items per page available.',
            tags: {
                steamOnly: true
            }
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
            tags: {
                steamOnly: true
            }
        });

        // Settings.PSE_BUYORDER_CANCEL_CONFIRMATION
        pseSettings += await createCheckboxOption(Settings.PSE_BUYORDER_CANCEL_CONFIRMATION, {
            title: 'BuyOrder Cancel Confirmation',
            description: 'Hate accidentally cancelling a buy order? Well no more! Now you get asked... once.',
            tags: {
                steamOnly: true
            }
        });

        // Settings.PSE_BUYORDER_SCROLLING
        pseSettings += await createCheckboxOption(Settings.PSE_BUYORDER_SCROLLING, {
            title: 'BuyOrder Scrolling',
            description: 'Hate how it takes up the whole page? Now the content height gets reduced to 50vh, and a scrollbar shows instead. This also adds a search field next to the Name header to quickly look for buy-orders.',
            tags: {
                steamOnly: true
            }
        });

        // Settings.PSE_GRAPH_SHOW_YEARS
        pseSettings += await createCheckboxOption(Settings.PSE_GRAPH_SHOW_YEARS, {
            title: 'Steam Graph - Show Years',
            description: 'Display the year in the Steam Median Sales graph.',
            tags: {
                steamOnly: true
            }
        });

        // Settings.PSE_GRAPH_SHOW_VOLUME
        pseSettings += await createCheckboxOption(Settings.PSE_GRAPH_SHOW_VOLUME, {
            title: 'Steam Graph - Show Volume',
            description: 'Display the volume as additional series in the Steam Median Sales graph.',
            tags: {
                steamOnly: true
            }
        });

        // Settings.PSE_GRAPH_CUMULATE_RECENT
        pseSettings += await createCheckboxOption(Settings.PSE_GRAPH_CUMULATE_RECENT, {
            title: 'Steam Graph - Cumulate Recent Volume',
            description: 'Instead of displaying the recent days volume hourly, it cumulates it together like other days.',
            tags: {
                steamOnly: true
            }
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
            tags: {
                csgoOnly: true,
                steamOnly: true
            }
        });

        // Settings.PSE_HIDE_ACCOUNT_DETAILS
        pseSettings += await createCheckboxOption(Settings.PSE_HIDE_ACCOUNT_DETAILS, {
            title: 'Hide Account Details',
            description: 'Blurs the billing information panel.',
            tags: {
                steamOnly: true
            }
        });

        // Settings.PSE_MERGE_ACTIVE_LISTINGS
        pseSettings += await createCheckboxOption(Settings.PSE_MERGE_ACTIVE_LISTINGS, {
            title: 'Merge Active Listings',
            description: '',
            tags: {
                steamOnly: true
            }
        });

        // --- Modules ---

        // Settings.MODULE_ADJUST_FAVOURITES
        modulesSettings += await createCheckboxOption(Settings.MODULE_ADJUST_FAVOURITES, {
            title: 'MODULE_ADJUST_FAVOURITES',
            description: 'Adjustments in the Buff favourites<br>Active on:<br><code>[.*]buff.163.com/user-center/bookmark/sell_order*</code>',
            tags: {
                isModule: true
            }
        });

        // Settings.MODULE_ADJUST_LISTINGS
        modulesSettings += await createCheckboxOption(Settings.MODULE_ADJUST_LISTINGS, {
            title: 'MODULE_ADJUST_LISTINGS',
            description: 'Adjustments in the Buff listing view<br>Active on:<br><code>[.*]buff.163.com/goods/*</code>',
            tags: {
                isModule: true
            }
        });

        // Settings.MODULE_ADJUST_MARKET
        modulesSettings += await createCheckboxOption(Settings.MODULE_ADJUST_MARKET, {
            title: 'MODULE_ADJUST_MARKET',
            description: 'Adjustments in the Buff market view<br>Active on:<br><code>[.*]buff.163.com/market/*</code>',
            tags: {
                isModule: true
            }
        });

        // Settings.MODULE_ADJUST_SALES
        modulesSettings += await createCheckboxOption(Settings.MODULE_ADJUST_SALES, {
            title: 'MODULE_ADJUST_SALES',
            description: 'Adjustments in the Buff sales view<br>Active on:<br><code>[.*]buff.163.com/market/sell_order/on_sale*</code>',
            tags: {
                isModule: true
            }
        });

        // Settings.MODULE_ADJUST_SETTINGS
        modulesSettings += await createCheckboxOption(Settings.MODULE_ADJUST_SETTINGS, {
            title: 'MODULE_ADJUST_SETTINGS',
            description: '<u>Deprecated</u> Adjustments in the Buff settings view<br>Active on:<br><code>[.*]buff.163.com/user-center/profile</code>',
            tags: {
                isModule: true
            }
        });

        // Settings.MODULE_ADJUST_SHARE
        modulesSettings += await createCheckboxOption(Settings.MODULE_ADJUST_SHARE, {
            title: 'MODULE_ADJUST_SHARE',
            description: '<u>Deprecated</u> Adjustments in the Buff share view<br>Active on:<br><code>[.*]buff.163.com/market/m/item_detail?*</code>',
            tags: {
                isModule: true
            }
        });

        // Settings.MODULE_ADJUST_SHOP
        modulesSettings += await createCheckboxOption(Settings.MODULE_ADJUST_SHOP, {
            title: 'MODULE_ADJUST_SHOP',
            description: 'Adjustments in the Buff shop view<br>Active on:<br><code>[.*]buff.163.com/shop*</code>',
            tags: {
                isModule: true
            }
        });

        // Settings.MODULE_PSE_LISTINGS
        modulesSettings += await createCheckboxOption(Settings.MODULE_PSE_LISTINGS, {
            title: 'MODULE_PSE_LISTINGS',
            description: 'Adjustments in the Steam listing view<br>Active on:<br><code>[.*]steamcommunity.com/market/listings/*</code>',
            tags: {
                isModule: true
            }
        });

        // Settings.MODULE_PSE_MARKET
        modulesSettings += await createCheckboxOption(Settings.MODULE_PSE_MARKET, {
            title: 'MODULE_PSE_MARKET',
            description: 'Adjustments in the Steam market view<br>Active on:<br><code>[.*]steamcommunity.com/market</code><br><code>[.*]steamcommunity.com/market/</code><br><code>[.*]steamcommunity.com/market?*</code>',
            tags: {
                isModule: true
            }
        });

        // Settings.MODULE_PSE_TRANSFORMGRAPH
        modulesSettings += await createCheckboxOption(Settings.MODULE_PSE_TRANSFORMGRAPH, {
            title: 'MODULE_PSE_TRANSFORMGRAPH',
            description: 'Adjustments to the Steam sales graph<br>Active on:<br><code>[.*]steamcommunity.com/market/listings/*</code>',
            tags: {
                isModule: true
            }
        });


        // append html
        document.querySelector('#settings-normal tbody').innerHTML = normalSettings;
        // document.querySelector('#settings-advanced tbody').innerHTML = advancedSettings;
        document.querySelector('#settings-experimental tbody').innerHTML = experimentalSettings;
        document.querySelector('#settings-pse tbody').innerHTML = pseSettings;
        document.querySelector('#settings-modules tbody').innerHTML = modulesSettings;

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
                case 'button':
                    element.onclick = () => {
                        console.debug('button', element);

                        const handler = element.getAttribute('data-handler');

                        if (typeof Options[handler] == 'function') {
                            Options[handler]();
                        }
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

        // add event show-modules
        document.querySelector('#show-modules').addEventListener('click', () => {
            (<HTMLElement>document.querySelector('[data-page="modules"]')).click();
        });
    }

    export function sendAllowExtensionRequests(): void {
        if (confirm('You are about to enable Extension Requests, this is potentially dangerous and we offer no support or help for any issues that may arise from this. This cannot be undone.')) {
            if (confirm('Are you really sure you wish to enable this Setting? THIS CANNOT BE UNDONE. You can still go back and use all other features of BuffUtility without any issues.')) {
                const message = 'I understand what I am about todo and the potential consequences that may happen. I have been warned.';
                if (prompt(`To enable the feature please enter: "${message}"`) === message) {
                    setSetting(Settings.ALLOW_EXTENSION_REQUESTS, true);
                }
            }
        }
    }

    init();

}
