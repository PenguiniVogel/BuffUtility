/**
 * Author: Felix Vogel
 */
/** */
var InjectionService;
(function (InjectionService) {
    InjectionService.BUFF_UTILITY_INJECTION_SERVICE = 'BUFF_UTILITY_INJECTION_SERVICE';
    InjectionService.responseCache = [];
    window.addEventListener('message', function (e) {
        if (e.data['transferType'] == InjectionService.BUFF_UTILITY_INJECTION_SERVICE) {
            var data = e.data;
            // ignore navigation
            if (!data.url)
                return;
            // we ignore these as they have no purpose for us (for now)
            if (data.url.indexOf('/api/message/notification') > -1 ||
                data.url.indexOf('/market/item_detail') > -1)
                return;
            console.debug('[BuffUtility] $complete', data.status, data.url, data.data);
            if (data.data) {
                InjectionService.responseCache.push(data);
                if (InjectionService.responseCache.length > 10)
                    InjectionService.responseCache.shift();
            }
            window.dispatchEvent(new CustomEvent(InjectionService.BUFF_UTILITY_INJECTION_SERVICE, { detail: data }));
        }
    });
    var script = document.createElement('script');
    script.innerHTML = "\n$.ajaxSetup({\n    complete: function(jqXHR, textStatus) {\n        // console.log(jqXHR);\n        window.postMessage({\n            transferType: '" + InjectionService.BUFF_UTILITY_INJECTION_SERVICE + "',\n            status: textStatus,\n            url: jqXHR['url'],\n            data: jqXHR.responseJSON?.data\n        }, '*');\n    }\n});";
    var test = setInterval(function () {
        var head = document.getElementsByTagName('head').item(0);
        if (head) {
            head.prepend(script);
            clearInterval(test);
        }
    }, 100);
})(InjectionService || (InjectionService = {}));
