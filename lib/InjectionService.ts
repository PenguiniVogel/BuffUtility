/**
 * Author: Felix Vogel
 */
/** */
module InjectionService {

    export const BUFF_UTILITY_INJECTION_SERVICE = 'BUFF_UTILITY_INJECTION_SERVICE';

    export interface TransferData<T> {
        status: string,
        url: string,
        data: T
    }

    export let responseCache: TransferData<unknown>[] = [];

    window.addEventListener('message', (e) => {
        if (e.data['transferType'] == BUFF_UTILITY_INJECTION_SERVICE) {
            let data = <TransferData<unknown>>e.data;

            // ignore navigation
            if (!data.url) return;

            // we ignore these as they have no purpose for us (for now)
            if (
                data.url.indexOf('/api/message/notification') > -1 ||
                data.url.indexOf('/market/item_detail') > -1
            ) return;

            console.debug('[BuffUtility] $complete', data.status, data.url, data.data);

            if (data.data) {
                responseCache.push(data);

                if (responseCache.length > 10)
                    responseCache.shift();
            }

            window.dispatchEvent(new CustomEvent(BUFF_UTILITY_INJECTION_SERVICE, { detail: data }));
        }
    });

    let script = document.createElement('script');

    script.innerHTML = `
$.ajaxSetup({
    complete: function(jqXHR, textStatus) {
        // console.log(jqXHR);
        window.postMessage({
            transferType: '${BUFF_UTILITY_INJECTION_SERVICE}',
            status: textStatus,
            url: jqXHR['url'],
            data: jqXHR.responseJSON?.data
        }, '*');
    }
});`;

    let test = setInterval(() => {
        let head = document.getElementsByTagName('head').item(0);

        if (head) {
            head.prepend(script);

            clearInterval(test);
        }
    }, 100);

}
