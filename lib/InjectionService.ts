module InjectionService {

    // BUFF_UTILITY_INJECTION_SERVICE

    export interface TransferData {
        status: string,
        url: string,
        data: any
    }

    window.addEventListener('message', (e) => {
        if (e.data['transferType'] == 'BUFF_UTILITY_INJECTION_SERVICE') {
            let data = <TransferData>e.data;

            console.debug('[BuffUtility] $complete', data.status, data.url, data.data);
        }
    });

    let script = document.createElement('script');

    script.innerHTML = `
$.ajaxSetup({
    complete: function(jqXHR, textStatus) {
        console.log(jqXHR);
        window.postMessage({
            transferType: 'BUFF_UTILITY_INJECTION_SERVICE',
            status: textStatus,
            url: jqXHR['url'],
            data: jqXHR.responseJSON?.data
        }, '*');
    }
});`;

    document.getElementsByTagName('head').item(0).append(script);

}
