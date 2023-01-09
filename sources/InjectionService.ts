module InjectionServiceLib {

    console.debug('[BuffUtility] Module.InjectionServiceLib');

    const ISL_READY = 'EVENT_ISL_READY';

    let injectionsPending: number = 0;
    let readyRetry: number = 0;
    let ready: boolean = false;
    let cspMeta: boolean = false;

    export let encode_content: boolean = true;
    export let append_on_document: boolean = false;
    export let attempt_safe: boolean = true;
    export let html_check_run: 'html' | 'head' | 'body' = 'head';

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
     * @param destroyAfter Destroy the added script tag after injection
     */
    export function injectCode(code: string, appendOn: 'html' | 'head' | 'body' = 'head', destroyAfter: boolean = false): void {
        function _internalInjectSafe(): void {
            let script;
            try {
                script = document.createElement('script');
                script.appendChild(document.createTextNode(code));
                (document.querySelector(appendOn) || document.head || document.documentElement || document).appendChild(script);
            } catch (ex) {
                _internalInjectEncoded();
            }

            if (script && destroyAfter) {
                script.remove();
                script.textContent = '';
            }
        }

        function _internalInjectEncoded(): void {
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
        }

        onReady(() => {
            if (attempt_safe) {
                _internalInjectSafe();
            } else {
                _internalInjectEncoded();
            }
        });
    }

    /**
     * Inject code <br>
     * This will add a new script tag to the document immediately
     *
     * @param code The code to append
     * @param destroyAfter Destroy the added script tag after injection
     */
    export function injectCodeImmediately(code: string, destroyAfter: boolean = false): void {
        console.debug('[InjectionService] Injecting code immediately.');

        function _internalInjectSafe(): void {
            let script;
            try {
                script = document.createElement('script');
                script.appendChild(document.createTextNode(code));
                document.children[0].appendChild(script);
            } catch (ex) {
                _internalInjectEncoded();
            }

            if (script && destroyAfter) {
                script.remove();
                script.textContent = '';
            }
        }

        function _internalInjectEncoded(): void {
            if (cspMeta) {
                let s = document.createElement('script');

                s.setAttribute('data-isl', 'injected-script');

                s.innerHTML = code;

                document.children[0].appendChild(s);
            } else {
                let a = document.createElement('a');

                let inner = `s.innerHTML=\`${code}\``;
                if (encode_content) {
                    code = btoa(encodeURIComponent(code));
                    inner = `s.innerHTML=decodeURIComponent(atob('${code}'))`;
                }

                a.setAttribute('style', 'display: none !important;');
                a.setAttribute('onclick', `(function() { let s = document.createElement('script');s.setAttribute('data-isl', 'injected-script');${inner};document.children[0].appendChild(s); })();`);

                if (append_on_document) document.children[0].appendChild(a);

                a.click();
                a.remove();
            }
        }

        if (attempt_safe) {
            _internalInjectSafe();
        } else {
            _internalInjectEncoded();
        }
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
        if (!!document.querySelector(html_check_run)) {
            ready = true;
            console.debug(`[InjectionService] Ready (took x${readyRetry}, injecting x${injectionsPending})`);
            window.dispatchEvent(new CustomEvent(ISL_READY));
        } else {
            readyRetry ++;
            setTimeout(() => checkReady(), 10);
        }
    }

    checkReady();

}

module InjectionService {

    DEBUG && console.debug('[BuffUtility] Module.InjectionService');

    export interface TransferData<T> {
        status: string,
        url: string,
        data: T
    }

    export let responseCache: TransferData<unknown>[] = [];

    let requestedObjects: {
        [key: string]: any
    } = {};

    let pendingObjectResolvers: {
        [key: number]: (data: any) => void
    } = {};

