module AdjustFavourites {

    function init(): void {
        // if not csgo, skip
        if (window.location.href.indexOf('game=csgo') == -1) return;

        console.debug('[BuffUtility] Adjust_Favourites');

        let rows = <NodeListOf<HTMLElement>>(document.querySelector('table.list_tb.list_tb_csgo')?.querySelectorAll('tr'));

        // if no rows, skip
        if (rows?.length == 0) return;

        for (let i = 0, l = rows.length; i < l; i++) {
            let row = rows.item(i);
            let nameContainer = (<HTMLElement>row.querySelector('div.name-cont h3'));
            let aAssetInfo = <HTMLElement>row.querySelector('a[data-asset-info]');
            let wearContainer = row.querySelector('div.csgo_value');
            let targetId = row.querySelector('[data-target-id]');

            if (!aAssetInfo || !(nameContainer?.innerText) || !targetId) continue;

            let assetInfo: BuffTypes.SellOrder.AssetInfo = JSON.parse(aAssetInfo.getAttribute('data-asset-info'));

            let itemType = nameContainer.innerText.split(' | ')[0].replace('（★）', '');
            itemType = SchemaData.NAME_MAPPING_CH[itemType] ?? itemType;

            let f_schemaData = SchemaHelper.find(itemType, true);

            if (f_schemaData?.length > 0) {
                let schemaData = f_schemaData[0];

                console.debug(itemType, schemaData, assetInfo);

                let aCopyGen = <HTMLElement>document.createElement('a');

                let gen;
                if (schemaData.type == 'Gloves') {
                    aCopyGen.innerHTML = '<b><i class="icon icon_notes"></i></b>Copy !gengl';
                    // !gengl weapon_id paint_id pattern float
                    gen = `!gengl ${schemaData.id} ${assetInfo.info.paintindex} ${assetInfo.info.paintseed} ${assetInfo.paintwear}`;
                } else {
                    aCopyGen.innerHTML = '<b><i class="icon icon_notes"></i></b>Copy !gen';
                    // !gen weapon_id paint_id pattern float sticker1 wear1...
                    gen = `!gen ${schemaData.id} ${assetInfo.info.paintindex} ${assetInfo.info.paintseed} ${assetInfo.paintwear}`;

                    if (assetInfo.info?.stickers?.length > 0) {
                        let stickers: string[] = ['0 0', '0 0', '0 0', '0 0'];

                        for (let l_sticker of assetInfo.info.stickers) {
                            stickers[l_sticker.slot] = `${l_sticker.sticker_id} ${l_sticker.wear}`;
                        }

                        gen += ` ${stickers.join(' ')}`;
                    }
                }

                aCopyGen.setAttribute('class', 'ctag btn');
                aCopyGen.setAttribute('style', 'margin-top: 3px;');

                if (storedSettings[Settings.SHOW_TOAST_ON_ACTION]) {
                    aCopyGen.setAttribute('href', `javascript:Buff.toast('Copied ${gen} to clipboard!');`);
                } else {
                    aCopyGen.setAttribute('href', 'javascript:;');
                }

                aCopyGen.setAttribute('title', gen);

                aCopyGen.addEventListener('click', () => {
                    navigator?.clipboard?.writeText(gen).then(() => {
                        // alert(`Copied ${gen} to clipboard!`);
                        console.debug(`[BuffUtility] Copy gen: ${gen}`);
                    }).catch((e) => console.error('[BuffUtility]', e));
                });

                wearContainer.appendChild(aCopyGen);
            }

            let aShare = document.createElement('a');
            aShare.innerHTML = '<b><i style="margin: -3px 3px 0 0;" class="icon icon_link"></i></b>Share';
            aShare.setAttribute('class', 'ctag btn');
            aShare.setAttribute('href', `https://buff.163.com/market/m/item_detail?classid=${assetInfo.classid}&instanceid=${assetInfo.instanceid}&game=csgo&assetid=${assetInfo.assetid}&sell_order_id=${targetId.getAttribute('data-target-id')}`);
            aShare.setAttribute('target', '_blank');

            nameContainer.parentElement.appendChild(aShare);

            //TODO: color coding on available balance
            let parentBargain = row.lastElementChild;
            let aBargain = <HTMLElement>parentBargain.querySelector('a').cloneNode(true);
            // items below 100 yuan cannot be bargained
            if (+aBargain.getAttribute('data-price') >= 100) {
                parentBargain.setAttribute('style', 'line-height: 200%;');
                aBargain.setAttribute('class', 'c_Blue2 bargain i_Btn i_Btn_mid');
                aBargain.setAttribute('style', 'margin-left: 10px; border: 2px solid #4773C8; background: none; border-radius: 10px;');
                aBargain.setAttribute('data-lowest-bargain-price', `${((+aBargain.getAttribute('data-price'))*0.8).toFixed(1)}`);
                aBargain.removeAttribute('data-goods-sell-min-price');
                aBargain.removeAttribute('data-cooldown');
                aBargain.innerText = 'Bargain';
                parentBargain.querySelector('span').setAttribute('style', 'margin-left: 50px;');

                parentBargain.querySelector('a').after(aBargain);
            }

        }
    }

    init();

}
