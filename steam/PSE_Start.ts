module PSE_Start {

    DEBUG && console.debug('Module.PSE_Start');

    // imports
    import Settings = ExtensionSettings.Settings;
    import getSetting = ExtensionSettings.getSetting;

    // module

    function init(): void {
        addSteamCSS();
    }

    async function addSteamCSS(): Promise<void> {
        if (await getSetting(Settings.PSE_HIDE_ACCOUNT_DETAILS)) {
            InjectionServiceLib.injectCSS(`:root { --pse-blur: blur(10px); }`);
        } else {
            InjectionServiceLib.injectCSS(`:root { --pse-blur: blur(0); }`);
        }
    }

    init();

}
