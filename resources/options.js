var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Options;
(function (Options) {
    var setSetting = ExtensionSettings.setSetting;
    var getSetting = ExtensionSettings.getSetting;
    function createSettingHTML(info, settingHTML) {
        return Util.buildHTML('tr', {
            content: [
                Util.buildHTML('td', {
                    content: [
                        Util.buildHTML('div', {
                            class: 'setting-title',
                            content: [info.title]
                        }),
                        Util.buildHTML('div', {
                            class: 'setting-description action',
                            content: ["<span class=\"setting-description sym-expanded\">-</span> Description</div>"]
                        }),
                        Util.buildHTML('div', {
                            class: 'setting-description text-expanded',
                            content: [info.description]
                        }),
                    ]
                }),
                Util.buildHTML('td', {
                    content: [settingHTML]
                }),
                Util.buildHTML('td')
            ]
        }) + Util.buildHTML('tr', {
            content: [
                '<td><hr /></td>'
            ]
        });
    }
    function createInputOption(setting, info, type, value) {
        return createSettingHTML(info, Util.buildHTML('input', {
            id: setting,
            attributes: {
                'type': type,
                'data-target': 'input',
                'value': "".concat(value)
            }
        }));
    }
    function createCheckboxOption(setting, info) {
        var _a;
        return createSettingHTML(info, Util.buildHTML('input', {
            id: setting,
            attributes: (_a = {
                    'type': 'checkbox',
                    'data-target': 'checkbox'
                },
                _a[getSetting(setting) ? 'checked' : 'no-checked'] = '',
                _a)
        }));
    }
    function createSelectOption(setting, info, options, selectedOption) {
        return createSettingHTML(info, Util.buildHTML('select', {
            id: setting,
            attributes: {
                'data-target': 'select'
            },
            content: (options !== null && options !== void 0 ? options : []).map(function (option) { return "<option value=\"".concat(option.value, "\" ").concat((selectedOption == option.value) ? 'selected' : '', ">").concat(option.displayText, "</option>"); })
        }));
    }
    function createMultiCheckboxOption(setting, info, options) {
        var values = getSetting(setting);
        return createSettingHTML(info, Util.buildHTML('div', {
            id: setting,
            content: options.map(function (option, index) {
                var _a;
                return Util.buildHTML('div', {
                    content: [
                        Util.buildHTML('label', {
                            attributes: {
                                'for': "".concat(setting, "-").concat(index)
                            },
                            content: option
                        }),
                        Util.buildHTML('input', {
                            id: "".concat(setting, "-").concat(index),
                            attributes: (_a = {
                                    'type': 'checkbox',
                                    'data-target': 'multi',
                                    'data-setting': setting,
                                    'data-index': "".concat(index)
                                },
                                _a[values[index] ? 'checked' : 'no-checked'] = '',
                                _a)
                        })
                    ]
                });
            })
        }));
    }
    function init() {
        return __awaiter(this, void 0, void 0, function () {
            var normalSettings, advancedSettings, experimentalSettings, currencyData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // make sure settings are loaded
                    return [4 /*yield*/, ExtensionSettings.isLoaded()];
                    case 1:
                        // make sure settings are loaded
                        _a.sent();
                        normalSettings = '';
                        advancedSettings = '';
                        experimentalSettings = '';
                        // --- Normal Settings ---
                        // Settings.SELECTED_CURRENCY
                        CurrencyHelper.initialize(false);
                        currencyData = CurrencyHelper.getData();
                        normalSettings += createSelectOption("selected_currency" /* SELECTED_CURRENCY */, {
                            title: 'Display Currency',
                            description: 'Set the display currency to be used across BuffUtility'
                        }, Object.keys(currencyData.rates).map(function (key) {
                            var _a;
                            return {
                                displayText: "".concat(key, " - ").concat((_a = currencyData.symbols[key]) !== null && _a !== void 0 ? _a : '?'),
                                value: key
                            };
                        }), getSetting("selected_currency" /* SELECTED_CURRENCY */));
                        // Settings.APPLY_CURRENCY_TO_DIFFERENCE
                        normalSettings += createCheckboxOption("apply_currency_to_difference" /* APPLY_CURRENCY_TO_DIFFERENCE */, {
                            title: 'Apply Currency to difference',
                            description: 'Whether to show the difference on the listing page in your selected currency or RMB.'
                        });
                        // Settings.CAN_EXPAND_SCREENSHOTS
                        normalSettings += createCheckboxOption("can_expand_screenshots" /* CAN_EXPAND_SCREENSHOTS */, {
                            title: 'Can expand preview',
                            description: 'Can previews be expanded on sell listings. This only works if "Preview screenshots" is turned on and if the item has been inspected.'
                        });
                        // Settings.EXPAND_SCREENSHOTS_BACKDROP
                        normalSettings += createCheckboxOption("expand_screenshots_backdrop" /* EXPAND_SCREENSHOTS_BACKDROP */, {
                            title: 'Expanded preview backdrop',
                            description: 'Adds a transparent black backdrop to preview images to add some contrast.'
                        });
                        // Settings.APPLY_STEAM_TAX
                        normalSettings += createCheckboxOption("apply_steam_tax" /* APPLY_STEAM_TAX */, {
                            title: 'Apply Steam Tax',
                            description: 'Apply Steam Tax before calculating differences.<br/>This will calculate the steam seller price from the provided reference price.'
                        });
                        // Settings.SHOW_TOAST_ON_ACTION
                        normalSettings += createCheckboxOption("show_toast_on_action" /* SHOW_TOAST_ON_ACTION */, {
                            title: 'Show Toast on action',
                            description: 'If enabled, certain BuffUtility components will inform you via Buffs Toast system.'
                        });
                        // Settings.LISTING_OPTIONS
                        normalSettings += createMultiCheckboxOption("listing_options" /* LISTING_OPTIONS */, {
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
                        normalSettings += createCheckboxOption("show_float_bar" /* SHOW_FLOAT_BAR */, {
                            title: 'Show float-bar',
                            description: 'Show the float-bar buff has on the side, can be expanded back if hidden!'
                        });
                        // Settings.COLOR_LISTINGS
                        createMultiCheckboxOption("color_listings" /* COLOR_LISTINGS */, {
                            title: 'Color purchase options',
                            description: 'Color purchase options, this will paint purchase options red if not affordable with the current held balance.'
                        }, [
                            'Color Buy',
                            'Color Bargain'
                        ]);
                        // Settings.USE_SCHEME
                        createCheckboxOption("use_scheme" /* USE_SCHEME */, {
                            title: 'Use Color Scheme',
                            description: 'Use the defined color scheme (dark mode by default)'
                        });
                        // --- Advanced Settings ---
                        // Settings.DIFFERENCE_DOMINATOR
                        advancedSettings += createSelectOption("difference_dominator" /* DIFFERENCE_DOMINATOR */, {
                            title: 'Difference Dominator',
                            description: 'Specify the dominator meaning:<br>Steam: (scmp-bp)/scmp\nBuff: (scmp-bp)/bp<br>Unless you know the difference might not want to change this setting.'
                        }, [
                            {
                                displayText: 'Steam',
                                value: 0 /* STEAM */
                            },
                            {
                                displayText: 'Buff',
                                value: 1 /* BUFF */
                            }
                        ], getSetting("difference_dominator" /* DIFFERENCE_DOMINATOR */));
                        // Settings.DEFAULT_SORT_BY
                        advancedSettings += createSelectOption("default_sort_by" /* DEFAULT_SORT_BY */, {
                            title: 'Default sort by',
                            description: 'Default sort by for item listings<br>Default: Default<br>Newest: Newest<br>Price Ascending: low to high<br>Price Descending: high to low<br>Float Ascending: low to high<br>Float Descending: high to low<br>Hot Descending: by popularity'
                        }, Object.keys(ExtensionSettings.FILTER_SORT_BY).map(function (option) {
                            return {
                                displayText: option,
                                value: ExtensionSettings.FILTER_SORT_BY[option]
                            };
                        }), getSetting("default_sort_by" /* DEFAULT_SORT_BY */));
                        // Settings.DEFAULT_STICKER_SEARCH
                        advancedSettings += createSelectOption("default_sticker_search" /* DEFAULT_STICKER_SEARCH */, {
                            title: 'Default sticker search',
                            description: 'Search listings with sticker settings automatically.'
                        }, Object.keys(ExtensionSettings.FILTER_STICKER_SEARCH).map(function (option) {
                            return {
                                displayText: option,
                                value: ExtensionSettings.FILTER_STICKER_SEARCH[option]
                            };
                        }), getSetting("default_sticker_search" /* DEFAULT_STICKER_SEARCH */));
                        // Settings.EXPAND_TYPE
                        advancedSettings += createSelectOption("expand_type" /* EXPAND_TYPE */, {
                            title: 'Expand preview type',
                            description: 'Either expand into a zoomed preview image or expand into the inspect image.'
                        }, [
                            {
                                displayText: 'Preview',
                                value: 0 /* PREVIEW */
                            },
                            {
                                displayText: 'Inspect',
                                value: 1 /* INSPECT */
                            }
                        ], getSetting("expand_type" /* EXPAND_TYPE */));
                        // Settings.CUSTOM_FOP
                        advancedSettings += createSelectOption("custom_fop" /* CUSTOM_FOP */, {
                            title: 'Custom FOP',
                            description: 'Set the factor (or field) of preview, you should <b>not</b> change this from \'Auto\'.'
                        }, [], getSetting("custom_fop" /* CUSTOM_FOP */));
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
                        document.querySelectorAll('[data-target]').forEach(function (element) {
                            switch (element.getAttribute('data-target')) {
                                case 'checkbox':
                                    element.onclick = function () {
                                        console.debug('checkbox', element, element.checked);
                                        setSetting(element.getAttribute('id'), element.checked);
                                    };
                                    break;
                                case 'input':
                                    element.onkeyup = function () {
                                        console.debug('input', element, element.value);
                                        setSetting(element.getAttribute('id'), element.value);
                                    };
                                    break;
                                case 'multi':
                                    element.onclick = function () {
                                        console.debug('checkbox', element, element.checked);
                                        var values = getSetting(element.getAttribute('data-setting'));
                                        var index = parseInt(element.getAttribute('data-index'));
                                        values[index] = element.checked;
                                        setSetting(element.getAttribute('data-setting'), values);
                                    };
                                    break;
                                case 'select':
                                    element.onchange = function () {
                                        var _a;
                                        console.debug('select', element, element.selectedOptions[0]);
                                        setSetting(element.getAttribute('id'), (_a = element.selectedOptions[0].getAttribute('value')) !== null && _a !== void 0 ? _a : 'USD');
                                    };
                                    break;
                            }
                        });
                        document.querySelectorAll('.setting-description.action').forEach(function (element) {
                            element.onclick = function () {
                                var collapsedText = element.parentElement.querySelector('.setting-description.text-collapsed');
                                var symCollapsed = element.querySelector('.setting-description.sym-collapsed');
                                var expandedText = element.parentElement.querySelector('.setting-description.text-expanded');
                                var symExpanded = element.querySelector('.setting-description.sym-expanded');
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
                        return [2 /*return*/];
                }
            });
        });
    }
    init();
})(Options || (Options = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm9wdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBTyxPQUFPLENBaVZiO0FBalZELFdBQU8sT0FBTztJQUdWLElBQU8sVUFBVSxHQUFHLGlCQUFpQixDQUFDLFVBQVUsQ0FBQztJQUNqRCxJQUFPLFVBQVUsR0FBRyxpQkFBaUIsQ0FBQyxVQUFVLENBQUM7SUFZakQsU0FBUyxpQkFBaUIsQ0FBQyxJQUFpQixFQUFFLFdBQW1CO1FBQzdELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUU7WUFDeEIsT0FBTyxFQUFFO2dCQUNMLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFO29CQUNqQixPQUFPLEVBQUU7d0JBQ0wsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUU7NEJBQ2xCLEtBQUssRUFBRSxlQUFlOzRCQUN0QixPQUFPLEVBQUUsQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFFO3lCQUMxQixDQUFDO3dCQUNGLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFOzRCQUNsQixLQUFLLEVBQUUsNEJBQTRCOzRCQUNuQyxPQUFPLEVBQUUsQ0FBRSw2RUFBMkUsQ0FBRTt5QkFDM0YsQ0FBQzt3QkFDRixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRTs0QkFDbEIsS0FBSyxFQUFFLG1DQUFtQzs0QkFDMUMsT0FBTyxFQUFFLENBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBRTt5QkFDaEMsQ0FBQztxQkFDTDtpQkFDSixDQUFDO2dCQUNGLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFO29CQUNqQixPQUFPLEVBQUUsQ0FBRSxXQUFXLENBQUU7aUJBQzNCLENBQUM7Z0JBQ0YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7YUFDdkI7U0FDSixDQUFDLEdBQUcsSUFBSSxDQUFD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QUM7b0NBQzVCLFdBQVcsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLG1DQUFtQyxDQUFDLENBQUM7aUNBQzFFOzRCQUNMLENBQUMsQ0FBQzt3QkFDTixDQUFDLENBQUMsQ0FBQzs7Ozs7S0FDTjtJQUVELElBQUksRUFBRSxDQUFDO0FBRVgsQ0FBQyxFQWpWTSxPQUFPLEtBQVAsT0FBTyxRQWlWYiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZSBPcHRpb25zIHtcclxuXHJcbiAgICBpbXBvcnQgcmVzZXRTZXR0aW5nID0gRXh0ZW5zaW9uU2V0dGluZ3MucmVzZXRTZXR0aW5nO1xyXG4gICAgaW1wb3J0IHNldFNldHRpbmcgPSBFeHRlbnNpb25TZXR0aW5ncy5zZXRTZXR0aW5nO1xyXG4gICAgaW1wb3J0IGdldFNldHRpbmcgPSBFeHRlbnNpb25TZXR0aW5ncy5nZXRTZXR0aW5nO1xyXG5cclxuICAgIGludGVyZmFjZSBEaXNwbGF5SW5mbyB7XHJcbiAgICAgICAgdGl0bGU6IHN0cmluZyxcclxuICAgICAgICBkZXNjcmlwdGlvbjogc3RyaW5nXHJcbiAgICB9XHJcblxyXG4gICAgaW50ZXJmYWNlIFNlbGVjdE9wdGlvbiB7XHJcbiAgICAgICAgZGlzcGxheVRleHQ6IHN0cmluZyxcclxuICAgICAgICB2YWx1ZTogYW55XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlU2V0dGluZ0hUTUwoaW5mbzogRGlzcGxheUluZm8sIHNldHRpbmdIVE1MOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBVdGlsLmJ1aWxkSFRNTCgndHInLCB7XHJcbiAgICAgICAgICAgIGNvbnRlbnQ6IFtcclxuICAgICAgICAgICAgICAgIFV0aWwuYnVpbGRIVE1MKCd0ZCcsIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFV0aWwuYnVpbGRIVE1MKCdkaXYnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzczogJ3NldHRpbmctdGl0bGUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogWyBpbmZvLnRpdGxlIF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFV0aWwuYnVpbGRIVE1MKCdkaXYnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzczogJ3NldHRpbmctZGVzY3JpcHRpb24gYWN0aW9uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFsgYDxzcGFuIGNsYXNzPVwic2V0dGluZy1kZXNjcmlwdGlvbiBzeW0tZXhwYW5kZWRcIj4tPC9zcGFuPiBEZXNjcmlwdGlvbjwvZGl2PmAgXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgVXRpbC5idWlsZEhUTUwoJ2RpdicsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiAnc2V0dGluZy1kZXNjcmlwdGlvbiB0ZXh0LWV4cGFuZGVkJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFsgaW5mby5kZXNjcmlwdGlvbiBdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgVXRpbC5idWlsZEhUTUwoJ3RkJywge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFsgc2V0dGluZ0hUTUwgXVxyXG4gICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICBVdGlsLmJ1aWxkSFRNTCgndGQnKVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSkgKyBVdGlsLmJ1aWxkSFRNTCgndHInLCB7XHJcbiAgICAgICAgICAgIGNvbnRlbnQ6IFtcclxuICAgICAgICAgICAgICAgICc8dGQ+PGhyIC8+PC90ZD4nXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVJbnB1dE9wdGlvbihzZXR0aW5nOiBTZXR0aW5ncywgaW5mbzogRGlzcGxheUluZm8sIHR5cGU6IHN0cmluZywgdmFsdWU6IGFueSk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIGNyZWF0ZVNldHRpbmdIVE1MKGluZm8sIFV0aWwuYnVpbGRIVE1MKCdpbnB1dCcsIHtcclxuICAgICAgICAgICAgaWQ6IHNldHRpbmcsXHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHtcclxuICAgICAgICAgICAgICAgICd0eXBlJzogdHlwZSxcclxuICAgICAgICAgICAgICAgICdkYXRhLXRhcmdldCc6ICdpbnB1dCcsXHJcbiAgICAgICAgICAgICAgICAndmFsdWUnOiBgJHt2YWx1ZX1gXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlQ2hlY2tib3hPcHRpb24oc2V0dGluZzogU2V0dGluZ3MsIGluZm86IERpc3BsYXlJbmZvKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gY3JlYXRlU2V0dGluZ0hUTUwoaW5mbywgVXRpbC5idWlsZEhUTUwoJ2lucHV0Jywge1xyXG4gICAgICAgICAgICBpZDogc2V0dGluZyxcclxuICAgICAgICAgICAgYXR0cmlidXRlczoge1xyXG4gICAgICAgICAgICAgICAgJ3R5cGUnOiAnY2hlY2tib3gnLFxyXG4gICAgICAgICAgICAgICAgJ2RhdGEtdGFyZ2V0JzogJ2NoZWNrYm94JyxcclxuICAgICAgICAgICAgICAgIFtnZXRTZXR0aW5nKHNldHRpbmcpID8gJ2NoZWNrZWQnIDogJ25vLWNoZWNrZWQnXTogJydcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVTZWxlY3RPcHRpb24oc2V0dGluZzogU2V0dGluZ3MsIGluZm86IERpc3BsYXlJbmZvLCBvcHRpb25zOiBTZWxlY3RPcHRpb25bXSwgc2VsZWN0ZWRPcHRpb24/OiBhbnkpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBjcmVhdGVTZXR0aW5nSFRNTChpbmZvLCBVdGlsLmJ1aWxkSFRNTCgnc2VsZWN0Jywge1xyXG4gICAgICAgICAgICBpZDogc2V0dGluZyxcclxuICAgICAgICAgICAgYXR0cmlidXRlczoge1xyXG4gICAgICAgICAgICAgICAgJ2RhdGEtdGFyZ2V0JzogJ3NlbGVjdCdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY29udGVudDogKG9wdGlvbnMgPz8gW10pLm1hcChvcHRpb24gPT4gYDxvcHRpb24gdmFsdWU9XCIke29wdGlvbi52YWx1ZX1cIiAkeyhzZWxlY3RlZE9wdGlvbiA9PSBvcHRpb24udmFsdWUpID8gJ3NlbGVjdGVkJyA6ICcnfT4ke29wdGlvbi5kaXNwbGF5VGV4dH08L29wdGlvbj5gKVxyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVNdWx0aUNoZWNrYm94T3B0aW9uKHNldHRpbmc6IFNldHRpbmdzLCBpbmZvOiBEaXNwbGF5SW5mbywgb3B0aW9uczogc3RyaW5nW10pOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlczogYm9vbGVhbltdID0gZ2V0U2V0dGluZyhzZXR0aW5nKTtcclxuICAgICAgICByZXR1cm4gY3JlYXRlU2V0dGluZ0hUTUwoaW5mbywgVXRpbC5idWlsZEhUTUwoJ2RpdicsIHtcclxuICAgICAgICAgICAgaWQ6IHNldHRpbmcsXHJcbiAgICAgICAgICAgIGNvbnRlbnQ6IG9wdGlvbnMubWFwKChvcHRpb24sIGluZGV4KSA9PiBVdGlsLmJ1aWxkSFRNTCgnZGl2Jywge1xyXG4gICAgICAgICAgICAgICAgY29udGVudDogW1xyXG4gICAgICAgICAgICAgICAgICAgIFV0aWwuYnVpbGRIVE1MKCdsYWJlbCcsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2Zvcic6IGAke3NldHRpbmd9LSR7aW5kZXh9YFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBvcHRpb25cclxuICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgICAgICBVdGlsLmJ1aWxkSFRNTCgnaW5wdXQnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBgJHtzZXR0aW5nfS0ke2luZGV4fWAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlJzogJ2NoZWNrYm94JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhLXRhcmdldCc6ICdtdWx0aScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YS1zZXR0aW5nJzogc2V0dGluZyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhLWluZGV4JzogYCR7aW5kZXh9YCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFt2YWx1ZXNbaW5kZXhdID8gJ2NoZWNrZWQnIDogJ25vLWNoZWNrZWQnXTogJydcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0pKVxyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBmdW5jdGlvbiBpbml0KCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIC8vIG1ha2Ugc3VyZSBzZXR0aW5ncyBhcmUgbG9hZGVkXHJcbiAgICAgICAgYXdhaXQgRXh0ZW5zaW9uU2V0dGluZ3MuaXNMb2FkZWQoKTtcclxuXHJcbiAgICAgICAgbGV0IG5vcm1hbFNldHRpbmdzOiBzdHJpbmcgPSAnJztcclxuICAgICAgICBsZXQgYWR2YW5jZWRTZXR0aW5nczogc3RyaW5nID0gJyc7XHJcbiAgICAgICAgbGV0IGV4cGVyaW1lbnRhbFNldHRpbmdzOiBzdHJpbmcgPSAnJztcclxuXHJcbiAgICAgICAgLy8gLS0tIE5vcm1hbCBTZXR0aW5ncyAtLS1cclxuXHJcbiAgICAgICAgLy8gU2V0dGluZ3MuU0VMRUNURURfQ1VSUkVOQ1lcclxuICAgICAgICBDdXJyZW5jeUhlbHBlci5pbml0aWFsaXplKGZhbHNlKTtcclxuICAgICAgICBjb25zdCBjdXJyZW5jeURhdGEgPSBDdXJyZW5jeUhlbHBlci5nZXREYXRhKCk7XHJcbiAgICAgICAgbm9ybWFsU2V0dGluZ3MgKz0gY3JlYXRlU2VsZWN0T3B0aW9uKFNldHRpbmdzLlNFTEVDVEVEX0NVUlJFTkNZLCB7XHJcbiAgICAgICAgICAgIHRpdGxlOiAnRGlzcGxheSBDdXJyZW5jeScsXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnU2V0IHRoZSBkaXNwbGF5IGN1cnJlbmN5IHRvIGJlIHVzZWQgYWNyb3NzIEJ1ZmZVdGlsaXR5J1xyXG4gICAgICAgIH0sIE9iamVjdC5rZXlzKGN1cnJlbmN5RGF0YS5yYXRlcykubWFwKGtleSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5VGV4dDogYCR7a2V5fSAtICR7Y3VycmVuY3lEYXRhLnN5bWJvbHNba2V5XSA/PyAnPyd9YCxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiBrZXlcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9KSwgZ2V0U2V0dGluZyhTZXR0aW5ncy5TRUxFQ1RFRF9DVVJSRU5DWSkpO1xyXG5cclxuICAgICAgICAvLyBTZXR0aW5ncy5BUFBMWV9DVVJSRU5DWV9UT19ESUZGRVJFTkNFXHJcbiAgICAgICAgbm9ybWFsU2V0dGluZ3MgKz0gY3JlYXRlQ2hlY2tib3hPcHRpb24oU2V0dGluZ3MuQVBQTFlfQ1VSUkVOQ1lfVE9fRElGRkVSRU5DRSwge1xyXG4gICAgICAgICAgICB0aXRsZTogJ0FwcGx5IEN1cnJlbmN5IHRvIGRpZmZlcmVuY2UnLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1doZXRoZXIgdG8gc2hvdyB0aGUgZGlmZmVyZW5jZSBvbiB0aGUgbGlzdGluZyBwYWdlIGluIHlvdXIgc2VsZWN0ZWQgY3VycmVuY3kgb3IgUk1CLidcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gU2V0dGluZ3MuQ0FOX0VYUEFORF9TQ1JFRU5TSE9UU1xyXG4gICAgICAgIG5vcm1hbFNldHRpbmdzICs9IGNyZWF0ZUNoZWNrYm94T3B0aW9uKFNldHRpbmdzLkNBTl9FWFBBTkRfU0NSRUVOU0hPVFMsIHtcclxuICAgICAgICAgICAgdGl0bGU6ICdDYW4gZXhwYW5kIHByZXZpZXcnLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0NhbiBwcmV2aWV3cyBiZSBleHBhbmRlZCBvbiBzZWxsIGxpc3RpbmdzLiBUaGlzIG9ubHkgd29ya3MgaWYgXCJQcmV2aWV3IHNjcmVlbnNob3RzXCIgaXMgdHVybmVkIG9uIGFuZCBpZiB0aGUgaXRlbSBoYXMgYmVlbiBpbnNwZWN0ZWQuJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBTZXR0aW5ncy5FWFBBTkRfU0NSRUVOU0hPVFNfQkFDS0RST1BcclxuICAgICAgICBub3JtYWxTZXR0aW5ncyArPSBjcmVhdGVDaGVja2JveE9wdGlvbihTZXR0aW5ncy5FWFBBTkRfU0NSRUVOU0hPVFNfQkFDS0RST1AsIHtcclxuICAgICAgICAgICAgdGl0bGU6ICdFeHBhbmRlZCBwcmV2aWV3IGJhY2tkcm9wJyxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdBZGRzIGEgdHJhbnNwYXJlbnQgYmxhY2sgYmFja2Ryb3AgdG8gcHJldmlldyBpbWFnZXMgdG8gYWRkIHNvbWUgY29udHJhc3QuJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBTZXR0aW5ncy5BUFBMWV9TVEVBTV9UQVhcclxuICAgICAgICBub3JtYWxTZXR0aW5ncyArPSBjcmVhdGVDaGVja2JveE9wdGlvbihTZXR0aW5ncy5BUFBMWV9TVEVBTV9UQVgsIHtcclxuICAgICAgICAgICAgdGl0bGU6ICdBcHBseSBTdGVhbSBUYXgnLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0FwcGx5IFN0ZWFtIFRheCBiZWZvcmUgY2FsY3VsYXRpbmcgZGlmZmVyZW5jZXMuPGJyLz5UaGlzIHdpbGwgY2FsY3VsYXRlIHRoZSBzdGVhbSBzZWxsZXIgcHJpY2UgZnJvbSB0aGUgcHJvdmlkZWQgcmVmZXJlbmNlIHByaWNlLidcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gU2V0dGluZ3MuU0hPV19UT0FTVF9PTl9BQ1RJT05cclxuICAgICAgICBub3JtYWxTZXR0aW5ncyArPSBjcmVhdGVDaGVja2JveE9wdGlvbihTZXR0aW5ncy5TSE9XX1RPQVNUX09OX0FDVElPTiwge1xyXG4gICAgICAgICAgICB0aXRsZTogJ1Nob3cgVG9hc3Qgb24gYWN0aW9uJyxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdJZiBlbmFibGVkLCBjZXJ0YWluIEJ1ZmZVdGlsaXR5IGNvbXBvbmVudHMgd2lsbCBpbmZvcm0geW91IHZpYSBCdWZmcyBUb2FzdCBzeXN0ZW0uJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBTZXR0aW5ncy5MSVNUSU5HX09QVElPTlNcclxuICAgICAgICBub3JtYWxTZXR0aW5ncyArPSBjcmVhdGVNdWx0aUNoZWNrYm94T3B0aW9uKFNldHRpbmdzLkxJU1RJTkdfT1BUSU9OUywge1xyXG4gICAgICAgICAgICB0aXRsZTogJ0xpc3Rpbmcgb3B0aW9ucycsXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnRGVmaW5lIHdoYXQgb3B0aW9ucyBzaG93IHVwIG9uIGVhY2ggbGlzdGluZydcclxuICAgICAgICB9LCBbXHJcbiAgICAgICAgICAgICczRCBJbnNwZWN0JyxcclxuICAgICAgICAgICAgJ0luc3BlY3QgaW4gc2VydmVyJyxcclxuICAgICAgICAgICAgJ0NvcHkgIWdlbi8hZ2VuZ2wnLFxyXG4gICAgICAgICAgICAnU2hhcmUnLFxyXG4gICAgICAgICAgICAnTWF0Y2ggZmxvYXRkYicsXHJcbiAgICAgICAgICAgICdOYXJyb3cnXHJcbiAgICAgICAgXSk7XHJcblxyXG4gICAgICAgIC8vIFNldHRpbmdzLlNIT1dfRkxPQVRfQkFSXHJcbiAgICAgICAgbm9ybWFsU2V0dGluZ3MgKz0gY3JlYXRlQ2hlY2tib3hPcHRpb24oU2V0dGluZ3MuU0hPV19GTE9BVF9CQVIsIHtcclxuICAgICAgICAgICAgdGl0bGU6ICdTaG93IGZsb2F0LWJhcicsXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnU2hvdyB0aGUgZmxvYXQtYmFyIGJ1ZmYgaGFzIG9uIHRoZSBzaWRlLCBjYW4gYmUgZXhwYW5kZWQgYmFjayBpZiBoaWRkZW4hJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBTZXR0aW5ncy5DT0xPUl9MSVNUSU5HU1xyXG4gICAgICAgIGNyZWF0ZU11bHRpQ2hlY2tib3hPcHRpb24oU2V0dGluZ3MuQ09MT1JfTElTVElOR1MsIHtcclxuICAgICAgICAgICAgdGl0bGU6ICdDb2xvciBwdXJjaGFzZSBvcHRpb25zJyxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdDb2xvciBwdXJjaGFzZSBvcHRpb25zLCB0aGlzIHdpbGwgcGFpbnQgcHVyY2hhc2Ugb3B0aW9ucyByZWQgaWYgbm90IGFmZm9yZGFibGUgd2l0aCB0aGUgY3VycmVudCBoZWxkIGJhbGFuY2UuJ1xyXG4gICAgICAgIH0sIFtcclxuICAgICAgICAgICAgJ0NvbG9yIEJ1eScsXHJcbiAgICAgICAgICAgICdDb2xvciBCYXJnYWluJ1xyXG4gICAgICAgIF0pO1xyXG5cclxuICAgICAgICAvLyBTZXR0aW5ncy5VU0VfU0NIRU1FXHJcbiAgICAgICAgY3JlYXRlQ2hlY2tib3hPcHRpb24oU2V0dGluZ3MuVVNFX1NDSEVNRSwge1xyXG4gICAgICAgICAgICB0aXRsZTogJ1VzZSBDb2xvciBTY2hlbWUnLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1VzZSB0aGUgZGVmaW5lZCBjb2xvciBzY2hlbWUgKGRhcmsgbW9kZSBieSBkZWZhdWx0KSdcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gLS0tIEFkdmFuY2VkIFNldHRpbmdzIC0tLVxyXG4gICAgICAgIC8vIFNldHRpbmdzLkRJRkZFUkVOQ0VfRE9NSU5BVE9SXHJcbiAgICAgICAgYWR2YW5jZWRTZXR0aW5ncyArPSBjcmVhdGVTZWxlY3RPcHRpb24oU2V0dGluZ3MuRElGRkVSRU5DRV9ET01JTkFUT1IsIHtcclxuICAgICAgICAgICAgdGl0bGU6ICdEaWZmZXJlbmNlIERvbWluYXRvcicsXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnU3BlY2lmeSB0aGUgZG9taW5hdG9yIG1lYW5pbmc6PGJyPlN0ZWFtOiAoc2NtcC1icCkvc2NtcFxcbkJ1ZmY6IChzY21wLWJwKS9icDxicj5Vbmxlc3MgeW91IGtub3cgdGhlIGRpZmZlcmVuY2UgbWlnaHQgbm90IHdhbnQgdG8gY2hhbmdlIHRoaXMgc2V0dGluZy4nXHJcbiAgICAgICAgfSwgW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5VGV4dDogJ1N0ZWFtJyxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiBFeHRlbnNpb25TZXR0aW5ncy5EaWZmZXJlbmNlRG9taW5hdG9yLlNURUFNXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGRpc3BsYXlUZXh0OiAnQnVmZicsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogRXh0ZW5zaW9uU2V0dGluZ3MuRGlmZmVyZW5jZURvbWluYXRvci5CVUZGXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdLCBnZXRTZXR0aW5nKFNldHRpbmdzLkRJRkZFUkVOQ0VfRE9NSU5BVE9SKSk7XHJcblxyXG4gICAgICAgIC8vIFNldHRpbmdzLkRFRkFVTFRfU09SVF9CWVxyXG4gICAgICAgIGFkdmFuY2VkU2V0dGluZ3MgKz0gY3JlYXRlU2VsZWN0T3B0aW9uKFNldHRpbmdzLkRFRkFVTFRfU09SVF9CWSwge1xyXG4gICAgICAgICAgICB0aXRsZTogJ0RlZmF1bHQgc29ydCBieScsXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnRGVmYXVsdCBzb3J0IGJ5IGZvciBpdGVtIGxpc3RpbmdzPGJyPkRlZmF1bHQ6IERlZmF1bHQ8YnI+TmV3ZXN0OiBOZXdlc3Q8YnI+UHJpY2UgQXNjZW5kaW5nOiBsb3cgdG8gaGlnaDxicj5QcmljZSBEZXNjZW5kaW5nOiBoaWdoIHRvIGxvdzxicj5GbG9hdCBBc2NlbmRpbmc6IGxvdyB0byBoaWdoPGJyPkZsb2F0IERlc2NlbmRpbmc6IGhpZ2ggdG8gbG93PGJyPkhvdCBEZXNjZW5kaW5nOiBieSBwb3B1bGFyaXR5J1xyXG4gICAgICAgIH0sIE9iamVjdC5rZXlzKEV4dGVuc2lvblNldHRpbmdzLkZJTFRFUl9TT1JUX0JZKS5tYXAob3B0aW9uID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGRpc3BsYXlUZXh0OiBvcHRpb24sXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogRXh0ZW5zaW9uU2V0dGluZ3MuRklMVEVSX1NPUlRfQllbb3B0aW9uXVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0pLCBnZXRTZXR0aW5nKFNldHRpbmdzLkRFRkFVTFRfU09SVF9CWSkpO1xyXG5cclxuICAgICAgICAvLyBTZXR0aW5ncy5ERUZBVUxUX1NUSUNLRVJfU0VBUkNIXHJcbiAgICAgICAgYWR2YW5jZWRTZXR0aW5ncyArPSBjcmVhdGVTZWxlY3RPcHRpb24oU2V0dGluZ3MuREVGQVVMVF9TVElDS0VSX1NFQVJDSCwge1xyXG4gICAgICAgICAgICB0aXRsZTogJ0RlZmF1bHQgc3RpY2tlciBzZWFyY2gnLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1NlYXJjaCBsaXN0aW5ncyB3aXRoIHN0aWNrZXIgc2V0dGluZ3MgYXV0b21hdGljYWxseS4nXHJcbiAgICAgICAgfSwgT2JqZWN0LmtleXMoRXh0ZW5zaW9uU2V0dGluZ3MuRklMVEVSX1NUSUNLRVJfU0VBUkNIKS5tYXAob3B0aW9uID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGRpc3BsYXlUZXh0OiBvcHRpb24sXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogRXh0ZW5zaW9uU2V0dGluZ3MuRklMVEVSX1NUSUNLRVJfU0VBUkNIW29wdGlvbl1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9KSwgZ2V0U2V0dGluZyhTZXR0aW5ncy5ERUZBVUxUX1NUSUNLRVJfU0VBUkNIKSk7XHJcblxyXG4gICAgICAgIC8vIFNldHRpbmdzLkVYUEFORF9UWVBFXHJcbiAgICAgICAgYWR2YW5jZWRTZXR0aW5ncyArPSBjcmVhdGVTZWxlY3RPcHRpb24oU2V0dGluZ3MuRVhQQU5EX1RZUEUsIHtcclxuICAgICAgICAgICAgdGl0bGU6ICdFeHBhbmQgcHJldmlldyB0eXBlJyxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdFaXRoZXIgZXhwYW5kIGludG8gYSB6b29tZWQgcHJldmlldyBpbWFnZSBvciBleHBhbmQgaW50byB0aGUgaW5zcGVjdCBpbWFnZS4nXHJcbiAgICAgICAgfSwgW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5VGV4dDogJ1ByZXZpZXcnLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IEV4dGVuc2lvblNldHRpbmdzLkV4cGFuZFNjcmVlbnNob3RUeXBlLlBSRVZJRVdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZGlzcGxheVRleHQ6ICdJbnNwZWN0JyxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiBFeHRlbnNpb25TZXR0aW5ncy5FeHBhbmRTY3JlZW5zaG90VHlwZS5JTlNQRUNUXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdLCBnZXRTZXR0aW5nKFNldHRpbmdzLkVYUEFORF9UWVBFKSk7XHJcblxyXG4gICAgICAgIC8vIFNldHRpbmdzLkNVU1RPTV9GT1BcclxuICAgICAgICBhZHZhbmNlZFNldHRpbmdzICs9IGNyZWF0ZVNlbGVjdE9wdGlvbihTZXR0aW5ncy5DVVNUT01fRk9QLCB7XHJcbiAgICAgICAgICAgIHRpdGxlOiAnQ3VzdG9tIEZPUCcsXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnU2V0IHRoZSBmYWN0b3IgKG9yIGZpZWxkKSBvZiBwcmV2aWV3LCB5b3Ugc2hvdWxkIDxiPm5vdDwvYj4gY2hhbmdlIHRoaXMgZnJvbSBcXCdBdXRvXFwnLidcclxuICAgICAgICB9LCBbXHJcblxyXG4gICAgICAgIF0sIGdldFNldHRpbmcoU2V0dGluZ3MuQ1VTVE9NX0ZPUCkpO1xyXG5cclxuICAgICAgICAvLyBTZXR0aW5ncy5MT0NBVElPTl9SRUxPQURfTkVXRVNUXHJcbiAgICAgICAgLy8gU2V0dGluZ3MuQ1VTVE9NX0NVUlJFTkNZX1JBVEVcclxuICAgICAgICAvLyBTZXR0aW5ncy5DVVNUT01fQ1VSUkVOQ1lfTkFNRVxyXG4gICAgICAgIC8vIFNldHRpbmdzLkRBVEFfUFJPVEVDVElPTlxyXG4gICAgICAgIC8vIFNldHRpbmdzLkNPTE9SX1NDSEVNRVxyXG5cclxuICAgICAgICAvLyAtLS0gRXhwZXJpbWVudGFsIFNldHRpbmdzIC0tLVxyXG4gICAgICAgIC8vIFNldHRpbmdzLkVYUEVSSU1FTlRBTF9BTExPV19GQVZPVVJJVEVfQkFSR0FJTlxyXG4gICAgICAgIC8vIFNldHRpbmdzLkVYUEVSSU1FTlRBTF9BREpVU1RfUE9QVUxBUlxyXG4gICAgICAgIC8vIFNldHRpbmdzLkVYUEVSSU1FTlRBTF9GRVRDSF9OT1RJRklDQVRJT05cclxuICAgICAgICAvLyBTZXR0aW5ncy5FWFBFUklNRU5UQUxfRkVUQ0hfRkFWT1VSSVRFX0JBUkdBSU5fU1RBVFVTIC0gZGlzYWJsZWRcclxuICAgICAgICAvLyBTZXR0aW5ncy5FWFBFUklNRU5UQUxfRkVUQ0hfSVRFTV9QUklDRV9ISVNUT1JZIC0gZGlzYWJsZWRcclxuICAgICAgICAvLyBTZXR0aW5ncy5FWFBFUklNRU5UQUxfQURKVVNUX01BUktFVF9DVVJSRU5DWVxyXG4gICAgICAgIC8vIFNldHRpbmdzLkVYUEVSSU1FTlRBTF9GT1JNQVRfQ1VSUkVOQ1lcclxuICAgICAgICAvLyBTZXR0aW5ncy5FWFBFUklNRU5UQUxfQURKVVNUX1NIT1BcclxuICAgICAgICAvLyBTZXR0aW5ncy5FWFBFUklNRU5UQUxfQUxMT1dfQlVMS19CVVlcclxuXHJcbiAgICAgICAgLy8gYXBwZW5kIGh0bWxcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2V0dGluZ3Mtbm9ybWFsIHRib2R5JykuaW5uZXJIVE1MID0gbm9ybWFsU2V0dGluZ3M7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NldHRpbmdzLWFkdmFuY2VkIHRib2R5JykuaW5uZXJIVE1MID0gYWR2YW5jZWRTZXR0aW5ncztcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2V0dGluZ3MtZXhwZXJpbWVudGFsIHRib2R5JykuaW5uZXJIVE1MID0gZXhwZXJpbWVudGFsU2V0dGluZ3M7XHJcblxyXG4gICAgICAgIC8vIGFkZCBldmVudHNcclxuICAgICAgICAoPE5vZGVMaXN0T2Y8SFRNTEVsZW1lbnQ+PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXRhcmdldF0nKSkuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuICAgICAgICAgICAgc3dpdGNoIChlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS10YXJnZXQnKSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnY2hlY2tib3gnOlxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnY2hlY2tib3gnLCBlbGVtZW50LCAoPEhUTUxJbnB1dEVsZW1lbnQ+ZWxlbWVudCkuY2hlY2tlZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRTZXR0aW5nKDxTZXR0aW5ncz5lbGVtZW50LmdldEF0dHJpYnV0ZSgnaWQnKSwgKDxIVE1MSW5wdXRFbGVtZW50PmVsZW1lbnQpLmNoZWNrZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdpbnB1dCc6XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5vbmtleXVwID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdpbnB1dCcsIGVsZW1lbnQsICg8SFRNTElucHV0RWxlbWVudD5lbGVtZW50KS52YWx1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRTZXR0aW5nKDxTZXR0aW5ncz5lbGVtZW50LmdldEF0dHJpYnV0ZSgnaWQnKSwgKDxIVE1MSW5wdXRFbGVtZW50PmVsZW1lbnQpLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnbXVsdGknOlxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnY2hlY2tib3gnLCBlbGVtZW50LCAoPEhUTUxJbnB1dEVsZW1lbnQ+ZWxlbWVudCkuY2hlY2tlZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWVzOiBib29sZWFuW10gPSBnZXRTZXR0aW5nKDxTZXR0aW5ncz5lbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1zZXR0aW5nJykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSBwYXJzZUludChlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1pbmRleCcpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzW2luZGV4XSA9ICg8SFRNTElucHV0RWxlbWVudD5lbGVtZW50KS5jaGVja2VkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRTZXR0aW5nKDxTZXR0aW5ncz5lbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1zZXR0aW5nJyksIHZhbHVlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3NlbGVjdCc6XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5vbmNoYW5nZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kZWJ1Zygnc2VsZWN0JywgZWxlbWVudCwgKDxIVE1MU2VsZWN0RWxlbWVudD5lbGVtZW50KS5zZWxlY3RlZE9wdGlvbnNbMF0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0U2V0dGluZyg8U2V0dGluZ3M+ZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lkJyksICg8SFRNTFNlbGVjdEVsZW1lbnQ+ZWxlbWVudCkuc2VsZWN0ZWRPcHRpb25zWzBdLmdldEF0dHJpYnV0ZSgndmFsdWUnKSA/PyAnVVNEJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAoPE5vZGVMaXN0T2Y8SFRNTEVsZW1lbnQ+PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZXR0aW5nLWRlc2NyaXB0aW9uLmFjdGlvbicpKS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICBlbGVtZW50Lm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29sbGFwc2VkVGV4dCA9IDxIVE1MRWxlbWVudD5lbGVtZW50LnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignLnNldHRpbmctZGVzY3JpcHRpb24udGV4dC1jb2xsYXBzZWQnKTtcclxuICAgICAgICAgICAgICAgIGxldCBzeW1Db2xsYXBzZWQgPSA8SFRNTEVsZW1lbnQ+ZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuc2V0dGluZy1kZXNjcmlwdGlvbi5zeW0tY29sbGFwc2VkJyk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZXhwYW5kZWRUZXh0ID0gPEhUTUxFbGVtZW50PmVsZW1lbnQucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuc2V0dGluZy1kZXNjcmlwdGlvbi50ZXh0LWV4cGFuZGVkJyk7XHJcbiAgICAgICAgICAgICAgICBsZXQgc3ltRXhwYW5kZWQgPSA8SFRNTEVsZW1lbnQ+ZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuc2V0dGluZy1kZXNjcmlwdGlvbi5zeW0tZXhwYW5kZWQnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY29sbGFwc2VkVGV4dCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbGxhcHNlZFRleHQuc2V0QXR0cmlidXRlKCdjbGFzcycsICdzZXR0aW5nLWRlc2NyaXB0aW9uIHRleHQtZXhwYW5kZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICBzeW1Db2xsYXBzZWQuaW5uZXJUZXh0ID0gJy0nO1xyXG4gICAgICAgICAgICAgICAgICAgIHN5bUNvbGxhcHNlZC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3NldHRpbmctZGVzY3JpcHRpb24gc3ltLWV4cGFuZGVkJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGV4cGFuZGVkVGV4dCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGV4cGFuZGVkVGV4dC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3NldHRpbmctZGVzY3JpcHRpb24gdGV4dC1jb2xsYXBzZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICBzeW1FeHBhbmRlZC5pbm5lclRleHQgPSAnKyc7XHJcbiAgICAgICAgICAgICAgICAgICAgc3ltRXhwYW5kZWQuc2V0QXR0cmlidXRlKCdjbGFzcycsICdzZXR0aW5nLWRlc2NyaXB0aW9uIHN5bS1jb2xsYXBzZWQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCk7XHJcblxyXG59XHJcbiJdfQ==