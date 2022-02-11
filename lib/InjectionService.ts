module InjectionServiceLib {

    const ISL_READY = 'EVENT_ISL_READY';

    let injectionsPending: number = 0;
    let readyRetry: number = 0;
    let ready: boolean = false;
    let cspMeta: boolean = false;

    export let encode_content: boolean = true;
    export let append_on_document: boolean = false;

    export function onReady(callback: () => void): void {
        if (ready) {
            callback();
        } else {
            injectionsPending ++;
            window.addEventListener(ISL_READY, () => callback());
        }
    }

    /**
     * CAUTION - This is really, really dangerous! <br>
     * Please for the love of god never ever use this unless you really have to.
     *
     * @param csp
     */
    export function injectCSPMeta(csp: string = `default-src 'self'; style-src 'self' 'unsafe-inline'; media-src *; img-src *; script-src 'self' 'unsafe-eval' 'unsafe-inline' 'sha256-0e/McRxwYjvJoKF1YBMVz5l6AJO3gnkqTbMYg/B2Kp8='`): void {
        onReady(() => {
            let meta = document.createElement('meta');

            meta.setAttribute('data-isl', 'injected-meta');
            meta.setAttribute('http-equiv', 'Content-Security-Policy');
            meta.setAttribute('content', csp);

            document.querySelector('head').appendChild(meta);

            cspMeta = true;
        });
    }

    /**
     * Inject code <br>
     * This will add a new script tag to the document
     *
     * @param code The code to append
     * @param appendOn Where to append, head or body (head is default)
     */
    export function injectCode(code: string, appendOn: 'head' | 'body' = 'head'): void {
        onReady(() => {
            if (cspMeta) {
                let s = document.createElement('script');

                s.setAttribute('data-isl', 'injected-script');

                s.innerHTML = code;

                document.querySelector(appendOn).appendChild(s);
            } else {
                let a = document.createElement('a');

                let inner = `s.innerHTML=\`${code}\``;
                if (encode_content) {
                    code = btoa(encodeURIComponent(code));
                    inner = `s.innerHTML=decodeURIComponent(atob('${code}'))`;
                }

                a.setAttribute('style', 'display: none !important;');
                a.setAttribute('onclick', `(function() { let s = document.createElement('script');s.setAttribute('data-isl', 'injected-script');${inner};document.querySelector('${appendOn}').appendChild(s); })();`);

                if (append_on_document) document.querySelector('head').appendChild(a);

                a.click();
                a.remove();
            }
        });
    }

    /**
     * Inject css <br>
     * Appends css to the head in a new style tag
     *
     * @param css The css to append
     */
    export function injectCSS(css: string): void {
        onReady(() => {
            let a = document.createElement('a');

            let inner = `s.innerHTML=\`${css}\``;
            if (encode_content) {
                css = btoa(encodeURIComponent(css));
                inner = `s.innerHTML=decodeURIComponent(atob('${css}'))`;
            }

            a.setAttribute('style', 'display: none !important;');
            a.setAttribute('onclick', `(function() { let s = document.createElement('style');s.setAttribute('data-isl', 'injected-style');${inner};document.querySelector('head').appendChild(s); })();`);

            if (append_on_document) document.querySelector('head').appendChild(a);

            a.click();
            a.remove();
        });
    }

    // Check if ISL can execute, if used with document_start

    function checkReady(): void {
        if (!!document.querySelector('head')) {
            ready = true;
            console.debug(`[InjectionService] Ready (took x${readyRetry}), injecting x${injectionsPending}`);
            window.dispatchEvent(new CustomEvent(ISL_READY));
        } else {
            readyRetry ++;
            setTimeout(() => checkReady(), 10);
        }
    }

    checkReady();

}

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
    export let requireObjects: {
        [n: string]: any
    } = {};

    window.addEventListener('message', (e) => {
        // console.debug(e);
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
        } else if (e.data == 'buff_utility_debug') {
            console.debug(responseCache, requireObjects);
        } else if ((e.data ?? [])[0] == GlobalConstants.BUFF_UTILITY_OBJECT_SERVICE) {
            let _data = e.data ?? [];
            let object = _data[1] ?? '';
            if (requireObjects[object] == false) {
                requireObjects[object] = _data[2];
            }
        } else if ((e.data ?? [])[0] == GlobalConstants.BUFF_UTILITY_ASK_NARROW) {

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

    function buff_utility_post_object_service(object: string): void {
        window.postMessage([GlobalConstants.BUFF_UTILITY_OBJECT_SERVICE, object, window[object]], '*');
    }

    function init(): void {
        requireObjects['g'] = false;

        InjectionServiceLib.injectCode(`${buff_utility_post_object_service.toString()}\nbuff_utility_post_object_service('g');\n${interceptNetworkRequests.toString()}\ninterceptNetworkRequests();`);
    }

    init();

}
