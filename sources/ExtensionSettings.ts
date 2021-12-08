module ExtensionSettings {

    export interface Settings {
        selected_currency: string
    }

    let settings: Settings = {
        selected_currency: 'USD'
    };

    export function load(): void {
        settings = Util.tryParseJson(Cookie.read(BUFF_UTILITY_SETTINGS));
    }

    export function save(): void {
        Cookie.write(BUFF_UTILITY_SETTINGS, JSON.stringify(settings), 50);
    }

}
