module Adjust_Share {

    DEBUG && console.debug('%c■', 'color: #0000ff', '[BuffUtility] Module.Adjust_Share');

    // imports
    import Settings = ExtensionSettings.Settings;
    import getSetting = ExtensionSettings.getSetting;

    // module

    interface LaunchData {
        type?: unknown,
        param?: string
    }

    interface LaunchParams {
        game: string,
        goods_id: string,
        price?: string,
        sell_order_id?: string
    }

    async function init(): Promise<void> {
        if (!await getSetting(Settings.MODULE_ADJUST_SHARE)) {
            console.debug('%c■', 'color: #ff0000', '[BuffUtility] Adjust_Share - disabled');
            return;
        } else {
            console.debug('%c■', 'color: #00ff00', '[BuffUtility] Adjust_Share');
        }

        if (await getSetting(Settings.EXPERIMENTAL_ADJUST_SHARE)) {
            process();
        }
    }

    async function process(): Promise<void> {
        let data: LaunchData = (await InjectionService.requestObject('launchData')) ?? {};

        // if param is not present in launchData, skip
        // as we need the goodsId
        if (!('param' in data)) {
            return;
        }

        let parsedParam: LaunchParams = JSON.parse(data.param);

        // if not csgo, skip
        // if no price, skip, as it is not on sale
        if (parsedParam.game != 'csgo' || !('price' in parsedParam)) {
            return;
        }

        let baseURL = `https://buff.163.com/goods/${parsedParam.goods_id}?from=market#tab=selling&sort_by=default`;

        const g = await InjectionService.requestObject<BuffTypes.g>('g');
        let parsedPrice = parseFloat(parsedParam.price);

        if (isFinite(parsedPrice) && isFinite(g?.currency?.rate_base_cny)) {
            // convert to whatever user currency, because min_price and max_price are currency dependent, thanks buff
            parsedPrice = parsedPrice * g.currency.rate_base_cny;
            baseURL += `&min_price=${Math.max(0.01, parsedPrice - 0.01).toFixed(2)}&max_price=${(parsedPrice + 0.01).toFixed(1)}`;
        }

        const information = <NodeListOf<HTMLElement>>document.querySelectorAll('div.title-info-wrapper p');

        console.debug(information);

        if (information.length > 0) {
            let offset = information.item(0)?.getAttribute('class')?.indexOf('name_tag') > -1 ? 1 : 0;

            if (offset == 1) {
                baseURL += `&name_tag=1`;
            }

            let paintSeed = (/(\d+)/.exec(information.item(offset)?.innerText ?? '') ?? [])[1];

            if (paintSeed) {
                baseURL += `&paintseed=${paintSeed}`;
            }

            let float = (/(0\.\d+)/.exec(information.item(offset + 2)?.innerText ?? '') ?? [])[1];

            if (float) {
                let shortFloat = float.substring(0, 6);

                baseURL += `&min_paintwear=${shortFloat}`;

                let floatNum = (+shortFloat + 0.0001);
                if (floatNum < 1) {
                    baseURL += `&max_paintwear=${floatNum.toFixed(4)}`;
                }
            }
        }

        const hasStickers = (document.querySelectorAll('div.sticker-wrapper') ?? []).length > 0;

        if (hasStickers) {
            baseURL += `&extra_tag_ids=non_empty`;
        }

        console.debug(baseURL, parsedParam);

        InjectionServiceLib.injectCode(`
            BUFFAPP.launchApp = function(_) { console.debug('[BuffUtility] Attempted executing override for BUFFAPP.launchApp'); };
        `, 'body');

        const goodsDetailFooter = <HTMLElement>document.querySelector('div.good-detail-footer');

        const { convertedSymbol, convertedValue } = await Util.convertCNYRaw(+parsedParam.price);
        const convertedSpan = goodsDetailFooter.querySelector('h6 span.c_Gray');

        convertedSpan.setAttribute('class', 'c_Gray f_12px');
        convertedSpan.setAttribute('style', 'color: #959595;');
        convertedSpan.innerHTML = `(${convertedSymbol} ${Util.embedDecimalSmall(convertedValue)})`;

        const buttonContainer = <HTMLElement>goodsDetailFooter.querySelector('p');

        buttonContainer.innerHTML = Util.buildHTML('a', {
            class: 'i_Btn_main',
            attributes: {
                'href': baseURL,
                'target': '_blank'
            },
            content: [ 'Show on market' ]
        });

        const spacer = document.createElement('p');

        spacer.setAttribute('style', 'width: 20px;');

        goodsDetailFooter.append(spacer);
    }

    init();

}
