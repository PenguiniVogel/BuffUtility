///<reference path="../Util.ts"/>
///<reference path="../fRequest.ts"/>
///<reference path="../Buff/BuffApi.ts"/>

/**
 * Author: Felix Vogel
 */
/** */
module CSGOStashUtility {

    const BUFF_IMG_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAFVBMVEVHcEwhIS0hISshISshISv///+QkJU/x7PBAAAABHRSTlMAJK7xdunbSwAAAFxJREFUeAFjYFR2QQJGAgzCLijAkEEFVcCJwQRVwJnBBQ2QKxAKBXgEwIpTw1AF3EJTEAJQBQgBhAKEQCqaoW5YbHGhuYAbqufCXFJRBVIoC1OMiMKISozIxkgOAEjZind3Npg5AAAAAElFTkSuQmCC';

    export function init(): void {
        if (/^.*csgostash\.com\/skin\/\d+\/.*$/.test(window.location.href)) {
            handleSkinAddition();
        }

        console.info('[CSGOStashUtility] Initialized.');
    }

    function handleSkinAddition(): void {
        let itemName = document.querySelector('h2').innerText.trim();

        let tabs = <HTMLElement>document.querySelector('div.price-details-nav > ul.nav.nav-tabs');

        tabs.innerHTML += `<li role="presentation" class="misc-click"><a href="#buffprices" role="tab" data-toggle="tab" aria-controls="buffprices" aria-expanded="true"><img src="${BUFF_IMG_BASE64}" alt="Buff Logo" class="price-tab-icon"><span class="hidden-xs hidden-md">Buff</span></a></li>`;

        let priceDetails = <HTMLElement>document.querySelector('div.price-details > div.tab-content');

        let pricesTab =
`<div role="tabpanel" class="tab-pane" id="buffprices">
    <div class="btn-group-sm btn-group-justified price-bottom-space">
        <a href="https://buff.163.com/market/?game=csgo#tab=selling&page_num=1&search=${itemName}&sort_by=price.desc" target="_blank" rel="nofollow" class="btn btn-default btn-sm market-button-skin">Search buff (All)</a>
    </div>
</div>`;

        priceDetails.innerHTML += pricesTab;
    }

}
