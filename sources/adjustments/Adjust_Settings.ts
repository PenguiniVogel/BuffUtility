module Adjust_Settings {

    // add settings

    function init(): void {
        console.debug('[BuffUtility] Adjust_Settings');

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

