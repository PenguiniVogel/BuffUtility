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

    export const enum FopValues {
        Auto = '',
        w245xh230 = '?fop=imageView/2/w/245/h/230',
        w490xh460 = '?fop=imageView/2/w/490/h/460',
        w980xh920 = '?fop=imageView/2/w/980/h/920',
        w1960xh1840 = '?fop=imageView/2/w/1960/h/1840',
        w3920xh3680 = '?fop=imageView/2/w/3920/h/3680'
    }

    export const enum ReloadNewestLocation {
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

    export const enum FilterSortBy {
        DEFAULT = 'default',
        LATEST = 'created.desc',
        PRICE_ASCENDING = 'price.asc',
        PRICE_DESCENDING = 'price.desc',
        FLOAT_ASCENDING = 'paintwear.asc',
        FLOAT_DESCENDING = 'paintwear.desc',
        HOT_DESCENDING = 'heat.desc',
        STICKER = 'sticker.desc',
        TIME_COST = 'seller.asc'
    }

    export const enum FilterStickerSearch {
        ALL = '',
        STICKERS = '&extra_tag_ids=non_empty',
        STICKERS_100P = '&extra_tag_ids=non_empty&wearless_sticker=1',
        NO_STICKERS = '&extra_tag_ids=empty',
        QUAD_COMBOS = '&extra_tag_ids=squad_combos',
        QUAD_COMBOS_100P = '&extra_tag_ids=squad_combos&wearless_sticker=1',
        SAVE_CUSTOM = '&extra_tag_ids=$1'
    }

    export const enum ListingDifferenceStyle {
        NONE = 0,
        CURRENCY_DIFFERENCE = 1,
        CONVERTED_CURRENCY_DIFFERENCE = 2,
        PERCENTAGE_DIFFERENCE = 3
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
        LISTING_DIFFERENCE_STYLE = 'listing_difference_style',
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

        EXPERIMENTAL_ALLOW_FAVOURITE_BARGAIN = 'allow_favourite_bargain',
        EXPERIMENTAL_ADJUST_POPULAR = 'experimental_adjust_popular',
        EXPERIMENTAL_FETCH_NOTIFICATION = 'experimental_fetch_notification',
        EXPERIMENTAL_FETCH_FAVOURITE_BARGAIN_STATUS = 'fetch_favourite_bargain_status',
        EXPERIMENTAL_FETCH_ITEM_PRICE_HISTORY = 'fetch_item_price_history',
        EXPERIMENTAL_ADJUST_MARKET_CURRENCY = 'adjust_market_currency',
        EXPERIMENTAL_FORMAT_CURRENCY = 'format_currency',
        EXPERIMENTAL_ADJUST_SHOP = 'experimental_adjust_shop',
        EXPERIMENTAL_ADJUST_SHARE = 'experimental_adjust_share',
        EXPERIMENTAL_ALLOW_BULK_BUY = 'allow_bulk_buy',
        EXPERIMENTAL_AUTOMATIC_BARGAIN = 'automatic_bargain',
        EXPERIMENTAL_AUTOMATIC_BARGAIN_DEFAULT = 'automatic_bargain_default',
        EXPERIMENTAL_SHOW_LISTING_DATE = 'show_listing_date',
        EXPERIMENTAL_ADJUST_TRADE_RECORDS = 'adjust_trade_records',
        EXPERIMENTAL_SHOW_SOUVENIR_TEAMS = 'show_souvenir_teams',
        EXPERIMENTAL_FETCH_LISTING_SPP = 'fetch_listing_spp',
        EXPERIMENTAL_PREFERRED_PAYMENT_METHODS = 'preferred_payment_methods',

        ALLOW_EXTENSION_REQUESTS = 'allow_extension_requests',

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
        PSE_MERGE_ACTIVE_LISTINGS = 'pse_merge_active_listings',
        PSE_GRAPH_CUMULATE_RECENT = 'pse_graph_cumulate_recent',
        PSE_COLLAPSE_ACCOUNT_DETAILS = 'pse_collapse_account_details',

        // Modules
        MODULE_ADJUST_FAVOURITES = 'module_adjust_favourites',
        MODULE_ADJUST_LISTINGS = 'module_adjust_listings',
        MODULE_ADJUST_MARKET = 'module_adjust_market',
        MODULE_ADJUST_SALES = 'module_adjust_sales',
        MODULE_ADJUST_SETTINGS = 'module_adjust_settings',
        MODULE_ADJUST_SHARE = 'module_adjust_share',
        MODULE_ADJUST_SHOP = 'module_adjust_shop',
        MODULE_PSE_LISTINGS = 'module_pse_listings',
        MODULE_PSE_MARKET = 'module_pse_market',
        MODULE_PSE_TRANSFORMGRAPH = 'module_pse_transformgraph',
    }

    type InternalSettingsTypes = {
        [Settings.VERSION]: string;
        [Settings.SELECTED_CURRENCY]: string;
        [Settings.CUSTOM_CURRENCY_RATE]: number;
        [Settings.CUSTOM_CURRENCY_NAME]: string;
        [Settings.CAN_EXPAND_SCREENSHOTS]: boolean;
        [Settings.EXPAND_SCREENSHOTS_BACKDROP]: boolean;
        [Settings.DIFFERENCE_DOMINATOR]: DifferenceDominator;
        [Settings.APPLY_STEAM_TAX]: boolean;
        [Settings.LISTING_DIFFERENCE_STYLE]: ListingDifferenceStyle;
        [Settings.EXPAND_TYPE]: ExpandScreenshotType;
        [Settings.CUSTOM_FOP]: FopValues;
        [Settings.DEFAULT_SORT_BY]: FilterSortBy;
        [Settings.DEFAULT_STICKER_SEARCH]: FilterStickerSearch;
        [Settings.STORED_CUSTOM_STICKER_SEARCH]: string;
        [Settings.LEECH_CONTRIBUTOR_KEY]: string;
        [Settings.SHOW_TOAST_ON_ACTION]: boolean;
        [Settings.LISTING_OPTIONS]: boolean[];
        [Settings.SHOW_FLOAT_BAR]: boolean;
        [Settings.COLOR_LISTINGS]: boolean[];
        [Settings.DATA_PROTECTION]: boolean;
        [Settings.COLOR_SCHEME]: string[];
        [Settings.USE_SCHEME]: boolean;
        [Settings.LOCATION_RELOAD_NEWEST]: ReloadNewestLocation;

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
        [Settings.EXPERIMENTAL_SHOW_SOUVENIR_TEAMS]: boolean;
        [Settings.EXPERIMENTAL_FETCH_LISTING_SPP]: boolean;
        [Settings.EXPERIMENTAL_PREFERRED_PAYMENT_METHODS]: boolean[];

        // Misc

        [Settings.ALLOW_EXTENSION_REQUESTS]: boolean;

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
        [Settings.PSE_GRAPH_CUMULATE_RECENT]: boolean;
        [Settings.PSE_COLLAPSE_ACCOUNT_DETAILS]: boolean;

        // Modules

        [Settings.MODULE_ADJUST_FAVOURITES]: boolean;
        [Settings.MODULE_ADJUST_LISTINGS]: boolean;
        [Settings.MODULE_ADJUST_MARKET]: boolean;
        [Settings.MODULE_ADJUST_SALES]: boolean;
        [Settings.MODULE_ADJUST_SETTINGS]: boolean;
        [Settings.MODULE_ADJUST_SHARE]: boolean;
        [Settings.MODULE_ADJUST_SHOP]: boolean;
        [Settings.MODULE_PSE_LISTINGS]: boolean;
        [Settings.MODULE_PSE_MARKET]: boolean;
        [Settings.MODULE_PSE_TRANSFORMGRAPH]: boolean;
    }

    // this type holds settings types which change from their internal stored format
    type SettingsTypesTransformed = {
        [Settings.COLOR_LISTINGS]: [boolean, boolean];
        [Settings.EXPERIMENTAL_PREFERRED_PAYMENT_METHODS]: number[]
    };

    // this type omits the transformed setting keys from the internal structure to correctly propagate it
    type ReturnSettingsTypes = Omit<InternalSettingsTypes, keyof SettingsTypesTransformed> & SettingsTypesTransformed;

    const requireRequestSettings: Settings[] = [
        Settings.EXPERIMENTAL_FETCH_FAVOURITE_BARGAIN_STATUS,
        Settings.EXPERIMENTAL_FETCH_ITEM_PRICE_HISTORY,
        Settings.EXPERIMENTAL_FETCH_LISTING_SPP
    ];

    const enum InternalSettingExportTransform {
        NONE = 0,
        BOOLEAN = 1,
        BOOLEAN_ARRAY = 2
    }

    type InternalSetting<T extends Settings> = {
        /**
         * This will always hold the internal format value
         */
        value?: InternalSettingsTypes[T],
        /**
         * If this setting has been loaded
         */
        resolved?: boolean,
        /**
         * This will hold the transformed value
         */
        transformedValue?: ReturnSettingsTypes[T],
        /**
         * The default value this setting should take if invalid or unset
         */
        readonly default: InternalSettingsTypes[T],
        /**
         * A list of allowed values in cases where they need to be restricted
         */
        readonly allowedValues?: InternalSettingsTypes[T][],
        /**
         * The export key where the value is stored, sort of like a memory address
         */
        readonly export: string,
        /**
         * The validator this setting should use
         */
        readonly validator: (key: T, value: any) => InternalSettingsTypes[T],
        /**
         * The transform function to translate the stored value type into the return type
         */
        readonly transformFunction?: (value: InternalSettingsTypes[T]) => ReturnSettingsTypes[T]
    } & (InternalSettingsTypes[T] extends boolean ? {
        /**
         * This setting is a boolean and will be appropriately transformed into 0 or 1 to save data
         */
        readonly exportTransform: InternalSettingExportTransform.BOOLEAN
    } : InternalSettingsTypes[T] extends boolean[] ? {
        /**
         * This setting is a boolean array and will be appropriately transformed, see {@link Util.exportBooleansToBytes}
         */
        readonly exportTransform: InternalSettingExportTransform.BOOLEAN_ARRAY
    } : {
        /**
         * This setting requires no export handing, property is optional
         */
        readonly exportTransform?: InternalSettingExportTransform.NONE
    });
    
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
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.EXPAND_SCREENSHOTS_BACKDROP]: {
            default: false,
            export: '0x7',
            exportTransform: InternalSettingExportTransform.BOOLEAN,
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
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.LISTING_DIFFERENCE_STYLE]: {
            default: ListingDifferenceStyle.CURRENCY_DIFFERENCE,
            allowedValues: [
                ListingDifferenceStyle.NONE,
                ListingDifferenceStyle.CURRENCY_DIFFERENCE,
                ListingDifferenceStyle.CONVERTED_CURRENCY_DIFFERENCE,
                ListingDifferenceStyle.PERCENTAGE_DIFFERENCE
            ],
            export: '0x25',
            validator: validatePropertyValue
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
            default: FopValues.Auto,
            allowedValues: [
                FopValues.Auto,
                FopValues.w245xh230,
                FopValues.w490xh460,
                FopValues.w980xh920,
                FopValues.w1960xh1840,
                FopValues.w3920xh3680
            ],
            export: '0x12',
            validator: validatePropertyValue
        },
        [Settings.DEFAULT_SORT_BY]: {
            default: FilterSortBy.DEFAULT,
            allowedValues: [
                FilterSortBy.DEFAULT,
                FilterSortBy.LATEST,
                FilterSortBy.PRICE_ASCENDING,
                FilterSortBy.PRICE_DESCENDING,
                FilterSortBy.FLOAT_ASCENDING,
                FilterSortBy.FLOAT_DESCENDING,
                FilterSortBy.HOT_DESCENDING,
                FilterSortBy.STICKER,
                FilterSortBy.TIME_COST
            ],
            export: '0x13',
            validator: validatePropertyValue
        },
        [Settings.DEFAULT_STICKER_SEARCH]: {
            default: FilterStickerSearch.ALL,
            allowedValues: [
                FilterStickerSearch.ALL,
                FilterStickerSearch.STICKERS,
                FilterStickerSearch.STICKERS_100P,
                FilterStickerSearch.NO_STICKERS,
                FilterStickerSearch.QUAD_COMBOS,
                FilterStickerSearch.QUAD_COMBOS_100P,
                FilterStickerSearch.SAVE_CUSTOM
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
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.LISTING_OPTIONS]: {
            default: [true, true, true, true, false, false, false],
            export: '0x18',
            exportTransform: InternalSettingExportTransform.BOOLEAN_ARRAY,
            validator: validateBooleanArray
        },
        [Settings.SHOW_FLOAT_BAR]: {
            default: true,
            export: '0x19',
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.COLOR_LISTINGS]: {
            default: [false, false],
            export: '0x20',
            exportTransform: InternalSettingExportTransform.BOOLEAN_ARRAY,
            validator: validateBooleanArray
        },
        [Settings.DATA_PROTECTION]: {
            default: true,
            export: '0x21',
            exportTransform: InternalSettingExportTransform.BOOLEAN,
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
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.LOCATION_RELOAD_NEWEST]: {
            default: ReloadNewestLocation.NONE,
            allowedValues: [
                ReloadNewestLocation.NONE,
                ReloadNewestLocation.BULK,
                ReloadNewestLocation.SORT,
                ReloadNewestLocation.CENTER,
                ReloadNewestLocation.LEFT
            ],
            export: '0x24',
            validator: validatePropertyValue
        },

        // Experimental

        [Settings.EXPERIMENTAL_ALLOW_FAVOURITE_BARGAIN]: {
            default: true,
            export: '2x1',
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.EXPERIMENTAL_ADJUST_POPULAR]: {
            default: false,
            export: '2x2',
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.EXPERIMENTAL_FETCH_NOTIFICATION]: {
            default: false,
            export: '2x3',
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.EXPERIMENTAL_FETCH_FAVOURITE_BARGAIN_STATUS]: {
            default: false,
            export: '2x4',
            exportTransform: InternalSettingExportTransform.BOOLEAN,
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
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.EXPERIMENTAL_FORMAT_CURRENCY]: {
            default: false,
            export: '2x7',
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.EXPERIMENTAL_ADJUST_SHOP]: {
            default: true,
            export: '2x8',
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.EXPERIMENTAL_ADJUST_SHARE]: {
            default: true,
            export: '2x9',
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.EXPERIMENTAL_ALLOW_BULK_BUY]: {
            default: false,
            export: '2x10',
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.EXPERIMENTAL_AUTOMATIC_BARGAIN]: {
            default: false,
            export: '2x11',
            exportTransform: InternalSettingExportTransform.BOOLEAN,
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
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.EXPERIMENTAL_ADJUST_TRADE_RECORDS]: {
            default: true,
            export: '2x14',
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.EXPERIMENTAL_SHOW_SOUVENIR_TEAMS]: {
            default: false,
            export: '2x15',
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.EXPERIMENTAL_FETCH_LISTING_SPP]: {
            default: false,
            export: '2x16',
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.EXPERIMENTAL_PREFERRED_PAYMENT_METHODS]: {
            default: [true, true, true, true, true],
            export: '2x17',
            exportTransform: InternalSettingExportTransform.BOOLEAN_ARRAY,
            validator: validateBooleanArray,
            transformFunction(values) {
                let r: number[] = [];

                // BUFF balance-Alipay
                if (values[0]) {
                    r.push(3);
                }

                // Alipay - Credit card
                if (values[1]) {
                    r.push(10);
                }

                // BUFF Balance-Bank Card
                if (values[2]) {
                    r.push(1);
                }

                // WeChat Pay
                if (values[3]) {
                    r.push(6);
                }

                // WeChat Split Payment
                if (values[4]) {
                    r.push(18);
                }

                return r;
            }
        },

        // Misc

        [Settings.ALLOW_EXTENSION_REQUESTS]: {
            default: false,
            export: '3x1',
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },

        // PSE

        [Settings.PSE_ADVANCED_PAGE_NAVIGATION]: {
            default: false,
            export: '9x1',
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.PSE_ADVANCED_PAGE_NAVIGATION_SIZE]: {
            default: 10,
            export: '9x11',
            validator: validateNumber
        },
        [Settings.PSE_CALCULATE_BUYORDER_SUMMARY]: {
            default: false,
            export: '9x2',
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.PSE_BUYORDER_CANCEL_CONFIRMATION]: {
            default: true,
            export: '9x3',
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.PSE_BUYORDER_SCROLLING]: {
            default: false,
            export: '9x4',
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.PSE_GRAPH_SHOW_YEARS]: {
            default: true,
            export: '9x5',
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.PSE_GRAPH_SHOW_VOLUME]: {
            default: false,
            export: '9x6',
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.PSE_FORCE_ITEM_ACTIVITY]: {
            default: false,
            export: '9x7',
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.PSE_ADD_VIEW_ON_BUFF]: {
            default: false,
            export: '9x8',
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.PSE_HIDE_ACCOUNT_DETAILS]: {
            default: false,
            export: '9x9',
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.PSE_MERGE_ACTIVE_LISTINGS]: {
            default: false,
            export: '9x10',
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.PSE_GRAPH_CUMULATE_RECENT]: {
            default: false,
            export: '9x12',
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.PSE_COLLAPSE_ACCOUNT_DETAILS]: {
            default: false,
            export: '9x13',
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },

        // Modules

        [Settings.MODULE_ADJUST_FAVOURITES]: {
            default: true,
            export: 'Mx0',
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.MODULE_ADJUST_LISTINGS]: {
            default: true,
            export: 'Mx1',
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.MODULE_ADJUST_MARKET]: {
            default: true,
            export: 'Mx2',
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.MODULE_ADJUST_SALES]: {
            default: true,
            export: 'Mx3',
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.MODULE_ADJUST_SETTINGS]: {
            default: true,
            export: 'Mx4',
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.MODULE_ADJUST_SHARE]: {
            default: true,
            export: 'Mx5',
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.MODULE_ADJUST_SHOP]: {
            default: true,
            export: 'Mx6',
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.MODULE_PSE_LISTINGS]: {
            default: true,
            export: 'Mx7',
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.MODULE_PSE_MARKET]: {
            default: true,
            export: 'Mx8',
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.MODULE_PSE_TRANSFORMGRAPH]: {
            default: true,
            export: 'Mx10',
            exportTransform: InternalSettingExportTransform.BOOLEAN,
            validator: validateBoolean
        }
    };

    // validate the export keys to make sure one doesn't get used twice
    function checkInternalSettings(): void {
        const keys = Object.keys(INTERNAL_SETTINGS);
        let usedExports: string[] = [];
        for (let key of keys) {
            let internal: InternalSetting<any> = INTERNAL_SETTINGS[key];

            if (usedExports.indexOf(internal.export) > -1) {
                console.error(`[BuffUtility] Export key ${internal.export} for ${key} has already been defined, please check.`);
            }

            usedExports.push(internal.export);
        }
    }

    checkInternalSettings();

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

    function validateBooleanArray<T extends Settings>(key: T, value: any): boolean[] {
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
    export async function getSetting<T extends Settings, R extends ReturnSettingsTypes[T]>(setting: T): Promise<R> {
        let forceDefault = false;
        if (isRequireRequestSettings(setting)) {
            // if we can't read require-request settings, return their default
            if (!await _internal_getSetting(Settings.ALLOW_EXTENSION_REQUESTS)) {
                forceDefault = true;
            }
        }

        return await _internal_getSetting(setting, forceDefault);
    }

    /**
     * The internal setting resolver
     *
     * @param setting
     * @param forceDefault
     * @private
     */
    async function _internal_getSetting<T extends Settings, R extends ReturnSettingsTypes[T]>(setting: T, forceDefault: boolean = false): Promise<R> {
        return await new Promise<R>((resolve, _) => {
            const start = Date.now();
            let internal: InternalSetting<any> = INTERNAL_SETTINGS[setting];

            // setting doesnt exist
            if (!internal) {
                console.debug(`[BuffUtility] Attempted loading setting ${setting} failed. Setting does not exist.`);
                resolve(null);
                return;
            }

            // if setting has been resolved (loaded) already, return value
            if (internal.resolved) {
                resolve(internal.transformedValue ?? internal.value);
                return;
            }

            BrowserInterface.Storage.get<any>(internal.export).then(value => {
                let newValue = value;
                switch (internal.exportTransform ?? InternalSettingExportTransform.NONE) {
                    case InternalSettingExportTransform.NONE:
                        break;
                    case InternalSettingExportTransform.BOOLEAN:
                        // changed, only import 0 -> false and 1 -> true, anything else set to null
                        // to ensure validator takes default and doesn't set it to false outright
                        newValue = value === 0 || value === 1 ? value == 1 : null;
                        break;
                    case InternalSettingExportTransform.BOOLEAN_ARRAY:
                        newValue = Util.importBooleansFromBytes(value);
                        break;
                }

                // if default is forced, use default, otherwise validate
                // yeah ternary operators ugly bla bla, I don't like if trees either
                internal.value = forceDefault ?
                    internal.default : (
                        internal.validator == null ?
                            newValue : internal.validator(setting, newValue)
                    );

                let debugMessage = [`[BuffUtility] Resolved setting ${setting} (${internal.export}):`, value, '->', internal.value, forceDefault ? '(Forced Default)' : ''];

                if (internal.transformFunction != null) {
                    internal.transformedValue = internal.transformFunction(internal.value);

                    debugMessage.push('transformed -> ', internal.transformedValue);
                }

                internal.resolved = true;

                DEBUG && console.debug(...debugMessage);

                resolve(internal.transformedValue ?? internal.value);
            });
        });
    }

    /**
     * Check if setting is a require-request one
     *
     * @param setting
     * @private
     */
    function isRequireRequestSettings(setting: Settings): boolean {
        return setting in requireRequestSettings;
    }

    /**
     * Set a new value for the specified setting <br>
     * Value will be checked by the specified setting validator
     *
     * @param setting The specified setting to update
     * @param newValue The new value of the setting
     */
    export function setSetting<T extends Settings, V extends InternalSettingsTypes[T]>(setting: T, newValue: any | V): void {
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
        switch (internal.exportTransform ?? InternalSettingExportTransform.NONE) {
            case InternalSettingExportTransform.NONE:
                exportValue = internal.value;
                break;
            case InternalSettingExportTransform.BOOLEAN:
                exportValue = internal.value == true ? 1 : 0;
                break;
            case InternalSettingExportTransform.BOOLEAN_ARRAY:
                exportValue = Util.exportBooleansToBytes(<boolean[]>internal.value);
                break;
        }

        BrowserInterface.Storage.set({
            [internal.export]: exportValue
        }).then(_ => DEBUG && console.debug('[BuffUtility] Wrote setting:', setting, `(${internal.export})`, '->', exportValue));
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
