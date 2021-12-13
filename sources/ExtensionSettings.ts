/**
 * Author: Felix Vogel
 */
/** */
module ExtensionSettings {

    export const enum DifferenceDominator {
        STEAM,
        BUFF
    }

    export interface Settings {
        selected_currency: string,
        custom_currency_rate: number,
        custom_currency_name: string,
        can_expand_screenshots: boolean,
        expand_screenshots_backdrop: boolean,
        difference_dominator: DifferenceDominator
    }

    export let settings: Settings = {
        selected_currency: 'USD',
        custom_currency_rate: 1,
        custom_currency_name: 'CC',
        can_expand_screenshots: false,
        expand_screenshots_backdrop: false,
        difference_dominator: DifferenceDominator.STEAM
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
