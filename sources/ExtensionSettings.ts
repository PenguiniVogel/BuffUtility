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
        can_expand_screenshots: boolean,
        expand_screenshots_backdrop: boolean,
        difference_dominator: DifferenceDominator
    }

    export let settings: Settings = {
        selected_currency: 'USD',
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
