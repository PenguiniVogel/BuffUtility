var Util;
(function (Util) {
    function parseJson(_in) {
        if (typeof _in == 'string') {
            return JSON.parse(_in);
        }
        return JSON.parse(_in.responseText);
    }
    Util.parseJson = parseJson;
    function getGoodsId(_in) {
        var _a;
        return ((_a = /goods_id=\d+/.exec(_in)[0]) !== null && _a !== void 0 ? _a : 'goods_id=-1').substr('goods_id='.length);
    }
    Util.getGoodsId = getGoodsId;
    function buildHTML(tag, options) {
        if (options === void 0) { options = {}; }
        if (!tag || tag.length == 0)
            return null;
        var result = "<" + tag;
        if (options.id && options.id.length > 0) {
            result += " id=\"" + options.id + "\"";
        }
        if (options["class"] && options["class"].length > 0) {
            result += " class=\"" + options["class"] + "\"";
        }
        var styles = options.style;
        if (styles && Object.keys(styles).length > 0) {
            result += ' style="';
            var keys = Object.keys(styles);
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var l_Key = keys_1[_i];
                if (l_Key.length > 0) {
                    result += l_Key + ": " + styles[l_Key] + ";";
                }
            }
            result += '"';
        }
        var attributes = options.attributes;
        if (attributes) {
            var keys = Object.keys(attributes);
            if (keys.length > 0) {
                for (var _a = 0, keys_2 = keys; _a < keys_2.length; _a++) {
                    var l_Key = keys_2[_a];
                    if (l_Key && l_Key.length > 0) {
                        result += " " + l_Key;
                        var value = attributes[l_Key];
                        if (value && value.length > 0) {
                            result += "=\"" + value + "\"";
                        }
                    }
                }
            }
        }
        var selfClosing = /area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr/g.test(tag);
        var isPreContentSet = false;
        if (!selfClosing) {
            isPreContentSet = true;
            result += '>';
        }
        var content = options.content;
        if (content && typeof content == 'string' && content.length > 0) {
            if (!isPreContentSet) {
                selfClosing = false;
                result += '>';
            }
            result += content;
        }
        else {
            if (content && content.length > 0) {
                for (var _b = 0, _c = content; _b < _c.length; _b++) {
                    var l_Content = _c[_b];
                    if (!l_Content || l_Content.length == 0)
                        continue;
                    if (!isPreContentSet) {
                        isPreContentSet = true;
                        selfClosing = false;
                        result += '>';
                    }
                    result += l_Content;
                }
            }
        }
        return "" + result + (selfClosing ? '/>' : "</" + tag + ">");
    }
    Util.buildHTML = buildHTML;
})(Util || (Util = {}));
var Cookie;
(function (Cookie) {
    function read(name) {
        var result = new RegExp("(?:^|; )" + encodeURIComponent(name) + "=([^;]*)").exec(document.cookie);
        return result ? result[1] : null;
    }
    Cookie.read = read;
    function write(name, value, days) {
        if (days === void 0) { days = 365 * 20; }
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = name + "=" + value + "; expires=" + date.toUTCString() + "; path=/";
    }
    Cookie.write = write;
})(Cookie || (Cookie = {}));
var fRequest;
(function (fRequest) {
    function get(url, args, callback) {
        var req = new XMLHttpRequest();
        req.onreadystatechange = function (e) {
            if (callback)
                callback(req, args, e);
        };
        req.open('GET', url);
        req.send();
    }
    fRequest.get = get;
})(fRequest || (fRequest = {}));
var BuffApi;
(function (BuffApi) {
    var cachedResponses = {};
    function putCachedResponse(id, type, data) {
        var game = getSelectedGame();
        if (!cachedResponses[game])
            cachedResponses[game] = {};
        if (!cachedResponses[game][id])
            cachedResponses[game][id] = {};
        cachedResponses[game][id][type] = data;
        cachedResponses[game][id][type + "_timestamp"] = Date.now();
    }
    function getCachedResponse(id, type) {
        var game = getSelectedGame();
        if (cachedResponses[game] &&
            cachedResponses[game][id] &&
            cachedResponses[game][id][type] &&
            cachedResponses[game][id][type + "_timestamp"] &&
            cachedResponses[game][id][type + "_timestamp"] + 5 * 60 * 1000 > Date.now()) {
            return cachedResponses[game][id][type];
        }
        return null;
    }
    function getSelectedGame() {
        return document.getElementById('j_game-switcher').getAttribute('data-current');
    }
    BuffApi.getSelectedGame = getSelectedGame;
    function getSellOrderInformation(id, callback, onretry, maxRetry) {
        if (maxRetry === void 0) { maxRetry = 5; }
        var cached = getCachedResponse(id, 'sell');
        if (cached) {
            callback(cached);
            return;
        }
        var url = "https://buff.163.com/api/market/goods/sell_order?game=" + getSelectedGame() + "&goods_id=" + id;
        var retryCount = 0;
        function call() {
            if (retryCount > maxRetry)
                return callback(null);
            fRequest.get(url, [], function (req, args, e) {
                var _a;
                if (req.readyState != 4)
                    return;
                if (req.status != 200) {
                    retryCount++;
                    onretry(req.status);
                    return setTimeout(function () { return call(); }, 2500);
                }
                var result = Util.parseJson(req);
                var goodsInfo = ((_a = result.data.goods_infos[id]) !== null && _a !== void 0 ? _a : {});
                putCachedResponse(id, 'sell', goodsInfo);
                callback(goodsInfo);
            });
        }
        call();
    }
    BuffApi.getSellOrderInformation = getSellOrderInformation;
    function getBuyOrderInformation(id, callback, onretry, maxRetry) {
        if (maxRetry === void 0) { maxRetry = 5; }
        var cached = getCachedResponse(id, 'buy');
        if (cached) {
            callback(cached);
            return;
        }
        var url = "https://buff.163.com/api/market/goods/buy_order?game=" + getSelectedGame() + "&page_num=1&page_size=80&goods_id=" + id;
        var retryCount = 0;
        function call() {
            if (retryCount > maxRetry)
                return callback(null);
            fRequest.get(url, [], function (req, args, e) {
                var _a, _b;
                if (req.readyState != 4)
                    return;
                if (req.status != 200) {
                    retryCount++;
                    onretry(req.status);
                    return setTimeout(function () { return call(); }, 2500);
                }
                var result = Util.parseJson(req);
                var buyOrderInfo;
                for (var i = 0, l = result.data.items.length; i < l; i++) {
                    var it = (_a = result.data.items[i]) !== null && _a !== void 0 ? _a : {};
                    if (((_b = it.specific) !== null && _b !== void 0 ? _b : []).length > 0)
                        continue;
                    buyOrderInfo = it;
                    break;
                }
                putCachedResponse(id, 'buy', buyOrderInfo);
                callback(buyOrderInfo);
            });
        }
        call();
    }
    BuffApi.getBuyOrderInformation = getBuyOrderInformation;
    function getMarketJsonData(callback) {
        var query = window.location.href.split('?')[1];
        var tab = getTab();
        query = query.replace(/#tab=(?:selling|buying|top-bookmarked)/, '');
        queryMarket(tab, query, callback);
    }
    BuffApi.getMarketJsonData = getMarketJsonData;
    function queryMarket(tab, query, callback) {
        if (!tab) {
            return console.error('[BuffApi] No tab specified.');
        }
        switch (tab) {
            case 'selling':
            case 'goods':
                tab = 'goods';
                break;
            case 'buying':
            case 'goods/buying':
                tab = 'goods/buying';
                break;
            case 'top-bookmarked':
            case 'sell_order/top_bookmarked':
                tab = 'sell_order/top_bookmarked';
                break;
            default:
                return console.error('[BuffApi] The specified tab does not match selling, buying or top-bookmarked');
        }
        query = query !== null && query !== void 0 ? query : '';
        fRequest.get("https://buff.163.com/api/market/" + tab + "?" + query, null, function (req, args, e) {
            var _a, _b, _c;
            if (req.readyState != 4)
                return;
            var response;
            try {
                response = Util.parseJson(req);
            }
            catch (_d) { }
            console.info("[BuffUtility] Loaded " + tab + "?" + query + " with " + ((_c = (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.items) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0) + " items.");
            callback(response);
        });
    }
    BuffApi.queryMarket = queryMarket;
    function getTab(url) {
        var _a;
        if (url === void 0) { url = window.location.href; }
        return ((_a = /#tab=(selling|buying|top-bookmarked)/.exec(url)[1]) !== null && _a !== void 0 ? _a : 'selling');
    }
    BuffApi.getTab = getTab;
})(BuffApi || (BuffApi = {}));
var CSGOStashUtility;
(function (CSGOStashUtility) {
    var BUFF_IMG_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAFVBMVEVHcEwhIS0hISshISshISv///+QkJU/x7PBAAAABHRSTlMAJK7xdunbSwAAAFxJREFUeAFjYFR2QQJGAgzCLijAkEEFVcCJwQRVwJnBBQ2QKxAKBXgEwIpTw1AF3EJTEAJQBQgBhAKEQCqaoW5YbHGhuYAbqufCXFJRBVIoC1OMiMKISozIxkgOAEjZind3Npg5AAAAAElFTkSuQmCC';
    function init() {
        if (/^.*csgostash\.com\/skin\/\d+\/.*$/.test(window.location.href)) {
            handleSkinAddition();
        }
        console.info('[CSGOStashUtility] Initialized.');
    }
    CSGOStashUtility.init = init;
    function handleSkinAddition() {
        var itemName = document.querySelector('h2').innerText.trim();
        var tabs = document.querySelector('div.price-details-nav > ul.nav.nav-tabs');
        tabs.innerHTML += "<li role=\"presentation\" class=\"misc-click\"><a href=\"#buffprices\" role=\"tab\" data-toggle=\"tab\" aria-controls=\"buffprices\" aria-expanded=\"true\"><img src=\"" + BUFF_IMG_BASE64 + "\" alt=\"Buff Logo\" class=\"price-tab-icon\"><span class=\"hidden-xs hidden-md\">Buff</span></a></li>";
        var priceDetails = document.querySelector('div.price-details > div.tab-content');
        var itemQuery = "game=csgo#tab=selling&page_num=1&search=" + encodeURIComponent(itemName);
        var pricesTab = "<div role=\"tabpanel\" class=\"tab-pane\" id=\"buffprices\">\n    <div class=\"btn-group-sm btn-group-justified price-bottom-space\">\n        <a href=\"https://buff.163.com/market/?" + itemQuery + "\" target=\"_blank\" rel=\"nofollow\" class=\"btn btn-default btn-sm market-button-skin\">Search buff (All)</a>\n    </div>\n</div>";
        priceDetails.innerHTML += pricesTab;
    }
})(CSGOStashUtility || (CSGOStashUtility = {}));
CSGOStashUtility.init();
