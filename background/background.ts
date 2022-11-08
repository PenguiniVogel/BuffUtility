module Background {

    console.debug('[BuffUtility:Background] Initialized.');

    BrowserInterface.addListener((request, sender, sendResponse) => {
        console.log(request, sender);

        const safe = (request ?? {} as BrowserInterface.UnknownDelegation);
        const async = 'async' in safe ? (safe.async ?? false) : false;

        if ('method' in safe && 'parameters' in safe) {
            if (safe.method == BrowserInterface.DelegationMethod.SchemaHelper_find) {
                sendResponse({
                    received: true,
                    type: safe.method,
                    data: SchemaHelper.find(safe.parameters.name, safe.parameters.weaponOnly, safe.parameters.isVanilla, safe.parameters.reduceInformation)
                });

                return async;
            }

            if (safe.method == BrowserInterface.DelegationMethod.BuffSchema_get) {
                sendResponse({
                    received: true,
                    type: safe.method,
                    data: SchemaData.BUFF_SCHEMA.hash_to_id[safe.parameters.name]
                });

                return async;
            }

            if (safe.method == BrowserInterface.DelegationMethod.BuffBargain_fetch) {
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
        }

        sendResponse({ received: true, type: 'unknown', data: null });

        return async;
    });

}
