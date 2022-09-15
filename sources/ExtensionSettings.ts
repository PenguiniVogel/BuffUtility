/**
 * Author: Felix Vogel
 */
/** */
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
        wallet_fee: number,
        wallet_fee_base: number,
        wallet_fee_percent: number,
        wallet_fee_minimum: number
    }

    export const enum Settings {
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

        // 2.1.8 -> advanced settings
        EXPERIMENTAL_ALLOW_FAVOURITE_BARGAIN = 'allow_favourite_bargain',
        // 2.1.8 -> setting will be removed, default procedure
        EXPERIMENTAL_ADJUST_POPULAR = 'experimental_adjust_popular',
        // 2.1.8 -> setting will be merged into show toast on action
        EXPERIMENTAL_FETCH_NOTIFICATION = 'experimental_fetch_notification'
    }

    export interface SettingsProperties {
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
        [Settings.COLOR_LISTINGS]: boolean[];
        [Settings.DATA_PROTECTION]: boolean;
        [Settings.COLOR_SCHEME]: string[];
        [Settings.USE_SCHEME]: boolean;
        [Settings.LOCATION_RELOAD_NEWEST]: number;

        [Settings.EXPERIMENTAL_ALLOW_FAVOURITE_BARGAIN]: boolean;
        [Settings.EXPERIMENTAL_ADJUST_POPULAR]: boolean;
        [Settings.EXPERIMENTAL_FETCH_NOTIFICATION]: boolean;
    }

    const DEFAULT_SETTINGS: SettingsProperties = {
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
        [Settings.EXPERIMENTAL_FETCH_NOTIFICATION]: true
    };

    const VALIDATORS: {
        [key in Settings]: (value: any) => any
    } = {
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
        [Settings.EXPERIMENTAL_FETCH_NOTIFICATION]: (value) => validateBoolean(value, DEFAULT_SETTINGS[Settings.EXPERIMENTAL_FETCH_NOTIFICATION])
    };

    let settings: SettingsProperties = {
        ...DEFAULT_SETTINGS
    };

    export let steam_settings: SteamSettings = {
        wallet_fee: 1,
        wallet_fee_base: 0,
        wallet_fee_percent: 0.05,
        wallet_fee_minimum: 1
    };

    // func validators

    function validateNumber(value: string, fallback: number): number {
        if (!isFinite(+value) || +value == null) {
            return fallback;
        } else {
            return +value;
        }
    }

    function validateBoolean(value: any, fallback: boolean): boolean {
        if (value == undefined) return fallback;
        if (value == false || value == true) return value;
        if (/false|true/gi.test(value)) return value == 'true';

        return fallback;
    }

    function validateBooleanArray(value: any, fallback: boolean[]): boolean[] {
        value = value ?? fallback;

        let r = [];
        for (let i = 0, l = fallback.length; i < l; i ++) {
            r[i] = validateBoolean(value[i], fallback[i]);
        }

        return r;
    }

    function validateColor(value: any, fallback: string): string {
        value = value ?? fallback;

        if (!/#[0-9a-f]{6}/i.test(value)) {
            value = fallback;
        }

        return value;
    }

    function validateColorArray(value: any, fallback: string[]): string[] {
        value = value ?? fallback;

        let r = [];
        for (let i = 0, l = fallback.length; i < l; i ++) {
            r[i] = validateColor(value[i], fallback[i]);
        }

        return r;
    }

    // general

    export function load(): void {
        let tempSettings: SettingsProperties = Util.tryParseJson(Cookie.read(GlobalConstants.BUFF_UTILITY_SETTINGS)) ?? {} as SettingsProperties;

        settings = {
            ...settings,
            ...tempSettings
        };

        const defaultKeys = Object.keys(DEFAULT_SETTINGS);
        const loadedKeys = Object.keys(settings);

        for (let l_loadedKey of loadedKeys) {
            if (defaultKeys.indexOf(l_loadedKey) > -1) continue;

            // delete unused / old properties
            delete settings[l_loadedKey];
        }
    }

    /**
     * Returns a cloned settings object
     */
    export function getAll(): SettingsProperties {
        let copy = <SettingsProperties>JSON.parse(JSON.stringify(settings));

        const keys = Object.keys(VALIDATORS);
        for (let l_key of keys) {
            copy[l_key] = VALIDATORS[l_key](settings[l_key]);
        }

        console.debug('[BuffUtility] Getting all settings:', settings, '->', copy);

        return copy;
    }

    export function save(setting: Settings, newValue: any): void {
        let oldValue = `${settings[setting]}`;

        if (oldValue != `${newValue}`) {
            settings[setting] = <never>(VALIDATORS[setting](newValue));

            Cookie.write(GlobalConstants.BUFF_UTILITY_SETTINGS, JSON.stringify(settings), 50);

            console.debug(`[BuffUtility] Saved setting: ${setting}\n${oldValue} -> ${newValue}`);
        }
    }

}
