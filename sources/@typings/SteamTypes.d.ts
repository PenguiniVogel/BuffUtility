declare var g_bBusyLoadingMarketHistory: boolean;
declare var g_bIsLoadedMarketHistory: boolean;

declare var g_oMyHistory: CAjaxPagingControls;

declare var g_sessionID: string;

declare var pse_steamCurrencySymbol: string;

interface SteamJQuery<TElement> extends JQuery<TElement> {

    innerHTML: string;

}

declare module Ajax {

    export interface MyHistoryResponse {
        results_html: string,
        assets: any,
        hovers: string,
        total_count: number,
        pagesize: number
    }

    export function Request(url: string, options: {
        method?: string,
        parameters?: any,
        onSuccess?(transport?: {
            responseJSON: MyHistoryResponse
        } | any): void,
        onComplete?(): void,
        onFailure?(transport?: any): void
    }): void;

}

declare function MergeWithAssetArray(data: any): void;

declare interface CAjaxPagingControls {
    SetResponseHandler(handler: (data: Ajax.MyHistoryResponse) => void);
    GoToPage(iPage: number, bForce: boolean);
}

declare function CAjaxPagingControls(options: any, url: string): void;
