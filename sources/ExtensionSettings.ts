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

    export const SORT_BY = {
        'Default': 'default',
        'Newest': 'created.desc',
        'Price Ascending': 'price.asc',
        'Price Descending': 'price.desc',
        'Float Ascending': 'paintwear.asc',
        'Float Descending': 'paintwear.desc',
        'Hot Descending': 'heat.desc'
    };

    export interface SteamSettings {
        wallet_fee: number,
        wallet_fee_base: number,
        wallet_fee_percent: number,
        wallet_fee_minimum: number
    }

    export interface Settings {
        selected_currency: string,
        custom_currency_rate: number,
        custom_currency_name: string,
        custom_currency_calculated_rate: number,
        custom_currency_leading_zeros: number,
        can_expand_screenshots: boolean,
        expand_screenshots_backdrop: boolean,
        difference_dominator: DifferenceDominator,
        apply_steam_tax: boolean,
        apply_currency_to_difference: boolean,
        expand_type
        custom_fop: number,
        default_sort_by: string
    }

    export const DEFAULT_SETTINGS: Settings = {
        selected_currency: 'USD',
        custom_currency_rate: 1,
        custom_currency_name: 'CC',
        custom_currency_calculated_rate: 1,
        custom_currency_leading_zeros: 2,
        can_expand_screenshots: false,
        expand_screenshots_backdrop: false,
        difference_dominator: DifferenceDominator.STEAM,
        apply_steam_tax: false,
        apply_currency_to_difference: false,
        expand_type: ExpandScreenshotType.PREVIEW,
        custom_fop: FOP_VALUES.Auto,
        default_sort_by: 'default'
    };

    export let settings: Settings = {
        ...DEFAULT_SETTINGS
    };

    export let steam_settings: SteamSettings = {
        wallet_fee: 1,
        wallet_fee_base: 0,
        wallet_fee_percent: 0.05,
        wallet_fee_minimum: 1
    };

    export function load(): void {
        let tempSettings: Settings = Util.tryParseJson(Cookie.read(GlobalConstants.BUFF_UTILITY_SETTINGS)) ?? {} as Settings;

        settings = {
            ...settings,
            ...tempSettings
        };
    }

    export function save(): void {
        Cookie.write(GlobalConstants.BUFF_UTILITY_SETTINGS, JSON.stringify(settings), 50);
    }

}
