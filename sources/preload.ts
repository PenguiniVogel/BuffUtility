/**
 * Module to preload certain things
 * Runs at document_start
 */
/** */
module Preload {

    DEBUG && console.debug('[BuffUtility] Module.preload');

    // imports
    import Settings = ExtensionSettings.Settings;
    import getSetting = ExtensionSettings.getSetting;

    // module

    async function init(): Promise<void> {
        // BrowserInterface ping system
        BrowserInterface.setupPingSystem();

        // pre parse to avoid async timing errors
        CurrencyHelper.initialize(false);

        // fetch currency and make sure selected rate is up-to-date
        await getCurrencyCache();
    }

    async function getCurrencyCache(): Promise<void> {
        let currencyName: string = await getSetting(Settings.SELECTED_CURRENCY);

        /**
         * If custom currency, ignore
         */
        if (currencyName == GlobalConstants.BUFF_UTILITY_CUSTOM_CURRENCY) {
            return;
        }

        let currencyCache = await BrowserInterface.Storage.get<any>(GlobalConstants.BUFF_UTILITY_CURRENCY_CACHE);
        let parsedCurrencyCache = Util.tryParseJson<CurrencyHelper.Data>(currencyCache) ?? {} as CurrencyHelper.Data;
        let dateToday = Util.formatDate(new Date());

        let cachedDate = parsedCurrencyCache?.date ?? '';
        let cachedRates = parsedCurrencyCache?.rates ?? {};

        async function cacheCurrency(date: string, data: CurrencyHelper.Data): Promise<void> {
            let rates = data.rates[currencyName];

            let segment: CurrencyHelper.Data = {
                date: date,
                rates: {
                    [currencyName]: rates
                },
                symbols: {}
            };

            DEBUG && console.debug(segment);

            if (await getSetting(Settings.EXPERIMENTAL_FETCH_NOTIFICATION)) {
                Util.signal(['Buff', 'toast'], null, [`Fetched current conversion rates: ${currencyName} -> ${rates[0].toFixed(rates[1])}`]);
            }

            await BrowserInterface.Storage.set({ [GlobalConstants.BUFF_UTILITY_CURRENCY_CACHE]: segment });
        }

        if (cachedDate != dateToday || !(currencyName in cachedRates)) {
            let response = await BrowserInterface.delegate<BrowserInterface.CurrencyCacheGet, CurrencyHelper.Data>({
                method: BrowserInterface.DelegationMethod.CurrencyCache_get,
                parameters: {},
                async: true
            });

            parsedCurrencyCache = response.data;

            await cacheCurrency(dateToday, response.data);
        }

        console.debug(`[BuffUtility] Reading cached current rates for ${currencyName}: [${CurrencyHelper.getData().date}] ${CurrencyHelper.getData().rates[currencyName]} -> [${parsedCurrencyCache.date}] ${parsedCurrencyCache.rates[currencyName]}`);
        CurrencyHelper.getData().rates[currencyName] = parsedCurrencyCache.rates[currencyName];

        // delete cookie
        Cookie.write(GlobalConstants.BUFF_UTILITY_CURRENCY_CACHE, '0', -1);
        Cookie.write('pse_settings', '0', -1);
    }

    init();

}