    window.addEventListener('message', (e) => {
        // console.debug(e);
        if (e.data['transferType'] == GlobalConstants.BUFF_UTILITY_INJECTION_SERVICE) {

            let transferData = <TransferData<unknown>>e.data;

            // ignore navigation
            if (!transferData.url) return;

            let skipCheck = transferData.url.indexOf('www.google-analytics.com') > -1 ||
                transferData.url.indexOf('/api/market/inspect_show_switch') > -1 ||
                transferData.url.indexOf('/api/message/notification') > -1 ||
                transferData.url.indexOf('/api/message/announcement') > -1 ||
                transferData.url.indexOf('/market/item_detail') > -1 ||
                transferData.url.indexOf('steamcommunity.com/actions/') > -1;

            // we ignore these as they have no purpose for us (for now)
            if (skipCheck) {
                DEBUG && console.debug('[BuffUtility] Skipping Request:', transferData.status, '->', transferData.url);
                return;
            } else

            console.debug('[BuffUtility] Captured Request:', transferData.status, '->', transferData.url, transferData.data ? '\n' : '', transferData.data ?? '');

            responseCache.push(transferData);

            if (responseCache.length > 10) {
                responseCache.shift();
            }

            // add a slight delay before dispatching the response somewhere
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent(GlobalConstants.BUFF_UTILITY_INJECTION_SERVICE, { detail: transferData }));
            }, 150);
        } else if (e.data == 'buff_utility_debug') {
            console.debug(responseCache);
        } else if ((e.data ?? [])[0] == GlobalConstants.BUFF_UTILITY_OBJECT_SERVICE_ACK) {
            // ASK/ACK key global/return
            if (e.data.length == 4) {
                const _d = e.data[1];
                if (pendingObjectResolvers[_d]) {
                    let object = e.data[2];
                    requestedObjects[e.data[3]] = object;
                    pendingObjectResolvers[_d](object);

                    delete pendingObjectResolvers[_d];
                }
            }
        }
    });

    /**
     * Get the current game we are browsing the market of
     */
    export async function getGame(): Promise<string> {
        let g: BuffTypes.g = await requestObject('g');

        return g?.game ?? 'unknown';
    }

    /**
     * Request an object from the global scope in the website, must be cloneable
     *
     * @param global The global key (infers window[global])
     */
    export async function requestObject<T>(global: string): Promise<T> {
        const _d = Date.now();
        const _p = new Promise<T>((resolve, _) => {
            if (requestedObjects[global] != null) {
                resolve(requestedObjects[global]);
                return;
            }

            window.postMessage([GlobalConstants.BUFF_UTILITY_OBJECT_SERVICE_ASK, _d, global], '*');
            pendingObjectResolvers[_d] = resolve;

            // resolve after 5 seconds
            setTimeout(() => {
                delete pendingObjectResolvers[_d];
                resolve(null);
            }, 5_000);
        });

        return await _p;
    }

    /**
     * Allows us to shadow a function on a site
     *
     * @param fnStr The function to shadow
     * @param thisArg The argument that is passed
     * @param shadow The shadow function we wish to execute
     * @param options order: The order the shadow function is called in,
     * <code>before</code> means the original function is executed before ours,
     * <code>after</code> means the original function is executed after ours and
     * <code>custom</code> means the original function is only executed if ours returns true
     * variablePass: The variables to pass
     * appendOn: the ISL appendOn option, 'body' by default
     */
    export function shadowFunction(fnStr: string, thisArg: string, shadow: Function, options?: {
        order?: 'before' | 'after' | 'custom',
        variablePass?: {
            [key: string]: any
        },
        appendOn?: 'html' | 'head' | 'body'
    }) {
        options = {
            order: 'before',
            variablePass: {},
            appendOn: 'body',
            ...options
        };

        let shadowBlock = '(function() {\n';

        // inject passed variables
        for (let key of Object.keys(options.variablePass)) {
            if (typeof options.variablePass[key] == 'string') {
                shadowBlock += `    var ${key} = '${options.variablePass[key]}';\n`;
            } else {
                shadowBlock += `    var ${key} = ${options.variablePass[key]};\n`;
            }
        }

        shadowBlock += `    var copy = ${fnStr}.prototype.constructor;\n`;
        shadowBlock += `    ${fnStr} = function () {\n`;

        switch (options.order) {
            case 'after':
                shadowBlock += `        (${shadow.toString()}).apply(${thisArg}, arguments);\n`;
                shadowBlock += `        copy.apply(${thisArg}, arguments);\n`;
                break;
            case 'custom':
                shadowBlock += `        if ((${shadow.toString()}).apply(${thisArg}, arguments)) {\n`;
                shadowBlock += `            copy.apply(${thisArg}, arguments);\n`;
                shadowBlock += '        }\n';
                break;
            case 'before':
            default:
                shadowBlock += `        copy.apply(${thisArg}, arguments);\n`;
                shadowBlock += `        (${shadow.toString()}).apply(${thisArg}, arguments);\n`;
                break;
        }

        shadowBlock += '    };\n';
        shadowBlock += '})();';

        InjectionServiceLib.injectCode(shadowBlock, options.appendOn);
    }

    function interceptNetworkRequests() {
        const open = window.XMLHttpRequest.prototype.open;
        const isNative = open.toString().indexOf('native code') != -1;

        // don't hijack if already hijacked
        if (isNative) {
            // shadow open and capture onLoad
            window.XMLHttpRequest.prototype.open = function() {
                (<XMLHttpRequest>this).addEventListener('load', (e) => {
                    let current = <XMLHttpRequest>e.currentTarget;

                    // simple try-parse
                    function tryParseJSON(r: string): any {
                        try {
                            return JSON.parse(r);
                        } catch (_) {
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

    function buff_utility_message_service(): void {
        window.addEventListener('message', (e) => {
            let key = typeof e.data == 'object' && e.data?.length > 1 ? (e.data ?? [])[0] : null;

            if (typeof key != 'string') {
                return;
            }

            // signal receiver
            if (key == GlobalConstants.BUFF_UTILITY_SIGNAL && e.data.length == 4) {
                let callOrder: string[] = e.data[1];
                let current: any = window;
                for (let caller of callOrder) {
                    current = current[caller];
                }

                if (typeof current == 'function') {
                    let thisArg = null;

                    // if thisArg is something, find if it is a global object, or use self
                    if (e.data[2] != null) {
                        thisArg = window[e.data[2]] ?? e.data[2];
                    }

                    (<() => unknown>current).call(thisArg, e.data[3]);
                }
            }

            // object service
            if (key == GlobalConstants.BUFF_UTILITY_OBJECT_SERVICE_ASK && e.data.length == 3) {
                // ASK/ACK key global/return
                window.postMessage([
                    GlobalConstants.BUFF_UTILITY_OBJECT_SERVICE_ACK,
                    e.data[1],
                    window[e.data[2] ?? ''] ?? null,
                    e.data[2] ?? ''
                ], '*');
            }
        });
    }

    function init(): void {
        InjectionServiceLib.attempt_safe = false;
        InjectionServiceLib.html_check_run = 'html';

        InjectionServiceLib.injectCodeImmediately(`
            ${buff_utility_message_service.toString()}
            buff_utility_message_service();
            ${interceptNetworkRequests.toString()}
            interceptNetworkRequests();
        `);
    }

    init();

}
