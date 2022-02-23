module AdjustSales {

    function init(): void {
        // skip if not csgo
        if (window.location.href.indexOf('game=csgo') == -1) return;

        console.debug('[BuffUtility] Adjust_Sales');

        let liList = <NodeListOf<HTMLElement>>document.querySelectorAll('li[id^="sell_order_"]');

        // if no list is present, skip
        if (liList?.length == 0) return;

        InjectionServiceLib.injectCSS(`
        .bu_icon_link:hover {
            filter: brightness(2.0);
        }
        `);

        for (let i = 0, l = liList.length; i < l; i++) {
            let li = liList.item(i);
            let a = li.querySelector('a');
            let tagBox = li.querySelector('div.tagBox');

            let link = document.createElement('span');

            link.innerHTML = `<a href="https://buff.163.com/market/m/item_detail?classid=${a.getAttribute('data-classid')}&instanceid=${a.getAttribute('data-instanceid')}&game=csgo&assetid=${li.getAttribute('data-assetid')}&sell_order_id=${li.getAttribute('data-orderid')}" onclick="this.parentElement.parentElement.click();" target="_blank"><i class="icon icon_link bu_icon_link j_tips_handler" data-title="Share" data-direction="bottom"></i></a>`;

            tagBox.appendChild(link);
        }
    }

    init();

}
