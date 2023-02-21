module Adjust_Settings {

    DEBUG && console.debug('%c■', 'color: #0000ff', '[BuffUtility] Module.Adjust_Settings');

    // imports
    import Settings = ExtensionSettings.Settings;
    import getSetting = ExtensionSettings.getSetting;

    // module

    async function init(): Promise<void> {
        if (!await getSetting(Settings.MODULE_ADJUST_SETTINGS)) {
            console.debug('%c■', 'color: #ff0000', '[BuffUtility] Adjust_Settings - disabled');
            return;
        } else {
            console.debug('%c■', 'color: #00ff00', '[BuffUtility] Adjust_Settings');
        }

        // Get stuff
        const userSettings = document.querySelector('div.user-setting');

        const h3 = document.createElement('h3');
        h3.innerHTML = 'BuffUtility Settings have moved!';

        const div = document.createElement('div');
        div.innerHTML = 'Settings are now available under extension options!';

        userSettings.append(h3, div);
    }

    init();

}

