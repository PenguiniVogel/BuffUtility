module AdjustFavourites {

    async function init(): Promise<void> {
        // if not csgo, skip
        if (window.location.href.indexOf('game=csgo') == -1) return;

        console.debug('[BuffUtility] Adjust_Favourites');

        let rows = <NodeListOf<HTMLElement>>(document.querySelector('table.list_tb.list_tb_csgo')?.querySelectorAll('tr'));

        // if no rows, skip
        if (rows?.length == 0) return;

        let { strBalance, isBalanceYuan, nrBalance } = Util.getAccountBalance();

        for (let i = 0, l = rows.length; i < l; i++) {
            let row = rows.item(i);
            let imgContainer = (<HTMLElement>row.querySelector('div.pic-cont[data-orderid]'));
            let nameContainer = (<HTMLElement>row.querySelector('div.name-cont h3'));
            let aAssetInfo = <HTMLElement>row.querySelector('a[data-asset-info]');
            let wearContainer = row.querySelector('div.csgo_value');
            let targetId = row.querySelector('[data-target-id]');

            // convert price
            let contentTDList = row.querySelectorAll('td');
            let priceTD = null;
            for (let i = 0, l = contentTDList.length; i < l; i ++) {
                if (contentTDList.item(i).innerText.indexOf(GlobalConstants.SYMBOL_YUAN) > -1) {
                    priceTD = contentTDList.item(i);
                    break;
                }
            }

            if (priceTD) {
                let priceCNY = +((/¥ (\d+(\.\d+)?)/.exec(priceTD.innerText) ?? [null, NaN])[1]);
                if (isFinite(priceCNY)) {
                    let priceStr = `${GlobalConstants.SYMBOL_YUAN} ${Util.embedDecimalSmall(`${priceCNY}`)}`;
                    const formattedPrice = Util.formatNumber(priceCNY);
                    if (formattedPrice.wasCompressed || formattedPrice.wasFormatted) {
                        priceStr = `${GlobalConstants.SYMBOL_YUAN} ${formattedPrice.strNumber}`;
                    }

                    let converted_price_str = Util.convertCNY(priceCNY);
                    const { convertedSymbol, convertedValue } = Util.convertCNYRaw(priceCNY);
                    const formattedConverted = Util.formatNumber(convertedValue);
                    if (formattedConverted.wasCompressed || formattedConverted.wasFormatted) {
                        converted_price_str = `${convertedSymbol} ${formattedConverted.strNumber}`;
                    }

                    priceTD.innerHTML = Util.buildHTML('p', {
                        content: Util.buildHTML('strong', {
                            attributes: {
                                'title': `${GlobalConstants.SYMBOL_YUAN} ${Util.embedDecimalSmall(Util.formatNumber(priceCNY, false, ExtensionSettings.CurrencyNumberFormats.FORMATTED).strNumber)}`
                            },
                            class: 'f_Strong',
                            content: [ priceStr, formattedPrice.wasCompressed ? 'K' : '' ]
                        })
                    }) + Util.buildHTML('p', {
                        class: 'c_Gray f_12px',
                        content: [ '(', Util.embedDecimalSmall(converted_price_str), formattedConverted.wasCompressed ? 'K' : '', ')' ]
                    });
                }
            }

            if (!imgContainer || !aAssetInfo || !(nameContainer?.innerText) || !targetId) continue;

            // item was sold or unlisted, skip
            if (imgContainer.getAttribute('class').indexOf('g-soldout') > -1) {
                continue;
            }

            let assetInfo: BuffTypes.SellOrder.AssetInfo = JSON.parse(aAssetInfo.getAttribute('data-asset-info'));

            let itemType = nameContainer.innerText.split(' | ')[0].replace('（★）', '');
            itemType = ISchemaHelper.NAME_MAPPING_CH[itemType] ?? itemType;

            let f_schemaData = (await ISchemaHelper.find(itemType, true)).data;

            if (f_schemaData?.length > 0) {
                let schemaData = f_schemaData[0];

                if (DEBUG) {
                    console.debug(itemType, schemaData, assetInfo);
                }

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
                aCopyGen.setAttribute('title', gen);

                Util.addAnchorToastAction(aCopyGen, `Copied ${gen} to clipboard!`);
                Util.addAnchorClipboardAction(aCopyGen, gen);

                wearContainer.appendChild(aCopyGen);
            }

            let aShare = document.createElement('a');
            aShare.innerHTML = '<b><i style="margin: -3px 3px 0 0;" class="icon icon_link"></i></b>Share';
            aShare.setAttribute('class', 'ctag btn');
            aShare.setAttribute('href', `https://buff.163.com/market/m/item_detail?classid=${assetInfo.classid}&instanceid=${assetInfo.instanceid}&game=csgo&assetid=${assetInfo.assetid}&sell_order_id=${targetId.getAttribute('data-target-id')}`);
            aShare.setAttribute('target', '_blank');

            nameContainer.parentElement.appendChild(aShare);

            if (getSetting(Settings.EXPERIMENTAL_ALLOW_FAVOURITE_BARGAIN)) {
                // Note: this feature is yet unable to check if the seller has disabled bargaining
                //       https://buff.163.com/api/market/buyer_bargain/create/preview?sell_order_id=220913T2001697026
                //       will enable us to check the code if a bargain can be created, NEEDS to be optional, and off by default.
                //       To avoid a rate limit exceed and potentially being flagged, one page is rather limited in size though.
                let parentBargain = row.lastElementChild;
                let aBuy = <HTMLElement>parentBargain.querySelector('a');
                let aBargain = <HTMLElement>aBuy.cloneNode(true);

                let price = +aBuy.getAttribute('data-price');
                let lowest_bargain_price = price * 0.8;

                // items below 100 yuan cannot be bargained
                if (price >= 100) {
                    parentBargain.setAttribute('style', 'line-height: 200%;');

                    aBargain.setAttribute('class', 'i_Btn i_Btn_mid bargain');
                    aBargain.setAttribute('style', 'margin-left: 5px;');
                    aBargain.setAttribute('data-lowest-bargain-price', `${((+aBargain.getAttribute('data-price'))*0.8).toFixed(1)}`);

                    aBargain.removeAttribute('data-goods-sell-min-price');
                    aBargain.removeAttribute('data-cooldown');

                    aBargain.innerText = 'Bargain';

                    parentBargain.querySelector('span').setAttribute('style', 'margin-left: 50px;');
                    parentBargain.querySelector('a').after(aBargain);

                    if (getSetting(Settings.EXPERIMENTAL_FETCH_FAVOURITE_BARGAIN_STATUS)) {
                        // Disabled for now until proxy properly works
                        //
                        // let classId = imgContainer.getAttribute('data-classid');
                        // let instanceId = imgContainer.getAttribute('data-instanceid');
                        // let assetId = imgContainer.getAttribute('data-assetid');
                        // let orderId = imgContainer.getAttribute('data-orderid');
                        // if (orderId?.length > 0) {
                        //     BrowserInterface.delegate<BrowserInterface.BuffBargainFetchDelegation, string>({
                        //         method: BrowserInterface.DelegationMethod.BuffBargain_fetch,
                        //         async: true,
                        //         parameters: {
                        //             classId: classId,
                        //             instanceId: instanceId,
                        //             assetId: assetId,
                        //             orderId: orderId
                        //         }
                        //     }).then(response => { });
                        // }
                    }
                }

                if (isBalanceYuan) {
                    if (price > nrBalance && getSetting(Settings.COLOR_LISTINGS)[0]) {
                        aBuy.setAttribute('style', `margin-left: 5px; background: ${GlobalConstants.COLOR_BAD} !important;`);
                    }

                    if (lowest_bargain_price > nrBalance && getSetting(Settings.COLOR_LISTINGS)[1]) {
                        aBargain.setAttribute('style', `margin-left: 5px; background: ${GlobalConstants.COLOR_BAD} !important;`);
                    }
                }
            }
        }
    }

    init();

}
