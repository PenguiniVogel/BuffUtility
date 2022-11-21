module Adjust_Shop {

    // imports
    import Settings = ExtensionSettings.Settings;
    import getSetting = ExtensionSettings.getSetting;

    // module

    function init(): void {
        window.addEventListener(GlobalConstants.BUFF_UTILITY_INJECTION_SERVICE, (e: CustomEvent<InjectionService.TransferData<unknown>>) => process(e.detail));

        InjectionServiceLib.injectCSS(`
            p strong.f_Strong small {
                font-size: smaller !important;
            }
        `);
    }

    async function process(transferData: InjectionService.TransferData<unknown>): Promise<void> {
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

    async function adjustShopSellOrder(transferData: InjectionService.TransferData<BuffTypes.ShopSellOrder.Data>): Promise<void> {
        // If experimental feature was disabled, ignore.
        if (!await getSetting(Settings.EXPERIMENTAL_ADJUST_SHOP)) {
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
            const li = liList.item(i);
            const tagBox = li.querySelector('.tagBox > .g_Right');
            const priceBox = li.querySelector('p > .f_Strong');
            const priceParent = priceBox?.parentElement;

            const schemaData = (await ISchemaHelper.find(goodsInfo.market_hash_name, true, goodsInfo?.tags?.exterior?.internal_name == 'wearcategoryna')).data[0];

            if (dataRow.appid == 730) {
                if (tagBox.children.length == 2) {
                    tagBox.insertBefore(Util.addAnchorShareAction(dataRow.asset_info.classid, dataRow.asset_info.instanceid, dataRow.asset_info.assetid, dataRow.id), tagBox.firstChild);
                    // only append if we have schema data, which we always should have, but some items have weird CH mappings
                    if (schemaData) {
                        let aCopyGen = document.createElement('a');
                        let gen = Util.generateInspectGen(schemaData, dataRow.asset_info.info.paintindex, dataRow.asset_info.info.paintseed, dataRow.asset_info.paintwear, dataRow.asset_info?.info?.stickers ?? []);

                        if (schemaData?.type == 'Gloves') {
                            aCopyGen.innerHTML = '<i class="icon icon_notes j_tips_handler" data-direction="bottom" data-title="Copy !gengl" style="-webkit-filter: invert(50%);"></i>';
                        } else {
                            aCopyGen.innerHTML = '<i class="icon icon_notes j_tips_handler" data-direction="bottom" data-title="Copy !gen"  style="-webkit-filter: invert(50%);"></i>';
                        }

                        Util.addAnchorToastAction(aCopyGen, `Copied ${gen} to clipboard!`);

                        aCopyGen.setAttribute('title', gen);
                        aCopyGen.setAttribute('style', 'cursor: pointer;');

                        Util.addAnchorClipboardAction(aCopyGen, gen);

                        tagBox.insertBefore(aCopyGen, tagBox.firstChild);
                    }
                }
            }

            if (priceBox) {
                priceBox.innerHTML = `${GlobalConstants.SYMBOL_YUAN} ${await Util.formatNumber(dataRow.price)}`;
            }

            if (priceParent) {
                const { convertedSymbol, convertedFormattedValue } = await Util.convertCNYRaw(dataRow.price);
                const convertedSpan = document.createElement('span');

                convertedSpan.setAttribute('class', 'c_Gray f_12px');
                convertedSpan.innerHTML = ` (${convertedSymbol} ${convertedFormattedValue})`;

                priceParent.append(convertedSpan);
            }
        }
    }

    async function adjustShopFeatured(transferData: InjectionService.TransferData<BuffTypes.ShopFeatured.Data>): Promise<void> {
        // If experimental feature was disabled, ignore.
        if (!await getSetting(Settings.EXPERIMENTAL_ADJUST_SHOP)) {
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
                if (await getSetting(Settings.EXPERIMENTAL_ADJUST_MARKET_CURRENCY)) {
                    const priceConv = await Util.convertCNYRaw(+dataRow.price);
                    priceBox.innerHTML = `${priceConv.convertedSymbol} ${Util.embedDecimalSmall(priceConv.convertedValue)}`;
                } else {
                    priceBox.innerHTML = `${GlobalConstants.SYMBOL_YUAN} ${Util.embedDecimalSmall(dataRow.price)}`;
                }
            }
        }
    }

    async function adjustShopBillOrder(transferData: InjectionService.TransferData<BuffTypes.ShopBillOrder.Data>): Promise<void> {
        // If experimental feature was disabled, ignore.
        if (!await getSetting(Settings.EXPERIMENTAL_ADJUST_SHOP)) {
            console.debug('[BuffUtility] Experimental feature \'Adjust Shop\' is disabled.');
            return;
        }
        
        const liList = <NodeListOf<HTMLElement>>document.querySelectorAll('.recent-deal li');
        let data = transferData.data;

        // if we have no items don't adjust anything
        if (!liList || data.items.length == 0) return;

        for (let i = 0; i < liList.length; i ++) {
            const dataRow = data.items[i];
            const li = liList.item(i);
            const textBox = li.querySelector('p');

            if (textBox) {
                li.setAttribute('style', 'padding-top: 10px; padding-bottom: 10px; border-bottom: 1px solid;');
                const aImgContainer = li.querySelector('a.recent-deal-img');
                if (aImgContainer) {
                    aImgContainer.setAttribute('style', 'margin-bottom: 10px;');
                }

                let timePast = +(textBox.innerText.split('天')[0]);
                timePast = isFinite(timePast) ? timePast : 0;

                textBox.innerHTML = `${GlobalConstants.SYMBOL_YUAN} ${await Util.formatNumber(dataRow.price)} (${timePast}d ago)`;

                const convertedP = document.createElement('p');
                const { convertedSymbol, convertedFormattedValue } = await Util.convertCNYRaw(dataRow.price);

                convertedP.setAttribute('class', 'f_12px');
                convertedP.innerHTML = `${convertedSymbol} ${convertedFormattedValue}`;

                li.append(convertedP);
            }
        }
    }

    init();

}