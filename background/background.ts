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
            }
        }

        sendResponse({ received: true, type: 'unknown', data: null });
    });

}
