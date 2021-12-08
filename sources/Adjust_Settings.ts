module Adjust_Settings {

    export function init(): void {
        // if it's not the settings page we don't execute
        // if (!(/https:\/\/buff\.163\.com\/user-center\/profile/i.test(window.location.href))) return;

        const originalSettings = document.getElementById('user-prefer-buff-price-currency');
        originalSettings.style['display'] = 'none';

        const parentElement = originalSettings.parentElement;
        const keys = Object.keys(CurrencyHelper.getData().rates);

        parentElement.innerHTML += `
<div>
    <select style="width: 120px; height: 18px; max-height: 300px; overflow: auto;">
        ${keys.map(x => `<option value="${x}" style="width: 101px;">${x}</option>`).join('')}
    </select>
</div>
        `;
    }

    window.addEventListener(BUFF_UTILITY_LOADED_EVENT, () => init());

}

