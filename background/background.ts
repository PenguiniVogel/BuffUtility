module Background {

    import DelegationMethod = BrowserInterface.DelegationMethod;
    BrowserInterface.addListener((request, sender, sendResponse) => {
        console.log(request, sender);

        let inferred: BrowserInterface.UnknownDelegation = request;
        if (request?.method) {
            switch (request.method) {
                case DelegationMethod.SchemaHelper_find:
                    if ('name' in inferred.parameters && 'weaponOnly' in inferred.parameters && 'isVanilla' in inferred.parameters) {
                        sendResponse(SchemaHelper.find(inferred.parameters.name, inferred.parameters.weaponOnly, inferred.parameters.isVanilla, inferred.parameters.reduceInformation));
                    }

                    break;
                case DelegationMethod.BuffSchema_get:
                    if ('name' in inferred.parameters) {
                        sendResponse(SchemaData.BUFF_SCHEMA.hash_to_id[inferred.parameters.name]);
                    }

                    break;
                default:
                    sendResponse({ received: true });
                    break;
            }
        }
    });

}
