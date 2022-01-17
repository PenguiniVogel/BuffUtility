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

    /**
     * Inject code <br>
     * This will add a new script tag to the document
     *
     * @param code The code to append
     * @param appendOn Where to append, head or body (head is default)
     */
    export function injectCode(code: string, appendOn: 'head' | 'body' = 'head'): void {
        let a = document.createElement('a');

        code = btoa(encodeURIComponent(code));
        let inner = `s.innerHTML=decodeURIComponent(atob('${code}'))`;

        a.setAttribute('style', 'display: none !important;');
        a.setAttribute('onclick', `(function() { let s = document.createElement('script');s.setAttribute('data-isl', 'injected-script');${inner};document.querySelector('${appendOn}').appendChild(s); })();`);

        document.querySelector('head').appendChild(a);

        a.click();
        a.remove();
    }

    /**
     * Inject css <br>
     * Appends css to the head in a new style tag
     *
     * @param css The css to append
     */
    export function injectCSS(css: string): void {
        let a = document.createElement('a');

        css = btoa(encodeURIComponent(css));
        let inner = `s.innerHTML=decodeURIComponent(atob('${css}'))`;

        a.setAttribute('style', 'display: none !important;');
        a.setAttribute('onclick', `(function() { let s = document.createElement('style');s.setAttribute('data-isl', 'injected-style');${inner};document.querySelector('head').appendChild(s); })();`);

        document.querySelector('head').appendChild(a);

        a.click();
        a.remove();
    }

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

    function interceptNetworkRequests() {
        const open = window.XMLHttpRequest.prototype.open;
        const isNative = open.toString().indexOf('native code') != -1;

        // don't hijack if already hijacked
        if (isNative) {
            // shadow open and capture onLoad
            window.XMLHttpRequest.prototype.open = function() {
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

    function init(): void {
        // if we can't find the body, try again
        if (!document.querySelector('head')) {
            setTimeout(() => init(), 50);

            return;
        }

        injectCode(`${interceptNetworkRequests.toString()}\ninterceptNetworkRequests();`);
        injectCSS(`
td.img_td.can_expand img[data-buff-utility-expand-image] {
    display: none;
}
    
td.img_td.can_expand:hover {
    padding: 20px 0px 20px 0px;
}

td.img_td.can_expand:hover img[data-buff-utility-expand-image] {
    width: auto;
    height: auto;
    display: block;
    position: absolute;
    z-index: 99999;
}

td.img_td.can_expand:hover img[data-buff-utility-expand-image="0"] {
    transform: scale(10) translate(70px, 0px);
}

td.img_td.can_expand:hover img[data-buff-utility-expand-image="1"] {
    transform: scale(8) translate(99px, 10px);
}

td.img_td.can_expand.expand_backdrop:hover img[data-buff-utility-expand-image="0"] {
    background-color: rgb(0 0 0 / 25%);
    background-color: rgba(0, 0, 0, 0.25);
}`);

        console.debug('[BuffUtility] ISL document_end injected tags');
    }

    init();

}
