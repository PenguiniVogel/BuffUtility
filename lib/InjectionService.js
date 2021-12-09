var InjectionService;
(function (InjectionService) {
    // BUFF_UTILITY_INJECTION_SERVICE
    window.addEventListener('message', function (e) {
        if (e.data['transferType'] == 'BUFF_UTILITY_INJECTION_SERVICE') {
            var data = e.data;
            console.debug('[BuffUtility] $complete', data.status, data.url, data.data);
        }
    });
    var script = document.createElement('script');
    script.innerHTML = "\n$.ajaxSetup({\n    complete: function(jqXHR, textStatus) {\n        console.log(jqXHR);\n        window.postMessage({\n            transferType: 'BUFF_UTILITY_INJECTION_SERVICE',\n            status: textStatus,\n            url: jqXHR['url'],\n            data: jqXHR.responseJSON?.data\n        }, '*');\n    }\n});";
    document.getElementsByTagName('head').item(0).append(script);
})(InjectionService || (InjectionService = {}));
