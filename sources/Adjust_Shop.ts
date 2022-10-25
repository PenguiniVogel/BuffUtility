module Adjust_Shop {
    
    // imports
    import Settings = ExtensionSettings.Settings;

    function process(transferData: InjectionService.TransferData<unknown>): void {
        if (transferData.url.match(/\/shop\/.+\/sell_order/)) {
            console.debug('[BuffUtility] Adjust_Shops (/sell_order)');
            adjustShopSellOrder(<InjectionService.TransferData<BuffTypes.ShopSellOrder.Data>>transferData);
        } else if (transferData.url.match(/\/shop\/.+\/featured/)) {
            console.debug('[BuffUtility] Adjust_Shops (/featured)');
            adjustShopFeatured(<InjectionService.TransferData<BuffTypes.ShopFeatured.Data>>transferData);
        } else if (transferData.url.match(/\/shop\/.+\/bill_order/)) {
            console.debug('[BuffUtility] Adjust_Shops (/bill_order)');
            adjustShopBillOrder(<InjectionService.TransferData<BuffTypes.ShopBillOrder.Data>>transferData);
        }
    }

    function adjustShopSellOrder(transferData: InjectionService.TransferData<BuffTypes.ShopSellOrder.Data>): void {
        // If experimental feature was disabled, ignore.
        if (!getSetting(Settings.EXPERIMENTAL_ADJUST_SHOP)) {
            console.debug('[BuffUtility] Experimental feature \'Adjust Shop\' is disabled.');
            return;
        }
        
        const liList = <NodeListOf<HTMLElement>>document.querySelectorAll('#j_list_card li');
        let data = transferData.data;

        // if we have no items don't adjust anything
        if (!liList || data.total_count == 0) return;

        for (let i = 0; i < liList.length; i ++) {
            const dataRow = data.items[i];
            const goodsInfo = data.goods_infos[dataRow.goods_id];
            const tagBox = <HTMLElement>liList.item(i).querySelector('.tagBox > .g_Right');
            const priceBox = <HTMLElement>liList.item(i).querySelector('p > .f_Strong');

            const schemaData = SchemaHelper.find(goodsInfo.market_hash_name, true, goodsInfo?.tags?.exterior?.internal_name == 'wearcategoryna')[0];

            if (dataRow.appid == 730) {
                const aShare = document.createElement('a');
                aShare.setAttribute('style', 'cursor: pointer;');
                aShare.setAttribute('href', `https://buff.163.com/market/m/item_detail?classid=${dataRow.asset_info.classid}&instanceid=${dataRow.asset_info.instanceid}&game=csgo&assetid=${dataRow.asset_info.assetid}&sell_order_id=${dataRow.id}`);
                aShare.setAttribute('target', '_blank');
                aShare.innerHTML = '<i class="icon icon_link j_tips_handler" data-direction="bottom" data-title="Share"></i>';

                let aCopyGen = document.createElement('a');
                let gen = Util.generateInspectGen(schemaData, dataRow.asset_info.info.paintindex, dataRow.asset_info.info.paintseed, dataRow.asset_info.paintwear, dataRow.asset_info?.info?.stickers ?? []);
                if (schemaData) {
                    if (schemaData?.type == 'Gloves') {
                        aCopyGen.innerHTML = '<i class="icon icon_notes j_tips_handler" data-direction="bottom" data-title="Copy !gengl" style="-webkit-filter: invert(50%);"></i>';
                    } else {
                        aCopyGen.innerHTML = '<i class="icon icon_notes j_tips_handler" data-direction="bottom" data-title="Copy !gen"  style="-webkit-filter: invert(50%);"></i>';
                    }
                }

                Util.addAnchorToastAction(aCopyGen, `Copied ${gen} to clipboard!`);

                aCopyGen.setAttribute('title', gen);
                aCopyGen.setAttribute('style', 'cursor: pointer;');
                aCopyGen.addEventListener('click', () => {
                    navigator?.clipboard?.writeText(gen).then(() => {
                        console.debug(`[BuffUtility] Copy gen: ${gen}`);
                    }).catch((e) => console.error('[BuffUtility]', e));
                });

                if (tagBox.children.length == 2) {
                    tagBox.insertBefore(aShare, tagBox.firstChild);
                    // only append if we have schema data, which we always should have, but some items have weird CH mappings
                    if (schemaData) {
                        tagBox.insertBefore(aCopyGen, tagBox.firstChild);
                    }
                }
            }

            if (priceBox) {
                const priceConv = Util.convertCNYRaw(Number(dataRow.price));
                priceBox.innerHTML = `${priceConv.convertedSymbol} ${priceConv.convertedValue.split('.')[0]}<small>.${priceConv.convertedValue.split('.')[1]}</small>`;
            }
        }
    }

    function adjustShopFeatured(transferData: InjectionService.TransferData<BuffTypes.ShopFeatured.Data>): void {
        // If experimental feature was disabled, ignore.
        if (!getSetting(Settings.EXPERIMENTAL_ADJUST_SHOP)) {
            console.debug('[BuffUtility] Experimental feature \'Adjust Shop\' is disabled.');
            return;
        }
        
        const liList = <NodeListOf<HTMLElement>>document.querySelectorAll('#j_recommend li');
        let data = transferData.data;

        // if we have no items don't adjust anything
        if (!liList || data.items.length == 0) return;

        for (let i = 0; i < liList.length; i ++) {
            const dataRow = data.items[i];
            const priceBox = <HTMLElement>liList.item(i).querySelector('p > .c_Yellow');

            if (priceBox) {
                const priceConv = Util.convertCNYRaw(Number(dataRow.price));
                priceBox.innerHTML = `${priceConv.convertedSymbol} ${priceConv.convertedValue.split('.')[0]}<small>.${priceConv.convertedValue.split('.')[1]}</small>`;
            }
        }
    }

    function adjustShopBillOrder(transferData: InjectionService.TransferData<BuffTypes.ShopBillOrder.Data>): void {
        // If experimental feature was disabled, ignore.
        if (!getSetting(Settings.EXPERIMENTAL_ADJUST_SHOP)) {
            console.debug('[BuffUtility] Experimental feature \'Adjust Shop\' is disabled.');
            return;
        }
        
        const liList = <NodeListOf<HTMLElement>>document.querySelectorAll('.recent-deal li');
        let data = transferData.data;

        // if we have no items don't adjust anything
        if (!liList || data.items.length == 0) return;

        for (let i = 0; i < liList.length; i ++) {
            const dataRow = data.items[i];
            const textBox = <HTMLElement>liList.item(i).querySelector('p');

            if (textBox) {
                const priceConv = Util.convertCNYRaw(Number(dataRow.price));
                const timePast = Number(textBox.innerText.split('天')[0]);
                textBox.innerHTML = `${priceConv.convertedSymbol} ${priceConv.convertedValue} (${isNaN(timePast)?0:timePast}d ago)`;
            }
        }
    }

    window.addEventListener(GlobalConstants.BUFF_UTILITY_INJECTION_SERVICE, (e: CustomEvent<InjectionService.TransferData<unknown>>) => process(e.detail));

}