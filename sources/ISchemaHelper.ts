module ISchemaHelper {

    export async function find(name: string, weaponOnly: boolean = false, isVanilla: boolean = false, reduceInformation: boolean = false) {
        return await BrowserInterface.delegate<BrowserInterface.SchemaHelperFindDelegation, SchemaTypes.Weapon[]>({
            method: BrowserInterface.DelegationMethod.SchemaHelper_find,
            parameters: {
                name: name,
                weaponOnly: weaponOnly,
                isVanilla: isVanilla,
                reduceInformation: reduceInformation
            }
        });
    }

}
