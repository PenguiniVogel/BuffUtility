module Adjust_Shop {
    
    // imports
    import Settings = ExtensionSettings.Settings;

    function process(transferData: InjectionService.TransferData<unknown>): void {
        if (transferData.url.match(/\/shop\/.+\/sell_order/)) {
            console.debug('[BuffUtility] Adjust_Shops (/sell_order)');
            adjustShopSellOrder(<InjectionService.TransferData<BuffTypes.ShopSellOrder.Data>>transferData);
        }
    }

    function adjustShopSellOrder(transferData: InjectionService.TransferData<BuffTypes.ShopSellOrder.Data>): void {
        
    }

    window.addEventListener(GlobalConstants.BUFF_UTILITY_INJECTION_SERVICE, (e: CustomEvent<InjectionService.TransferData<unknown>>) => process(e.detail));

}