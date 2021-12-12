/**
 * Author: Felix Vogel
 */
/** */
module InjectionService {

    export interface TransferData<T> {
        status: string,
        url: string,
        data: T
    }

    export let responseCache: TransferData<unknown>[] = [];

    window.addEventListener('message', (e) => {
        if (e.data['transferType'] == GlobalConstants.BUFF_UTILITY_INJECTION_SERVICE) {
            let transferData = <TransferData<unknown>>e.data;

            // ignore navigation
            if (!transferData.url) return;

            // we ignore these as they have no purpose for us (for now)
            if (
                transferData.url.indexOf('www.google-analytics.com') > -1 ||
                transferData.url.indexOf('/api/market/inspect_show_switch') > -1 ||
                transferData.url.indexOf('/api/message/notification') > -1 ||
                transferData.url.indexOf('/market/item_detail') > -1
            ) return;

            console.debug('[BuffUtility] captured', transferData.status, '->', transferData.url, transferData.data ? '\n' : '', transferData.data ?? '');

            if (transferData.data) {
                responseCache.push(transferData);

                if (responseCache.length > 10)
                    responseCache.shift();
            }

            // add a slight delay before dispatching the response somewhere
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent(GlobalConstants.BUFF_UTILITY_INJECTION_SERVICE, { detail: transferData }));
            }, 150);
        }
    });

    let customScript = document.createElement('script');

    function interceptNetworkRequests() {
        const open = XMLHttpRequest.prototype.open;
        const isNative = open.toString().indexOf('native code') != -1;

        // don't hijack if already hijacked
        if (isNative) {
            // shadow open and capture onLoad
            XMLHttpRequest.prototype.open = function() {
                this.addEventListener('load', (e) => {
                    let current = <XMLHttpRequest>e.currentTarget;

                    // simple try-parse
                    function tryParseJSON(r: string): any {
                        try {
                            return JSON.parse(r);
                        } catch (e) {
                            return undefined;
                        }
                    }

                    // request finished loading
                    if (current.readyState == 4) {
                        window.postMessage({
                            transferType: GlobalConstants.BUFF_UTILITY_INJECTION_SERVICE,
                            status: current.status,
                            url: current.responseURL,
                            data: tryParseJSON(current.responseText)?.data
                        }, '*');
                    }
                });

                return open.apply(this, arguments);
            };
        }
    }

    customScript.innerHTML = `${(interceptNetworkRequests).toString()}\n    interceptNetworkRequests();`;

    let customStyles = document.createElement('style');

    customStyles.innerHTML = `
td.img_td.can_expand:hover {
    padding: 20px 0px 16px 0px;
}

td.img_td.can_expand:hover div[style].pic-cont img {
    position: absolute;
    transform: scale(10) translate(70px, 0px);
    z-index: 99999;
}

td.img_td.can_expand.expand_backdrop:hover div[style].pic-cont img {
    background-color: rgb(0 0 0 / 25%);
    background-color: rgba(0, 0, 0, 0.25);
}`;

    let test = setInterval(() => {
        let head = document.getElementsByTagName('head').item(0);

        if (head) {
            head.prepend(customScript, customStyles);

            clearInterval(test);
        }
    }, 100);

}
