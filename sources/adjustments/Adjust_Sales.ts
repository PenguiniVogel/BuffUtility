module Adjust_Sales {

    DEBUG && console.debug('[BuffUtility] Module.Adjust_Sales');

    // imports
    import Settings = ExtensionSettings.Settings;
    import getSetting = ExtensionSettings.getSetting;

    // module

    async function init(): Promise<void> {
        if (!await getSetting(Settings.MODULE_ADJUST_SALES)) {
            console.debug('%c■', 'color: #ff0000', '[BuffUtility] Adjust_Sales - disabled');
            return;
        } else {
            console.debug('%c■', 'color: #00ff00', '[BuffUtility] Adjust_Sales');
        }

        // skip if not csgo
        if (window.location.href.indexOf('game=csgo') == -1) return;

        console.debug('[BuffUtility] Adjust_Sales');

        let liList = <NodeListOf<HTMLElement>>document.querySelectorAll('li[id^="sell_order_"]');

        // if no list is present, skip
        if (liList?.length == 0) return;

        for (let i = 0, l = liList.length; i < l; i++) {
            let li = liList.item(i);
            let a = li.querySelector('a');
            let tagBox = li.querySelector('div.tagBox');

            let link = document.createElement('span');

            link.innerHTML = `<a href="https://buff.163.com/goods/${li.getAttribute('data-goodsid')}?appid=${a.getAttribute('data-appid')}&classid=${a.getAttribute('data-classid')}&instanceid=${a.getAttribute('data-instanceid')}&assetid=${li.getAttribute('data-assetid')}&contextid=${a.getAttribute('data-contextid')}&sell_order_id=${li.getAttribute('data-orderid')}" onclick="this.parentElement.parentElement.click();" target="_blank"><i class="icon icon_link bu_icon_link j_tips_handler" data-title="Share" data-direction="bottom"></i></a>`;

            tagBox.appendChild(link);
        }
    }

    init();

}
