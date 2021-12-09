/**
 * Author: Felix Vogel
 */
/** */
module ExtensionSettings {

    export interface Settings {
        selected_currency: string
    }

    export let settings: Settings = {
        selected_currency: 'USD'
    };

    export function load(): void {
        let tempSettings: Settings = Util.tryParseJson(Cookie.read(BUFF_UTILITY_SETTINGS)) ?? {} as Settings;

        settings = {
            ...settings,
            ...tempSettings
        };
    }

    export function save(): void {
        Cookie.write(BUFF_UTILITY_SETTINGS, JSON.stringify(settings), 50);
    }

}
