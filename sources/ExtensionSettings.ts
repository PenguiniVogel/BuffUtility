/**
 * Author: Felix Vogel
 */
/** */
module ExtensionSettings {

    export const enum DifferenceDominator {
        STEAM,
        BUFF
    }

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
        apply_currency_to_difference: boolean
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
        apply_currency_to_difference: false
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
