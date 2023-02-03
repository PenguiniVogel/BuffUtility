module ExtensionSettings {

    DEBUG && console.debug('[BuffUtility] Module.ExtensionSettings');

    export const FLOAT_RANGES: [number, [string, string]][] = [
        // FN
        [0.01, ['0.00', '0.01']],
        [0.02, ['0.01', '0.02']],
        [0.03, ['0.02', '0.03']],
        [0.04, ['0.03', '0.04']],
        [0.07, ['0.04', '0.07']],
        // MW
        [0.08, ['0.07', '0.08']],
        [0.09, ['0.08', '0.09']],
        [0.10, ['0.09', '0.10']],
        [0.11, ['0.10', '0.11']],
        [0.15, ['0.11', '0.15']],
        // FT
        [0.18, ['0.15', '0.18']],
        [0.21, ['0.18', '0.21']],
        [0.24, ['0.21', '0.24']],
        [0.27, ['0.24', '0.27']],
        [0.38, ['0.27', '0.38']],
        // WW
        [0.39, ['0.38', '0.39']],
        [0.40, ['0.39', '0.40']],
        [0.41, ['0.40', '0.41']],
        [0.42, ['0.41', '0.42']],
        [0.45, ['0.42', '0.45']],
        // BS
        [0.50, ['0.45', '0.50']],
        [0.63, ['0.50', '0.63']],
        [0.76, ['0.63', '0.76']],
        [0.90, ['0.76', '0.90']],
        [1.00, ['0.90', '1.00']],
    ];

    export const enum DifferenceDominator {
        STEAM = 0,
        BUFF = 1
    }

    export const enum ExpandScreenshotType {
        PREVIEW = 0,
        INSPECT = 1
    }

    export const enum FOP_VALUES {
        Auto = '',
        w245xh230 = '?fop=imageView/2/w/245/h/230',
        w490xh460 = '?fop=imageView/2/w/490/h/460',
        w980xh920 = '?fop=imageView/2/w/980/h/920',
        w1960xh1840 = '?fop=imageView/2/w/1960/h/1840',
        w3920xh3680 = '?fop=imageView/2/w/3920/h/3680'
    }

    export const enum LOCATION_RELOAD_NEWEST_VALUES {
        NONE = 0,
        BULK = 1,
        SORT = 2,
        CENTER = 3,
        LEFT = 4
    }

    export const enum PriceHistoryRange {
        OFF = 0,
        WEEKLY = 7,
        MONTHLY = 30
    }

    export const enum FILTER_SORT_BY {
        DEFAULT = 'default',
        NEWEST = 'created.desc',
        PRICE_ASCENDING = 'price.asc',
        PRICE_DESCENDING = 'price.desc',
        FLOAT_ASCENDING = 'paintwear.asc',
        FLOAT_DESCENDING = 'paintwear.desc',
        HOT_DESCENDING = 'heat.desc',
        STICKER = 'sticker.desc'
    }

    export const enum FILTER_STICKER_SEARCH {
        ALL = '',
        STICKERS = '&extra_tag_ids=non_empty',
        STICKERS_100P = '&extra_tag_ids=non_empty&wearless_sticker=1',
        NO_STICKERS = '&extra_tag_ids=empty',
        QUAD_COMBOS = '&extra_tag_ids=squad_combos',
        QUAD_COMBOS_100P = '&extra_tag_ids=squad_combos&wearless_sticker=1',
        SAVE_CUSTOM = '&extra_tag_ids=$1'
    }

    export interface SteamSettings {
        readonly wallet_fee: number,
        readonly wallet_fee_base: number,
        readonly wallet_fee_percent: number,
        readonly wallet_fee_minimum: number
    }

    export const STEAM_SETTINGS: SteamSettings = {
        wallet_fee: 1,
        wallet_fee_base: 0,
        wallet_fee_percent: 0.05,
        wallet_fee_minimum: 1
    };

    export const enum Settings {
        VERSION = 'version',
        SELECTED_CURRENCY = 'selected_currency',
        CUSTOM_CURRENCY_RATE = 'custom_currency_rate',
        CUSTOM_CURRENCY_NAME = 'custom_currency_name',
        CAN_EXPAND_SCREENSHOTS = 'can_expand_screenshots',
        EXPAND_SCREENSHOTS_BACKDROP = 'expand_screenshots_backdrop',
        DIFFERENCE_DOMINATOR = 'difference_dominator',
        APPLY_STEAM_TAX = 'apply_steam_tax',
        APPLY_CURRENCY_TO_DIFFERENCE = 'apply_currency_to_difference',
        EXPAND_TYPE = 'expand_type',
        CUSTOM_FOP = 'custom_fop',
        DEFAULT_SORT_BY = 'default_sort_by',
        DEFAULT_STICKER_SEARCH = 'default_sticker_search',
        STORED_CUSTOM_STICKER_SEARCH = 'stored_custom_sticker_search',
        LEECH_CONTRIBUTOR_KEY = 'leech_contributor_key',
        SHOW_TOAST_ON_ACTION = 'show_toast_on_action',
        LISTING_OPTIONS = 'listing_options',
        SHOW_FLOAT_BAR = 'show_float_bar',
        COLOR_LISTINGS = 'color_listings',
        DATA_PROTECTION = 'data_protection',
        COLOR_SCHEME = 'color_scheme',
        USE_SCHEME = 'use_scheme',
        LOCATION_RELOAD_NEWEST = 'location_reload_newest',

        // 2.2.0 -> setting will be moved to advanced settings
        EXPERIMENTAL_ALLOW_FAVOURITE_BARGAIN = 'allow_favourite_bargain',
        // 2.2.0 -> setting will be removed, default procedure
        EXPERIMENTAL_ADJUST_POPULAR = 'experimental_adjust_popular',
        // 2.2.0 -> setting will be merged into show toast on action
        EXPERIMENTAL_FETCH_NOTIFICATION = 'experimental_fetch_notification',
        // [TBA] -> setting will be moved to advanced settings
        EXPERIMENTAL_FETCH_FAVOURITE_BARGAIN_STATUS = 'fetch_favourite_bargain_status',
        // [TBA] -> setting will be moved to advanced settings
        EXPERIMENTAL_FETCH_ITEM_PRICE_HISTORY = 'fetch_item_price_history',
        // 2.2.0 -> setting will be moved to advanced settings
        EXPERIMENTAL_ADJUST_MARKET_CURRENCY = 'adjust_market_currency',
        // 2.2.0 -> setting will be moved to advanced settings
        EXPERIMENTAL_FORMAT_CURRENCY = 'format_currency',
        // 2.2.0 -> setting will be removed, default procedure
        EXPERIMENTAL_ADJUST_SHOP = 'experimental_adjust_shop',
        // 2.2.0 -> setting will be removed, default procedure
        EXPERIMENTAL_ADJUST_SHARE = 'experimental_adjust_share',
        // 2.2.0 -> setting will be moved to advanced settings
        EXPERIMENTAL_ALLOW_BULK_BUY = 'allow_bulk_buy',
        // 2.2.0 -> setting will be moved to advanced settings
        EXPERIMENTAL_AUTOMATIC_BARGAIN = 'automatic_bargain',
        // 2.2.0 -> setting will be moved to advanced settings
        EXPERIMENTAL_AUTOMATIC_BARGAIN_DEFAULT = 'automatic_bargain_default',
        // 2.2.0 -> setting will be moved to advanced settings
        EXPERIMENTAL_SHOW_LISTING_DATE = 'show_listing_date',
        // 2.2.0 -> setting will become default
        EXPERIMENTAL_ADJUST_TRADE_RECORDS = 'adjust_trade_records',

        STORE_DANGER_AGREEMENTS = 'store_danger_agreements',

        // PSE MIGRATION
        PSE_ADVANCED_PAGE_NAVIGATION = 'pse_advanced_page_navigation',
        PSE_ADVANCED_PAGE_NAVIGATION_SIZE = 'pse_advanced_page_navigation_size',
        PSE_CALCULATE_BUYORDER_SUMMARY = 'pse_calculate_buyorder_summary',
        PSE_BUYORDER_CANCEL_CONFIRMATION = 'pse_buyorder_cancel_confirmation',
        PSE_BUYORDER_SCROLLING = 'pse_buyorder_scrolling',
        PSE_GRAPH_SHOW_YEARS = 'pse_graph_show_years',
        PSE_GRAPH_SHOW_VOLUME = 'pse_graph_show_volume',
        PSE_FORCE_ITEM_ACTIVITY = 'pse_force_item_activity',
        PSE_ADD_VIEW_ON_BUFF = 'pse_add_view_on_buff',
        PSE_HIDE_ACCOUNT_DETAILS = 'pse_hide_account_details',
        PSE_MERGE_ACTIVE_LISTINGS = 'pse_merge_active_listings'
    }

    type SettingsTypes = {
        [Settings.VERSION]: string;
        [Settings.SELECTED_CURRENCY]: string;
        [Settings.CUSTOM_CURRENCY_RATE]: number;
        [Settings.CUSTOM_CURRENCY_NAME]: string;
        [Settings.CAN_EXPAND_SCREENSHOTS]: boolean;
        [Settings.EXPAND_SCREENSHOTS_BACKDROP]: boolean;
        [Settings.DIFFERENCE_DOMINATOR]: DifferenceDominator;
        [Settings.APPLY_STEAM_TAX]: boolean;
        [Settings.APPLY_CURRENCY_TO_DIFFERENCE]: boolean;
        [Settings.EXPAND_TYPE]: ExpandScreenshotType;
        [Settings.CUSTOM_FOP]: FOP_VALUES;
        [Settings.DEFAULT_SORT_BY]: FILTER_SORT_BY;
        [Settings.DEFAULT_STICKER_SEARCH]: FILTER_STICKER_SEARCH;
        [Settings.STORED_CUSTOM_STICKER_SEARCH]: string;
        [Settings.LEECH_CONTRIBUTOR_KEY]: string;
        [Settings.SHOW_TOAST_ON_ACTION]: boolean;
        [Settings.LISTING_OPTIONS]: boolean[];
        [Settings.SHOW_FLOAT_BAR]: boolean;
        [Settings.COLOR_LISTINGS]: [boolean, boolean];
        [Settings.DATA_PROTECTION]: boolean;
        [Settings.COLOR_SCHEME]: string[];
        [Settings.USE_SCHEME]: boolean;
        [Settings.LOCATION_RELOAD_NEWEST]: LOCATION_RELOAD_NEWEST_VALUES;

        // Experimental

        [Settings.EXPERIMENTAL_ALLOW_FAVOURITE_BARGAIN]: boolean;
        [Settings.EXPERIMENTAL_ADJUST_POPULAR]: boolean;
        [Settings.EXPERIMENTAL_FETCH_NOTIFICATION]: boolean;
        [Settings.EXPERIMENTAL_FETCH_FAVOURITE_BARGAIN_STATUS]: boolean;
        [Settings.EXPERIMENTAL_FETCH_ITEM_PRICE_HISTORY]: PriceHistoryRange;
        [Settings.EXPERIMENTAL_ADJUST_MARKET_CURRENCY]: boolean;
        [Settings.EXPERIMENTAL_FORMAT_CURRENCY]: boolean;
        [Settings.EXPERIMENTAL_ADJUST_SHOP]: boolean;
        [Settings.EXPERIMENTAL_ADJUST_SHARE]: boolean;
        [Settings.EXPERIMENTAL_ALLOW_BULK_BUY]: boolean;
        [Settings.EXPERIMENTAL_AUTOMATIC_BARGAIN]: boolean;
        [Settings.EXPERIMENTAL_AUTOMATIC_BARGAIN_DEFAULT]: number;
        [Settings.EXPERIMENTAL_SHOW_LISTING_DATE]: boolean;
        [Settings.EXPERIMENTAL_ADJUST_TRADE_RECORDS]: boolean;

        // Misc

        [Settings.STORE_DANGER_AGREEMENTS]: boolean[];

        // PSE

        [Settings.PSE_ADVANCED_PAGE_NAVIGATION]: boolean;
        [Settings.PSE_ADVANCED_PAGE_NAVIGATION_SIZE]: number;
        [Settings.PSE_CALCULATE_BUYORDER_SUMMARY]: boolean;
        [Settings.PSE_BUYORDER_CANCEL_CONFIRMATION]: boolean;
        [Settings.PSE_BUYORDER_SCROLLING]: boolean;
        [Settings.PSE_GRAPH_SHOW_YEARS]: boolean;
        [Settings.PSE_GRAPH_SHOW_VOLUME]: boolean;
        [Settings.PSE_FORCE_ITEM_ACTIVITY]: boolean;
        [Settings.PSE_ADD_VIEW_ON_BUFF]: boolean;
        [Settings.PSE_HIDE_ACCOUNT_DETAILS]: boolean;
        [Settings.PSE_MERGE_ACTIVE_LISTINGS]: boolean;
    }

    const DANGER_SETTINGS: Settings[] = [
        Settings.EXPERIMENTAL_FETCH_FAVOURITE_BARGAIN_STATUS,
        Settings.EXPERIMENTAL_FETCH_ITEM_PRICE_HISTORY
    ];

    const enum InternalStructureTransform {
        NONE = 0,
        BOOLEAN = 1,
        BOOLEAN_ARRAY = 2
    }

    type InternalSetting<T extends Settings> = {
        value?: SettingsTypes[T],
        resolved?: boolean,
        readonly default: SettingsTypes[T],
        readonly allowedValues?: SettingsTypes[T][],
        readonly export: string,
        readonly transform?: InternalStructureTransform,
        readonly validator: (key: Settings, value: any) => any
    };
    
    type InternalSettingStructure = {
        [key in Settings]: InternalSetting<key>
    }

    const INTERNAL_SETTINGS: InternalSettingStructure = {
        [Settings.VERSION]: {
            default: '2.1.8',
            export: '0x0',
            validator: validateNotNull
        },
        [Settings.SELECTED_CURRENCY]: {
            default: 'USD',
            export: '0x1',
            validator: validateNotNull
        },
        [Settings.CUSTOM_CURRENCY_RATE]: {
            default: 1,
            export: '0x2',
            validator: validateNumber
        },
        [Settings.CUSTOM_CURRENCY_NAME]: {
            default: 'CC',
            export: '0x3',
            validator: validateNotNull
        },
        [Settings.CAN_EXPAND_SCREENSHOTS]: {
            default: false,
            export: '0x6',
            transform: InternalStructureTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.EXPAND_SCREENSHOTS_BACKDROP]: {
            default: false,
            export: '0x7',
            transform: InternalStructureTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.DIFFERENCE_DOMINATOR]: {
            default: DifferenceDominator.STEAM,
            allowedValues: [
                DifferenceDominator.STEAM,
                DifferenceDominator.BUFF
            ],
            export: '0x8',
            validator: validatePropertyValue
        },
        [Settings.APPLY_STEAM_TAX]: {
            default: false,
            export: '0x9',
            transform: InternalStructureTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.APPLY_CURRENCY_TO_DIFFERENCE]: {
            default: false,
            export: '0x10',
            transform: InternalStructureTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.EXPAND_TYPE]: {
            default: ExpandScreenshotType.PREVIEW,
            allowedValues: [
                ExpandScreenshotType.PREVIEW,
                ExpandScreenshotType.INSPECT
            ],
            export: '0x11',
            validator: validatePropertyValue
        },
        [Settings.CUSTOM_FOP]: {
            default: FOP_VALUES.Auto,
            allowedValues: [
                FOP_VALUES.Auto,
                FOP_VALUES.w245xh230,
                FOP_VALUES.w490xh460,
                FOP_VALUES.w980xh920,
                FOP_VALUES.w1960xh1840,
                FOP_VALUES.w3920xh3680
            ],
            export: '0x12',
            validator: validatePropertyValue
        },
        [Settings.DEFAULT_SORT_BY]: {
            default: FILTER_SORT_BY.DEFAULT,
            allowedValues: [
                FILTER_SORT_BY.DEFAULT,
                FILTER_SORT_BY.NEWEST,
                FILTER_SORT_BY.PRICE_ASCENDING,
                FILTER_SORT_BY.PRICE_DESCENDING,
                FILTER_SORT_BY.FLOAT_ASCENDING,
                FILTER_SORT_BY.FLOAT_DESCENDING,
                FILTER_SORT_BY.HOT_DESCENDING,
                FILTER_SORT_BY.STICKER
            ],
            export: '0x13',
            validator: validatePropertyValue
        },
        [Settings.DEFAULT_STICKER_SEARCH]: {
            default: FILTER_STICKER_SEARCH.ALL,
            allowedValues: [
                FILTER_STICKER_SEARCH.ALL,
                FILTER_STICKER_SEARCH.STICKERS,
                FILTER_STICKER_SEARCH.STICKERS_100P,
                FILTER_STICKER_SEARCH.NO_STICKERS,
                FILTER_STICKER_SEARCH.QUAD_COMBOS,
                FILTER_STICKER_SEARCH.QUAD_COMBOS_100P,
                FILTER_STICKER_SEARCH.SAVE_CUSTOM
            ],
            export: '0x14',
            validator: validatePropertyValue
        },
        [Settings.STORED_CUSTOM_STICKER_SEARCH]: {
            default: '',
            export: '0x15',
            validator: validateNotNull
        },
        [Settings.LEECH_CONTRIBUTOR_KEY]: {
            default: '',
            export: '0x16',
            validator: validateNotNull
        },
        [Settings.SHOW_TOAST_ON_ACTION]: {
            default: false,
            export: '0x17',
            transform: InternalStructureTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.LISTING_OPTIONS]: {
            default: [true, true, true, true, false, false, false],
            export: '0x18',
            transform: InternalStructureTransform.BOOLEAN_ARRAY,
            validator: validateBooleanArray
        },
        [Settings.SHOW_FLOAT_BAR]: {
            default: true,
            export: '0x19',
            transform: InternalStructureTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.COLOR_LISTINGS]: {
            default: [false, false],
            export: '0x20',
            transform: InternalStructureTransform.BOOLEAN_ARRAY,
            validator: validateBooleanArray
        },
        [Settings.DATA_PROTECTION]: {
            default: true,
            export: '0x21',
            transform: InternalStructureTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.COLOR_SCHEME]: {
            default: ['#121212', '#1f1f1f', '#bfbfbf', '#696969'],
            export: '0x22',
            validator: validateColorArray
        },
        [Settings.USE_SCHEME]: {
            default: false,
            export: '0x23',
            transform: InternalStructureTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.LOCATION_RELOAD_NEWEST]: {
            default: LOCATION_RELOAD_NEWEST_VALUES.NONE,
            allowedValues: [
                LOCATION_RELOAD_NEWEST_VALUES.NONE,
                LOCATION_RELOAD_NEWEST_VALUES.BULK,
                LOCATION_RELOAD_NEWEST_VALUES.SORT,
                LOCATION_RELOAD_NEWEST_VALUES.CENTER,
                LOCATION_RELOAD_NEWEST_VALUES.LEFT
            ],
            export: '0x24',
            validator: validatePropertyValue
        },

        // Experimental

        [Settings.EXPERIMENTAL_ALLOW_FAVOURITE_BARGAIN]: {
            default: true,
            export: '2x1',
            transform: InternalStructureTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.EXPERIMENTAL_ADJUST_POPULAR]: {
            default: false,
            export: '2x2',
            transform: InternalStructureTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.EXPERIMENTAL_FETCH_NOTIFICATION]: {
            default: false,
            export: '2x3',
            transform: InternalStructureTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.EXPERIMENTAL_FETCH_FAVOURITE_BARGAIN_STATUS]: {
            default: false,
            export: '2x4',
            transform: InternalStructureTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.EXPERIMENTAL_FETCH_ITEM_PRICE_HISTORY]: {
            default: PriceHistoryRange.OFF,
            allowedValues: [
                PriceHistoryRange.OFF,
                PriceHistoryRange.WEEKLY,
                PriceHistoryRange.MONTHLY
            ],
            export: '2x5',
            validator: validatePropertyValue
        },
        [Settings.EXPERIMENTAL_ADJUST_MARKET_CURRENCY]: {
            default: false,
            export: '2x6',
            transform: InternalStructureTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.EXPERIMENTAL_FORMAT_CURRENCY]: {
            default: false,
            export: '2x7',
            transform: InternalStructureTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.EXPERIMENTAL_ADJUST_SHOP]: {
            default: true,
            export: '2x8',
            transform: InternalStructureTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.EXPERIMENTAL_ADJUST_SHARE]: {
            default: true,
            export: '2x9',
            transform: InternalStructureTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.EXPERIMENTAL_ALLOW_BULK_BUY]: {
            default: false,
            export: '2x10',
            transform: InternalStructureTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.EXPERIMENTAL_AUTOMATIC_BARGAIN]: {
            default: false,
            export: '2x11',
            transform: InternalStructureTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.EXPERIMENTAL_AUTOMATIC_BARGAIN_DEFAULT]: {
            default: 10,
            export: '2x13',
            validator: validateNumber
        },
        [Settings.EXPERIMENTAL_SHOW_LISTING_DATE]: {
            default: false,
            export: '2x12',
            transform: InternalStructureTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.EXPERIMENTAL_ADJUST_TRADE_RECORDS]: {
            default: true,
            export: '2x14',
            transform: InternalStructureTransform.BOOLEAN,
            validator: validateBoolean
        },

        // Misc

        [Settings.STORE_DANGER_AGREEMENTS]: {
            default: [false, false],
            export: '3x1',
            transform: InternalStructureTransform.BOOLEAN_ARRAY,
            validator: validateBooleanArray
        },

        // PSE

        [Settings.PSE_ADVANCED_PAGE_NAVIGATION]: {
            default: false,
            export: '9x1',
            transform: InternalStructureTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.PSE_ADVANCED_PAGE_NAVIGATION_SIZE]: {
            default: 10,
            export: '9x11',
            transform: InternalStructureTransform.NONE,
            validator: validateNumber
        },
        [Settings.PSE_CALCULATE_BUYORDER_SUMMARY]: {
            default: false,
            export: '9x2',
            transform: InternalStructureTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.PSE_BUYORDER_CANCEL_CONFIRMATION]: {
            default: true,
            export: '9x3',
            transform: InternalStructureTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.PSE_BUYORDER_SCROLLING]: {
            default: false,
            export: '9x4',
            transform: InternalStructureTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.PSE_GRAPH_SHOW_YEARS]: {
            default: true,
            export: '9x5',
            transform: InternalStructureTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.PSE_GRAPH_SHOW_VOLUME]: {
            default: false,
            export: '9x6',
            transform: InternalStructureTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.PSE_FORCE_ITEM_ACTIVITY]: {
            default: false,
            export: '9x7',
            transform: InternalStructureTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.PSE_ADD_VIEW_ON_BUFF]: {
            default: false,
            export: '9x8',
            transform: InternalStructureTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.PSE_HIDE_ACCOUNT_DETAILS]: {
            default: false,
            export: '9x9',
            transform: InternalStructureTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.PSE_MERGE_ACTIVE_LISTINGS]: {
            default: false,
            export: '9x10',
            transform: InternalStructureTransform.BOOLEAN,
            validator: validateBoolean
        }
    };

    // func validators

    function checkTypeValidation(key: Settings, targetType: string): void {
        if (!(typeof INTERNAL_SETTINGS[key].default == targetType)) {
            console.warn(`[BuffUtility] Tried validating ${key} as ${targetType}, should be validated as ${typeof INTERNAL_SETTINGS[key].default}`);
        }
    }

    function validateNotNull(key: Settings, value: any): any {
        if (value == null) {
            return INTERNAL_SETTINGS[key].default;
        } else {
            return value;
        }
    }

    function validateNumber(key: Settings, value: any): number {
        checkTypeValidation(key, 'number');

        if (!isFinite(+value) || +value == null) {
            return <number>INTERNAL_SETTINGS[key].default;
        } else {
            return +value;
        }
    }

    function _validateBoolean(value: any): boolean {
        if (typeof value == 'boolean') {
            return value;
        }

        if (typeof value == 'string') {
            return value == 'true';
        }

        return null;
    }

    function validateBoolean(key: Settings, value: any): boolean {
        checkTypeValidation(key, 'boolean');

        return _validateBoolean(value) ?? <boolean>INTERNAL_SETTINGS[key].default;
    }

    function validateBooleanArray(key: Settings, value: any): boolean[] {
        checkTypeValidation(key, 'object');

        value = value ?? INTERNAL_SETTINGS[key].default;

        let r = [];
        for (let i = 0, l = (<[]>INTERNAL_SETTINGS[key].default)?.length; i < l; i ++) {
            r[i] = _validateBoolean(value[i]) ?? INTERNAL_SETTINGS[key].default[i];
        }

        return r;
    }

    function _validateColor(value: any): string {
        return /#[0-9a-f]{6}/i.test(value) ? value : null;
    }

    function validateColor(key: Settings, value: any): string {
        checkTypeValidation(key, 'string');

        return _validateColor(value) ?? <string>INTERNAL_SETTINGS[key].default;
    }

    function validateColorArray(key: Settings, value: any): string[] {
        value = value ?? INTERNAL_SETTINGS[key].default;

        let r = [];
        for (let i = 0, l = (<[]>INTERNAL_SETTINGS[key].default)?.length; i < l; i ++) {
            r[i] = _validateColor(value[i]) ?? INTERNAL_SETTINGS[key].default[i];
        }

        return r;
    }

    function validatePropertyValue(key: Settings, value: any): any {
        const internal: InternalSetting<any> = INTERNAL_SETTINGS[key];
        const allowedValues: any[] = internal.allowedValues;

        if (!Array.isArray(allowedValues) || allowedValues?.length == 0) {
            throw new Error(`[BuffUtility] Attempted validating value for ${key} failed, no allowed values were set.`);
        }

        return allowedValues.indexOf(value) > -1 ? value : internal.default;
    }

    // general

    /**
     * Get the specified setting
     *
     * @param setting The value of the setting to get
     * @returns The value from the specified setting, return type is determined by passed setting
     */
    export async function getSetting<T extends Settings, R extends SettingsTypes[T]>(setting: T): Promise<R> {
        return await new Promise<R>((resolve, _) => {
            let internal: InternalSetting<any> = INTERNAL_SETTINGS[setting];

            // setting doesnt exist
            if (!internal) {
                console.debug(`[BuffUtility] Attempted loading setting ${setting} failed. Setting does not exist.`);
                resolve(null);
                return;
            }

            // if setting has been resolved (loaded) already, return value
            if (internal.resolved) {
                DEBUG && console.debug(`[BuffUtility] Loading already resolved setting ${setting} ->`, internal.value);
                resolve(internal.value);
                return;
            }

            BrowserInterface.Storage.get<any>(internal.export).then(value => {
                let newValue = value;
                switch (internal.transform ?? InternalStructureTransform.NONE) {
                    case InternalStructureTransform.NONE:
                        break;
                    case InternalStructureTransform.BOOLEAN:
                        // changed, only import 0 -> false and 1 -> true, anything else set to null
                        // to ensure validator takes default and doesn't set it to false outright
                        newValue = value === 0 || value === 1 ? value == 1 : null;

                        // forcefully disable for now until proxy works properly
                        if (setting == Settings.EXPERIMENTAL_FETCH_FAVOURITE_BARGAIN_STATUS || setting == Settings.EXPERIMENTAL_FETCH_ITEM_PRICE_HISTORY) {
                            newValue = false;
                        }

                        break;
                    case InternalStructureTransform.BOOLEAN_ARRAY:
                        newValue = Util.importBooleansFromBytes(value);
                        break;
                }

                let validator = internal.validator ?? ((_, value) => value);
                internal.value = validator(setting, newValue);

                internal.resolved = true;

                DEBUG && console.debug(`[BuffUtility] Resolved setting ${setting} (${internal.export}):`, value, '->', internal.value);

                resolve(internal.value);
            });
        });
    }

    /**
     * Set a new value for the specified setting <br>
     * Value will be checked by the specified setting validator
     *
     * @param setting The specified setting to update
     * @param newValue The new value of the setting
     */
    export function setSetting<T extends Settings, V extends SettingsTypes[T]>(setting: T, newValue: any | V): void {
        if (!(setting in INTERNAL_SETTINGS)) {
            console.debug(`[BuffUtility] Tried setting value for '${setting}', but that setting does not exist.`);
            return;
        }

        let oldValue: any = INTERNAL_SETTINGS[setting].value;

        let validator = INTERNAL_SETTINGS[setting].validator ?? ((_, value) => value);
        INTERNAL_SETTINGS[setting].value = validator(setting, newValue);

        console.debug(`[BuffUtility] Saved setting: ${setting}\n${oldValue} -> ${newValue}`);

        finalize(setting);
    }

    /**
     * Reset the specified setting to the default value
     *
     * @param setting
     */
    export function resetSetting<T extends Settings>(setting: T): void {
        console.debug(`[BuffUtility] Resetting '${setting}' to the default value.`);

        if (DANGER_SETTINGS.indexOf(setting) > -1) {
            setSetting(Settings.STORE_DANGER_AGREEMENTS, [false, false]);
        }

        setSetting(setting, INTERNAL_SETTINGS[setting].default);
    }

    /**
     * Resets all settings and clears browser storage
     */
    export async function resetAllSettings(): Promise<void> {
        await BrowserInterface.Storage.clear();
        const keys = <Settings[]>Object.keys(INTERNAL_SETTINGS);

        for (let key of keys) {
            resetSetting(key);
        }
    }

    /**
     * This will write the specified settings to the storage
     *
     * @param setting Define the setting to write, for optimization purposes
     */
    export function finalize(setting: Settings): void {
        let internal: InternalSetting<any> = INTERNAL_SETTINGS[setting];

        if (!internal) {
            DEBUG && console.debug(`[BuffUtility] Cannot finalize setting "${setting}", it does not exist.`);
            return;
        }

        let exportValue: any = null;
        switch (internal.transform ?? InternalStructureTransform.NONE) {
            case InternalStructureTransform.NONE:
                exportValue = internal.value;
                break;
            case InternalStructureTransform.BOOLEAN:
                exportValue = internal.value == true ? 1 : 0;
                break;
            case InternalStructureTransform.BOOLEAN_ARRAY:
                exportValue = Util.exportBooleansToBytes(<boolean[]>internal.value);
                break;
        }

        BrowserInterface.Storage.set({
            [internal.export]: exportValue
        }).then(_ => DEBUG && console.debug('[BuffUtility] Wrote setting:', setting, `(${internal.export})`, '->', exportValue));
    }

    /**
     * @deprecated
     *
     * @param setting
     */
    export function hasBeenAgreed(setting: Settings): boolean {
        switch (setting) {
            case Settings.EXPERIMENTAL_FETCH_FAVOURITE_BARGAIN_STATUS:
                return getSetting(Settings.STORE_DANGER_AGREEMENTS)[0];
            case Settings.EXPERIMENTAL_FETCH_ITEM_PRICE_HISTORY:
                return getSetting(Settings.STORE_DANGER_AGREEMENTS)[1];
            default:
                return false;
        }
    }

    // --- upgrade ~2.1.7 -> 2.1.8+

    /**
     * @deprecated
     */
    function _load217(): void {
        let tempSettings = Util.tryParseJson(Cookie.read(GlobalConstants.BUFF_UTILITY_SETTINGS));

        if (tempSettings) {
            const defaultKeys = Object.keys(INTERNAL_SETTINGS);

            for (let key of defaultKeys) {
                setSetting(<Settings>key, tempSettings[key]);
            }

            console.debug('[BuffUtility] Finished migrating Settings from ~2.1.6 to 2.1.8+');

            Cookie.write(GlobalConstants.BUFF_UTILITY_SETTINGS, '0', 0);
        }
    }

    // only attempt migration if we are browsing where the cookie once was present
    if (window.location.href.indexOf('buff.163.com') > -1) {
        _load217();
    }

}
