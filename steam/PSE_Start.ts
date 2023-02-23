module PSE_Start {

    DEBUG && console.debug('%c■', 'color: #0000ff', '[BuffUtility:PSE] Module.PSE_Start');

    // imports
    import Settings = ExtensionSettings.Settings;
    import getSetting = ExtensionSettings.getSetting;

    // module

    function init(): void {
        console.debug('%c■', 'color: #00ff00', '[BuffUtility:PSE] PSE_Start');
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
