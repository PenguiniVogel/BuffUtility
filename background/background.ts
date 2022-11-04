module Background {

    console.debug('[BuffUtility:Background] Initialized.');

    BrowserInterface.addListener((request, sender, sendResponse) => {
        console.log(request, sender);

        if ('method' in request){
            if (request.method == BrowserInterface.DelegationMethod.SchemaHelper_find) {
                sendResponse({
                    received: true,
                    type: request.method,
                    data: SchemaHelper.find(request.parameters.name, request.parameters.weaponOnly, request.parameters.isVanilla, request.parameters.reduceInformation)
                });

                return;
            }

            if (request.method == BrowserInterface.DelegationMethod.BuffSchema_get) {
                sendResponse({
                    received: true,
                    type: request.method,
                    data: SchemaData.BUFF_SCHEMA.hash_to_id[request.parameters.name]
                });

                return;
            }

            if (request.method == BrowserInterface.DelegationMethod.BuffBargain_fetch) {
                fetch(`https://proxy-a.penguini-software.workers.dev/fetch_bargain_status`, {
                    method: 'POST',
                    body: JSON.stringify(request.parameters)
                }).then(x => x.text().then(data => {
                    sendResponse({
                        received: true,
                        type: request.method,
                        data: data
                    });
                }));

                // return true is important here to tell chrome to keep the port open for an async response
                return true;
            }
        }

        sendResponse({ received: true, type: 'unknown', data: null });

        return;
    });

}
