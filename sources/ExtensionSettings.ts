module ExtensionSettings {

    export const enum DifferenceDominator {
        STEAM,
        BUFF
    }

    export const enum ExpandScreenshotType {
        PREVIEW,
        INSPECT
    }

    export const enum FOP_VALUES {
       Auto,
       w245xh230,
       w490xh460,
       w980xh920,
       w1960xh1840,
       w3920xh3680,
    }

    export const enum LOCATION_RELOAD_NEWEST_VALUES {
        NONE,
        BULK,
        SORT,
        CENTER,
        LEFT
    }

    export const enum PriceHistoryRange {
        OFF = 0,
        WEEKLY = 7,
        MONTHLY = 30
    }

    export const enum CurrencyNumberFormats {
        NONE,
        FORMATTED,
        COMPRESSED,
        SPACE_MATCH
    }

    export const FILTER_SORT_BY = {
        'Default': 'default',
        'Newest': 'created.desc',
        'Price Ascending': 'price.asc',
        'Price Descending': 'price.desc',
        'Float Ascending': 'paintwear.asc',
        'Float Descending': 'paintwear.desc',
        'Hot Descending': 'heat.desc'
    };

    export const FILTER_STICKER_SEARCH = {
        'All': '',
        'Stickers': '&extra_tag_ids=non_empty',
        'Stickers 100%': '&extra_tag_ids=non_empty&wearless_sticker=1',
        'No Stickers': '&extra_tag_ids=empty',
        'Quad Combos': '&extra_tag_ids=squad_combos',
        'Quad Combos 100%': '&extra_tag_ids=squad_combos&wearless_sticker=1',
        'Save Custom': '&extra_tag_ids=$1'
    };

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
        CUSTOM_CURRENCY_CALCULATED_RATE = 'custom_currency_calculated_rate',
        CUSTOM_CURRENCY_LEADING_ZEROS = 'custom_currency_leading_zeros',
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

        // 2.1.9 -> setting will be moved to advanced settings
        EXPERIMENTAL_ALLOW_FAVOURITE_BARGAIN = 'allow_favourite_bargain',
        // 2.1.9 -> setting will be removed, default procedure
        EXPERIMENTAL_ADJUST_POPULAR = 'experimental_adjust_popular',
        // 2.1.9 -> setting will be merged into show toast on action
        EXPERIMENTAL_FETCH_NOTIFICATION = 'experimental_fetch_notification',
        // [TBA] -> setting will be moved to advanced settings
        EXPERIMENTAL_FETCH_FAVOURITE_BARGAIN_STATUS = 'fetch_favourite_bargain_status',
        // [TBA] -> setting will be moved to advanced settings
        EXPERIMENTAL_FETCH_ITEM_PRICE_HISTORY = 'fetch_item_price_history',
        // 2.1.9 -> setting will be moved to advanced settings
        EXPERIMENTAL_ADJUST_MARKET_CURRENCY = 'adjust_market_currency',
        // 2.1.9 -> setting will be moved to advanced settings
        EXPERIMENTAL_FORMAT_CURRENCY = 'format_currency',
        // [TBA] -> setting will be removed, default procedure
        EXPERIMENTAL_ADJUST_SHOP = 'experimental_adjust_shop',


        STORE_DANGER_AGREEMENTS = 'store_danger_agreements'
    }

    type SettingsTypes = {
        [Settings.VERSION]: string;
        [Settings.SELECTED_CURRENCY]: string;
        [Settings.CUSTOM_CURRENCY_RATE]: number;
        [Settings.CUSTOM_CURRENCY_NAME]: string;
        [Settings.CUSTOM_CURRENCY_CALCULATED_RATE]: number;
        [Settings.CUSTOM_CURRENCY_LEADING_ZEROS]: number;
        [Settings.CAN_EXPAND_SCREENSHOTS]: boolean;
        [Settings.EXPAND_SCREENSHOTS_BACKDROP]: boolean;
        [Settings.DIFFERENCE_DOMINATOR]: DifferenceDominator;
        [Settings.APPLY_STEAM_TAX]: boolean;
        [Settings.APPLY_CURRENCY_TO_DIFFERENCE]: boolean;
        [Settings.EXPAND_TYPE]: ExpandScreenshotType;
        [Settings.CUSTOM_FOP]: number;
        [Settings.DEFAULT_SORT_BY]: string;
        [Settings.DEFAULT_STICKER_SEARCH]: string;
        [Settings.STORED_CUSTOM_STICKER_SEARCH]: string;
        [Settings.LEECH_CONTRIBUTOR_KEY]: string;
        [Settings.SHOW_TOAST_ON_ACTION]: boolean;
        [Settings.LISTING_OPTIONS]: boolean[];
        [Settings.SHOW_FLOAT_BAR]: boolean;
        [Settings.COLOR_LISTINGS]: [boolean, boolean];
        [Settings.DATA_PROTECTION]: boolean;
        [Settings.COLOR_SCHEME]: string[];
        [Settings.USE_SCHEME]: boolean;
        [Settings.LOCATION_RELOAD_NEWEST]: number;

        [Settings.EXPERIMENTAL_ALLOW_FAVOURITE_BARGAIN]: boolean;
        [Settings.EXPERIMENTAL_ADJUST_POPULAR]: boolean;
        [Settings.EXPERIMENTAL_FETCH_NOTIFICATION]: boolean;
        [Settings.EXPERIMENTAL_FETCH_FAVOURITE_BARGAIN_STATUS]: boolean;
        [Settings.EXPERIMENTAL_FETCH_ITEM_PRICE_HISTORY]: PriceHistoryRange;
        [Settings.EXPERIMENTAL_ADJUST_MARKET_CURRENCY]: boolean;
        [Settings.EXPERIMENTAL_FORMAT_CURRENCY]: CurrencyNumberFormats;
        [Settings.EXPERIMENTAL_ADJUST_SHOP]: boolean;

        [Settings.STORE_DANGER_AGREEMENTS]: boolean[];
    }

    const enum InternalStructureTransform {
        NONE,
        BOOLEAN,
        BOOLEAN_ARRAY
    }

    type InternalSettingStructure = {
        [key in Settings]: {
            value?: SettingsTypes[key],
            readonly default: SettingsTypes[key],
            readonly export: string,
            readonly transform: InternalStructureTransform,
            readonly validator: (key: Settings, value: any) => any
        }
    }

    const INTERNAL_SETTINGS: InternalSettingStructure = {
        [Settings.VERSION]: {
            default: '2.1.8',
            export: '0x0',
            transform: InternalStructureTransform.NONE,
            validator: validateNotNull
        },
        [Settings.SELECTED_CURRENCY]: {
            default: 'USD',
            export: '0x1',
            transform: InternalStructureTransform.NONE,
            validator: validateNotNull
        },
        [Settings.CUSTOM_CURRENCY_RATE]: {
            default: 1,
            export: '0x2',
            transform: InternalStructureTransform.NONE,
            validator: validateNumber
        },
        [Settings.CUSTOM_CURRENCY_NAME]: {
            default: 'CC',
            export: '0x3',
            transform: InternalStructureTransform.NONE,
            validator: validateNotNull
        },
        [Settings.CUSTOM_CURRENCY_CALCULATED_RATE]: {
            default: 1,
            export: '0x4',
            transform: InternalStructureTransform.NONE,
            validator: validateNumber
        },
        [Settings.CUSTOM_CURRENCY_LEADING_ZEROS]: {
            default: 2,
            export: '0x5',
            transform: InternalStructureTransform.NONE,
            validator: validateNumber
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
            export: '0x8',
            transform: InternalStructureTransform.NONE,
            validator: validateNumber
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
            export: '0x11',
            transform: InternalStructureTransform.NONE,
            validator: validateNumber
        },
        [Settings.CUSTOM_FOP]: {
            default: FOP_VALUES.Auto,
            export: '0x12',
            transform: InternalStructureTransform.NONE,
            validator: validateNumber
        },
        [Settings.DEFAULT_SORT_BY]: {
            default: 'default',
            export: '0x13',
            transform: InternalStructureTransform.NONE,
            validator: validateNotNull
        },
        [Settings.DEFAULT_STICKER_SEARCH]: {
            default: 'All',
            export: '0x14',
            transform: InternalStructureTransform.NONE,
            validator: validateNotNull
        },
        [Settings.STORED_CUSTOM_STICKER_SEARCH]: {
            default: '',
            export: '0x15',
            transform: InternalStructureTransform.NONE,
            validator: validateNotNull
        },
        [Settings.LEECH_CONTRIBUTOR_KEY]: {
            default: '',
            export: '0x16',
            transform: InternalStructureTransform.NONE,
            validator: validateNotNull
        },
        [Settings.SHOW_TOAST_ON_ACTION]: {
            default: false,
            export: '0x17',
            transform: InternalStructureTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.LISTING_OPTIONS]: {
            default: [true, true, true, true, false, false],
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
            transform: InternalStructureTransform.NONE,
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
            export: '0x24',
            transform: InternalStructureTransform.NONE,
            validator: validateNumber
        },

        [Settings.EXPERIMENTAL_ALLOW_FAVOURITE_BARGAIN]: {
            default: true,
            export: '2x1',
            transform: InternalStructureTransform.NONE,
            validator: null
        },
        [Settings.EXPERIMENTAL_ADJUST_POPULAR]: {
            default: false,
            export: '2x2',
            transform: InternalStructureTransform.NONE,
            validator: null
        },
        [Settings.EXPERIMENTAL_FETCH_NOTIFICATION]: {
            default: false,
            export: '2x3',
            transform: InternalStructureTransform.NONE,
            validator: null
        },
        [Settings.EXPERIMENTAL_FETCH_FAVOURITE_BARGAIN_STATUS]: {
            default: false,
            export: '2x4',
            transform: InternalStructureTransform.NONE,
            validator: null
        },
        [Settings.EXPERIMENTAL_FETCH_ITEM_PRICE_HISTORY]: {
            default: PriceHistoryRange.OFF,
            export: '2x5',
            transform: InternalStructureTransform.NONE,
            validator: null
        },
        [Settings.EXPERIMENTAL_ADJUST_MARKET_CURRENCY]: {
            default: false,
            export: '2x6',
            transform: InternalStructureTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.EXPERIMENTAL_FORMAT_CURRENCY]: {
            default: CurrencyNumberFormats.NONE,
            export: '2x7',
            transform: InternalStructureTransform.NONE,
            validator: validateNumber
        },
        [Settings.EXPERIMENTAL_ADJUST_SHOP]: {
            default: false,
            export: '2x8',
            transform: InternalStructureTransform.BOOLEAN,
            validator: validateBoolean
        },
        [Settings.STORE_DANGER_AGREEMENTS]: {
            default: [false, false],
            export: '3x1',
            transform: InternalStructureTransform.BOOLEAN_ARRAY,
            validator: validateBooleanArray
        }
    };

    /*
     * legacy, keep until 2.1.9
     * @private
     *
    const DEFAULT_SETTINGS: SettingsTypes = {
        [Settings.VERSION]: '2.1.8',
        [Settings.SELECTED_CURRENCY]: 'USD',
        [Settings.CUSTOM_CURRENCY_RATE]: 1,
        [Settings.CUSTOM_CURRENCY_NAME]: 'CC',
        [Settings.CUSTOM_CURRENCY_CALCULATED_RATE]: 1,
        [Settings.CUSTOM_CURRENCY_LEADING_ZEROS]: 2,
        [Settings.CAN_EXPAND_SCREENSHOTS]: false,
        [Settings.EXPAND_SCREENSHOTS_BACKDROP]: false,
        [Settings.DIFFERENCE_DOMINATOR]: DifferenceDominator.STEAM,
        [Settings.APPLY_STEAM_TAX]: false,
        [Settings.APPLY_CURRENCY_TO_DIFFERENCE]: false,
        [Settings.EXPAND_TYPE]: ExpandScreenshotType.PREVIEW,
        [Settings.CUSTOM_FOP]: FOP_VALUES.Auto,
        [Settings.DEFAULT_SORT_BY]: 'default',
        [Settings.DEFAULT_STICKER_SEARCH]: 'All',
        [Settings.STORED_CUSTOM_STICKER_SEARCH]: '',
        [Settings.LEECH_CONTRIBUTOR_KEY]: '',
        [Settings.SHOW_TOAST_ON_ACTION]: false,
        [Settings.LISTING_OPTIONS]: [true, true, true, true, false, false],
        [Settings.SHOW_FLOAT_BAR]: true,
        [Settings.COLOR_LISTINGS]: [false, false],
        [Settings.DATA_PROTECTION]: true,
        [Settings.COLOR_SCHEME]: ['#121212', '#1f1f1f', '#bfbfbf', '#696969'],
        [Settings.USE_SCHEME]: false,
        [Settings.LOCATION_RELOAD_NEWEST]: LOCATION_RELOAD_NEWEST_VALUES.NONE,

        [Settings.EXPERIMENTAL_ALLOW_FAVOURITE_BARGAIN]: true,
        [Settings.EXPERIMENTAL_ADJUST_POPULAR]: true,
        [Settings.EXPERIMENTAL_FETCH_NOTIFICATION]: true,
        [Settings.EXPERIMENTAL_FETCH_FAVOURITE_BARGAIN_STATUS]: false,
        [Settings.EXPERIMENTAL_FETCH_ITEM_PRICE_HISTORY]: PriceHistoryRange.OFF
    };*/

    /*
     * legacy, keep until 2.1.9
     * @private
     *
    const VALIDATORS: {
        [key in Settings]: (value: any) => any
    } = {
        [Settings.VERSION]: (value) => value ?? DEFAULT_SETTINGS[Settings.VERSION],
        [Settings.SELECTED_CURRENCY]: (value) => value ?? DEFAULT_SETTINGS[Settings.SELECTED_CURRENCY],
        [Settings.CUSTOM_CURRENCY_RATE]: (value) => validateNumber(value, DEFAULT_SETTINGS[Settings.CUSTOM_CURRENCY_RATE]),
        [Settings.CUSTOM_CURRENCY_NAME]: (value) => value ?? DEFAULT_SETTINGS[Settings.CUSTOM_CURRENCY_NAME],
        [Settings.CUSTOM_CURRENCY_CALCULATED_RATE]: (value) => validateNumber(value, DEFAULT_SETTINGS[Settings.CUSTOM_CURRENCY_CALCULATED_RATE]),
        [Settings.CUSTOM_CURRENCY_LEADING_ZEROS]: (value) => validateNumber(value, DEFAULT_SETTINGS[Settings.CUSTOM_CURRENCY_LEADING_ZEROS]),
        [Settings.CAN_EXPAND_SCREENSHOTS]: (value) => validateBoolean(value, DEFAULT_SETTINGS[Settings.CAN_EXPAND_SCREENSHOTS]),
        [Settings.EXPAND_SCREENSHOTS_BACKDROP]: (value) => validateBoolean(value, DEFAULT_SETTINGS[Settings.EXPAND_SCREENSHOTS_BACKDROP]),
        [Settings.DIFFERENCE_DOMINATOR]: (value) => validateNumber(value, DEFAULT_SETTINGS[Settings.DIFFERENCE_DOMINATOR]),
        [Settings.APPLY_STEAM_TAX]: (value) => validateBoolean(value, DEFAULT_SETTINGS[Settings.APPLY_STEAM_TAX]),
        [Settings.APPLY_CURRENCY_TO_DIFFERENCE]: (value) => validateBoolean(value, DEFAULT_SETTINGS[Settings.APPLY_CURRENCY_TO_DIFFERENCE]),
        [Settings.EXPAND_TYPE]: (value) => validateNumber(value, DEFAULT_SETTINGS[Settings.EXPAND_TYPE]),
        [Settings.CUSTOM_FOP]: (value) => validateNumber(value, DEFAULT_SETTINGS[Settings.CUSTOM_FOP]),
        [Settings.DEFAULT_SORT_BY]: (value) => value ?? DEFAULT_SETTINGS[Settings.DEFAULT_SORT_BY],
        [Settings.DEFAULT_STICKER_SEARCH]: (value) => value ?? DEFAULT_SETTINGS[Settings.DEFAULT_STICKER_SEARCH],
        [Settings.STORED_CUSTOM_STICKER_SEARCH]: (value) => value ?? DEFAULT_SETTINGS[Settings.STORED_CUSTOM_STICKER_SEARCH],
        [Settings.LEECH_CONTRIBUTOR_KEY]: (value) => value ?? DEFAULT_SETTINGS[Settings.LEECH_CONTRIBUTOR_KEY],
        [Settings.SHOW_TOAST_ON_ACTION]: (value) => validateBoolean(value, DEFAULT_SETTINGS[Settings.SHOW_TOAST_ON_ACTION]),
        [Settings.LISTING_OPTIONS]: (value) => validateBooleanArray(value, DEFAULT_SETTINGS[Settings.LISTING_OPTIONS]),
        [Settings.SHOW_FLOAT_BAR]: (value) => validateBoolean(value, DEFAULT_SETTINGS[Settings.SHOW_FLOAT_BAR]),
        [Settings.COLOR_LISTINGS]: (value) => validateBooleanArray(value, DEFAULT_SETTINGS[Settings.COLOR_LISTINGS]),
        [Settings.DATA_PROTECTION]: (value) => validateBoolean(value, DEFAULT_SETTINGS[Settings.DATA_PROTECTION]),
        [Settings.COLOR_SCHEME]: (value) => validateColorArray(value, DEFAULT_SETTINGS[Settings.COLOR_SCHEME]),
        [Settings.USE_SCHEME]: (value) => validateBoolean(value, DEFAULT_SETTINGS[Settings.USE_SCHEME]),
        [Settings.LOCATION_RELOAD_NEWEST]: (value) => validateNumber(value, DEFAULT_SETTINGS[Settings.LOCATION_RELOAD_NEWEST]),

        [Settings.EXPERIMENTAL_ALLOW_FAVOURITE_BARGAIN]: (value) => validateBoolean(value, DEFAULT_SETTINGS[Settings.EXPERIMENTAL_ALLOW_FAVOURITE_BARGAIN]),
        [Settings.EXPERIMENTAL_ADJUST_POPULAR]: (value) => validateBoolean(value, DEFAULT_SETTINGS[Settings.EXPERIMENTAL_ADJUST_POPULAR]),
        [Settings.EXPERIMENTAL_FETCH_NOTIFICATION]: (value) => validateBoolean(value, DEFAULT_SETTINGS[Settings.EXPERIMENTAL_FETCH_NOTIFICATION]),
        [Settings.EXPERIMENTAL_FETCH_FAVOURITE_BARGAIN_STATUS]: (value) => validateBoolean(value, DEFAULT_SETTINGS[Settings.EXPERIMENTAL_FETCH_FAVOURITE_BARGAIN_STATUS]),
        [Settings.EXPERIMENTAL_FETCH_ITEM_PRICE_HISTORY]: (value) => validateNumber(value, DEFAULT_SETTINGS[Settings.EXPERIMENTAL_FETCH_ITEM_PRICE_HISTORY])
    };*/

    /*
     * legacy, keep until 2.1.9
     * @private
     *
    let settings: SettingsTypes = {
        ...DEFAULT_SETTINGS
    };*/

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
        checkTypeValidation(key, typeof 0);

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
        checkTypeValidation(key, typeof true);

        return _validateBoolean(value) ?? <boolean>INTERNAL_SETTINGS[key].default;
    }

    function validateBooleanArray(key: Settings, value: any): boolean[] {
        checkTypeValidation(key, typeof []);

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
        checkTypeValidation(key, typeof '');

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

    // general

    export function load(): void {
        let tempSettings = Util.tryParseJson(Cookie.read(GlobalConstants.BUFF_UTILITY_SETTINGS)) ?? {};

        if (tempSettings[Settings.VERSION]?.length < 1) {
            _upgrade218();
        } else {
            // map export structure dynamically
            let export_structure: {
                [key: string]: Settings
            } = {};

            const keys = (<Settings[]>Object.keys(INTERNAL_SETTINGS)).map<string>(k => {
                const exportKey = INTERNAL_SETTINGS[k].export;
                export_structure[exportKey] = k;
                return exportKey;
            });

            for (let l_key of keys) {
                let struc: Settings = export_structure[l_key];
                let newValue = null;

                switch (INTERNAL_SETTINGS[struc].transform) {
                    case InternalStructureTransform.NONE:
                        newValue = tempSettings[ l_key ];
                        break;
                    case InternalStructureTransform.BOOLEAN:
                        newValue = tempSettings[ l_key ] == 1;
                        break;
                    case InternalStructureTransform.BOOLEAN_ARRAY:
                        newValue = Util.importBooleansFromBytes(tempSettings[ l_key ]);
                        break;
                }

                let validator = INTERNAL_SETTINGS[struc].validator ?? ((_, value) => value);
                INTERNAL_SETTINGS[struc].value = validator(struc, newValue);
            }
        }

        if (DEBUG) {
            console.debug('Loaded Settings:', INTERNAL_SETTINGS);
        }
    }

    /*
     * legacy, keep until 2.1.9
     * Returns a cloned settings object
     * @private
     *
    function getAll(): SettingsTypes {
        let copy = <SettingsTypes>JSON.parse(JSON.stringify(settings));

        const keys = Object.keys(VALIDATORS);
        for (let l_key of keys) {
            copy[l_key] = VALIDATORS[l_key](settings[l_key]);
        }

        console.debug('[BuffUtility] Getting all settings:', settings, '->', copy);

        return copy;
    }*/

    /**
     * Get the specified setting
     *
     * @param setting The value of the setting to get
     * @returns The value from the specified setting, return type is determined by passed setting
     */
    export function getSetting<T extends Settings, R extends SettingsTypes[T]>(setting: T): R {
        return <R>INTERNAL_SETTINGS[setting].value;
    }

    /**
     * Set a new value for the specified setting <br>
     * Value will be checked by the specified setting validator
     *
     * @param setting The specified setting to update
     * @param newValue The new value of the setting
     */
    export function setSetting<T extends Settings>(setting: T, newValue: any): void {
        let oldValue = `${INTERNAL_SETTINGS[setting].value}`;

        if (oldValue != `${newValue}`) {
            let validator = INTERNAL_SETTINGS[setting].validator ?? ((_, value) => value);
            INTERNAL_SETTINGS[setting].value = validator(setting, newValue);

            console.debug(`[BuffUtility] Saved setting: ${setting}\n${oldValue} -> ${newValue}`);
        }
    }

    /**
     * This will write the current settings to the cookie storage
     */
    export function finalize(): void {
        const keys = Object.keys(INTERNAL_SETTINGS);

        let exportSettings = {};

        for (let l_key of keys) {
            let struc = INTERNAL_SETTINGS[<Settings>l_key];

            switch (struc.transform) {
                case InternalStructureTransform.NONE:
                    exportSettings[struc.export] = struc.value;
                    break;
                case InternalStructureTransform.BOOLEAN:
                    exportSettings[struc.export] = struc.value == true ? 1 : 0;
                    break;
                case InternalStructureTransform.BOOLEAN_ARRAY:
                    exportSettings[struc.export] = Util.exportBooleansToBytes(<boolean[]>struc.value);
                    break;
            }
        }

        Cookie.write(GlobalConstants.BUFF_UTILITY_SETTINGS, JSON.stringify(exportSettings));
    }

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

    // --- upgrade 2.1.7 -> 2.1.8

    function _upgrade218(): void {
        _load217();
        finalize();
    }

    function _load217(): void {
        let tempSettings = Util.tryParseJson(Cookie.read(GlobalConstants.BUFF_UTILITY_SETTINGS));

        const defaultKeys = Object.keys(INTERNAL_SETTINGS);

        for (let key of defaultKeys) {
            setSetting(<Settings>key, tempSettings[key]);
        }
    }

    /*
     * legacy, keep until 2.1.9
     * @private
     *
    function _finalize217(): void {
        const defaultKeys = Object.keys(DEFAULT_SETTINGS);
        const loadedKeys = Object.keys(settings);

        for (let l_loadedKey of loadedKeys) {
            if (defaultKeys.indexOf(l_loadedKey) > -1) continue;

            // delete unused / old properties
            delete settings[l_loadedKey];

            console.debug(`[BuffUtility] Deleted old setting: ${l_loadedKey}`);
        }

        Cookie.write(GlobalConstants.BUFF_UTILITY_SETTINGS, JSON.stringify(settings));
    }*/

}

/**
 * Exposed function to avoid imports <br>
 * Get the specified setting
 *
 * @param setting The value of the setting to get
 * @returns The value from the specified setting, return type is determined by passed setting
 */
const getSetting = ExtensionSettings.getSetting;

ExtensionSettings.load();
