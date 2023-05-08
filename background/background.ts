module Background {

    console.debug('[BuffUtility] Module.Background');

    BrowserInterface.addListener((request, sender, sendResponse) => {
        console.log(request, sender);

        const safe = (request ?? {} as BrowserInterface.BaseDelegation);
        const async = 'async' in safe ? (safe.async ?? false) : false;

        if ('method' in safe && 'parameters' in safe) {
            if (safe.method == BrowserInterface.DelegationMethod.SCHEMA_HELPER_FIND) {
                sendResponse({
                    received: true,
                    type: safe.method,
                    data: SchemaHelper.find(safe.parameters.name, safe.parameters.weaponOnly, safe.parameters.isVanilla, safe.parameters.reduceInformation)
                });

                return async;
            }

            if (safe.method == BrowserInterface.DelegationMethod.BUFF_SCHEMA_GET) {
                sendResponse({
                    received: true,
                    type: safe.method,
                    data: SchemaData.BUFF_SCHEMA[safe.parameters.name]
                });

                return async;
            }

            if (safe.method == BrowserInterface.DelegationMethod.BUFF_BARGAIN_FETCH) {
                fetch(`https://proxy-a.penguini-software.workers.dev/fetch_bargain_status`, {
                    method: 'POST',
                    body: JSON.stringify(safe.parameters)
                }).then(x => x.text().then(data => {
                    sendResponse({
                        received: true,
                        type: safe.method,
                        data: data
                    });
                }));

                return async;
            }

            if (safe.method == BrowserInterface.DelegationMethod.CURRENCY_CACHE_GET) {
                CurrencyHelper.initialize(true, (data) => {
                    sendResponse({
                        received: true,
                        type: safe.method,
                        data: data
                    });
                });

                return async;
            }
        }

        sendResponse({ received: true, type: 'unknown', data: null });

        return async;
    });

}
