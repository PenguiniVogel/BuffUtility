var COOKIE_BUFF_UTILITY_OPTIONS = 'buff_utility_options';
var SYMBOL_YUAN = '¥';
var SYMBOL_ARROW_UP = '▲';
var SYMBOL_ARROW_DOWN = '▼';
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
var BuffUtility;
(function (BuffUtility) {
    var ATTR_CONVERTED_CURRENCY = 'data-buff-utility-converted-currency';
    var ATTR_CONVERTED_BUY_ORDER = 'data-buff-utility-converted-buy-order';
    var NOT_CONVERTED_CURRENCY = ":not([" + ATTR_CONVERTED_CURRENCY + "])";
    var NOT_CONVERTED_BUY_ORDER = ":not([" + ATTR_CONVERTED_BUY_ORDER + "])";
    var ATTR_REQUESTED_REFERENCE_PRICE = 'data-buff-utility-requested-reference-price';
    var NOT_REQUESTED_REFERENCE_PRICE = ":not([" + ATTR_REQUESTED_REFERENCE_PRICE + "])";
    var ATTR_REQUESTED_BO_PRICE = 'data-buff-utility-requested-buy-order-price';
    var NOT_REQUESTED_BO_PRICE = ":not([" + ATTR_REQUESTED_BO_PRICE + "])";
    var BUFF_UTILITY_HOVER = 'data-buff-utility-target="converted-hover-currency"';
    var selectors = [
        {
            pattern: /^.*buff\.163\.com.*$/,
            queries: [
                "h4" + NOT_CONVERTED_CURRENCY + " > #navbar-cash-amount",
                ".index-goods-list > li > p" + NOT_CONVERTED_CURRENCY + " > strong.f_Strong"
            ]
        },
        {
            pattern: /^.*buff\.163\.com\/user-center\/asset\/recharge.*$/,
            queries: [
                "div" + NOT_CONVERTED_CURRENCY + " > #alipay_amount",
                "div" + NOT_CONVERTED_CURRENCY + " > #cash_amount",
                "div" + NOT_CONVERTED_CURRENCY + " > #frozen_amount"
            ]
        },
        {
            pattern: /^.*buff\.163\.com\/market\/(buy_order\/to_create)?\?game=.*$/,
            queries: []
        },
        {
            pattern: /^.*buff\.163\.com\/market\/goods\?.*(?:tab=(?:selling|buying|top-bookmarked))?.*$/,
            queries: [
                ".list_tb > tbody > tr > td > div" + NOT_CONVERTED_CURRENCY + " > strong.f_Strong",
                "#j_popup_supply_sell_preview td > ul > li:nth-child(2) > span" + NOT_CONVERTED_CURRENCY + ".f_Strong > span"
            ]
        },
        {
            pattern: /^.*buff\.163\.com\/market\/(?:goods\?.*tab=history.*|sell_order\/history.*|buy_order\/(?:wait_supply|supplied|history).*)$/,
            queries: [
                ".list_tb > tbody > tr > td" + NOT_CONVERTED_CURRENCY + " > strong.f_Strong"
            ]
        },
        {
            pattern: /^.*buff\.163\.com\/market\/sell_order\/stat.*$/,
            queries: [
                "#j_sold-count > div.count-item > ul > li" + NOT_CONVERTED_CURRENCY + ":first-child > h5"
            ]
        },
        {
            pattern: /^.*buff\.163\.com\/market\/steam_inventory.*$/,
            queries: [
                "#j_list_card > ul > li > p" + NOT_CONVERTED_CURRENCY + " > strong.f_Strong"
            ]
        },
        {
            pattern: /^.*buff\.163\.com\/market\/buy_order\/to_create\?game=.*$/,
            queries: [
                "td > ul > li" + NOT_CONVERTED_CURRENCY + " > strong.f_Strong.sell-MinPrice",
                "td > ul > li" + NOT_CONVERTED_CURRENCY + " > strong.f_Strong.buy-MaxPrice"
            ]
        },
        {
            pattern: /^.*buff\.163\.com\/market\/buy_order\/to_create\?game=.*$/,
            queries: [
                "tr > td > span.f_Strong.total_amount"
            ],
            ignoreLog: true
        },
        {
            pattern: /^.*buff\.163\.com\/market\/goods\?.*(?:tab=(?:selling|buying|top-bookmarked))?.*$/,
            queries: [
                "#supply_sell_total_price"
            ],
            ignoreLog: true
        },
        {
            pattern: /^.*buff\.163\.com\/market\/sell_order\/to_deliver.*$/,
            queries: [
                ".list_tb > tbody > tr > td" + NOT_CONVERTED_CURRENCY + " > strong.f_Strong"
            ],
            ignoreLog: true
        },
        {
            pattern: /^.*buff\.163\.com\/market\/steam_inventory.*$/,
            queries: [
                ".list_tb-body tr > td" + NOT_CONVERTED_CURRENCY + " > strong.f_Strong",
                "p > span.f_Strong.real_income"
            ],
            ignoreLog: true
        },
        {
            pattern: /^.*buff\.163\.com\/market\/sell_order\/on_sale.*$/,
            queries: [
                "p > span.f_Strong.real_income",
                "#popup-container .list_tb > tbody td" + NOT_CONVERTED_CURRENCY + " > strong.f_Strong"
            ],
            ignoreLog: true
        }
    ];
    var loaded = false;
    var pageLoading = true;
    var soLoaded = false;
    var boLoaded = false;
    var programOptions = {
        selectedCurrency: 'USD'
    };
    var cachedCurrencyRates;
    var currencySelection;
    function init() {
        console.info('[BuffUtility] Initialized.');
        var cookieValue;
        try {
            cookieValue = Cookie.read(COOKIE_BUFF_UTILITY_OPTIONS);
        }
        catch (_a) {
            console.info('[BuffUtility] Cookie was not found.');
            Cookie.write(COOKIE_BUFF_UTILITY_OPTIONS, JSON.stringify(programOptions));
        }
        programOptions = !!cookieValue ? JSON.parse(cookieValue) : programOptions;
        addCurrencySelection();
        if (/^.*buff\.163\.com.*goods_id=\d+/.test(window.location.href)) {
            var goodsId_1 = Util.getGoodsId(window.location.href);
            if (goodsId_1 != '-1') {
                BuffApi.getBuyOrderInformation(goodsId_1, function () {
                    console.info("[BuffUtility] Fetched and stored buy_order " + goodsId_1 + ".");
                    boLoaded = true;
                }, function () { });
            }
        }
        setInterval(function () {
            var loading = document.querySelector('#j_market_card > div.spinner.showLoading');
            if (loading && !pageLoading) {
                pageLoading = true;
            }
            if (!loading && pageLoading) {
                pageLoading = false;
                console.debug('[BuffUtility] Buff page loaded.');
                if (/^.*buff\.163\.com\/market\/\?game=.*tab=(?:selling|buying|top-bookmarked).*$/.test(window.location.href)) {
                    setTimeout(function () {
                        addReferencePriceDifferenceBatch();
                    }, 100);
                }
            }
        }, 50);
        setInterval(function () {
            if (!loaded || pageLoading)
                return;
            convertSelectors();
            if (/^.*buff\.163\.com\/market\/sell_order\/on_sale.*$/.test(window.location.href)) {
                addSellingAfterFeeGain();
            }
            if (/^.*buff\.163\.com\/market\/goods\?goods_id=\d+(?:.*#tab=selling.*)?$/.test(window.location.href) && boLoaded) {
                addHighestBuyOrderDifference();
            }
            if (/^.*buff\.163\.com\/market\/sell_order\/history.*$/.test(window.location.href) || /^.*buff\.163\.com\/market\/goods\?.*tab=buying.*$/.test(window.location.href)) {
                addBuyOrderGain();
            }
        }, 1000);
    }
    BuffUtility.init = init;
    function addCurrencySelection() {
        fRequest.get('https://penguinivogel.github.io/currency-repository/rates.json', null, function (req, args, e) {
            if (!(req.readyState == 4 && req.status == 200))
                return;
            cachedCurrencyRates = Util.parseJson(req);
            var options = '';
            var keys = Object.keys(cachedCurrencyRates.rates);
            for (var _i = 0, keys_3 = keys; _i < keys_3.length; _i++) {
                var l_Key = keys_3[_i];
                options += "<option" + (l_Key.indexOf(programOptions.selectedCurrency) > -1 ? ' selected' : '') + ">" + l_Key + "</option>";
            }
            var nav = document.querySelector('div.nav.nav_entries');
            var currencyDiv = document.createElement('div');
            currencyDiv.setAttribute('style', 'position: relative; float: right;');
            currencySelection = document.createElement('select');
            currencySelection.innerHTML = options;
            currencySelection.onchange = function () {
                var _a, _b, _c;
                programOptions.selectedCurrency = (_c = (_b = (_a = currencySelection === null || currencySelection === void 0 ? void 0 : currencySelection.selectedOptions) === null || _a === void 0 ? void 0 : _a.item(0)) === null || _b === void 0 ? void 0 : _b.innerText) !== null && _c !== void 0 ? _c : 'USD';
                console.info("[BuffUtility] Currency changed -> " + programOptions.selectedCurrency, cachedCurrencyRates.rates[programOptions.selectedCurrency]);
                Cookie.write(COOKIE_BUFF_UTILITY_OPTIONS, JSON.stringify(programOptions));
                updateConvertedCurrency();
            };
            currencyDiv.append(currencySelection);
            if (nav)
                nav.prepend(currencyDiv);
            loaded = true;
        });
    }
    function convertCurrency(yuan) {
        var selectedRate = cachedCurrencyRates.rates[programOptions.selectedCurrency];
        return "~" + programOptions.selectedCurrency + " " + (yuan * selectedRate[0]).toFixed(selectedRate[1]);
    }
    function createCurrencyHoverContainer(text, yuan) {
        return "<e title=\"" + convertCurrency(yuan) + "\" " + BUFF_UTILITY_HOVER + ">" + text + "</e>";
    }
    function readYuan(element) {
        var _a;
        var priceString = (typeof element == 'string' ? element : (_a = element.innerText) !== null && _a !== void 0 ? _a : element.innerHTML).replace(/\(|\)|¥|<\/?small>|<\/?big>/g, '').trim();
        var price = 0.0;
        try {
            price = parseFloat(priceString);
        }
        catch (_b) {
            console.error("[BuffUtility] Price parsing failed for: " + element);
        }
        return price;
    }
    function addSellingAfterFeeGain() {
        var elements = document.querySelectorAll("#j_list_card p" + NOT_CONVERTED_CURRENCY + " > strong.sell_order_price");
        for (var i = 0, l = elements.length; i < l; i++) {
            var priceElement = elements.item(i);
            var parent_1 = priceElement.parentElement;
            var price = readYuan(priceElement) * 0.975;
            parent_1.setAttribute(ATTR_CONVERTED_CURRENCY, '');
            parent_1.setAttribute('style', 'margin-top: -5px; display: grid; grid-template-columns: auto; grid-template-rows: auto auto;');
            parent_1.innerHTML += "<strong style=\"color: #eea20e; font-size: 11px;\">" + createCurrencyHoverContainer("(" + SYMBOL_YUAN + " " + price.toFixed(2) + ")", price) + "</strong>";
        }
    }
    function addHighestBuyOrderDifference() {
        var goodsId = Util.getGoodsId(window.location.href);
        if (goodsId == '-1') {
            return console.info('[BuffUtility] Unable to parse id.');
        }
        var listings = document.querySelectorAll(".list_tb > tbody > tr > td > div" + NOT_REQUESTED_BO_PRICE + " > strong.f_Strong");
        if (listings.length <= 0)
            return;
        BuffApi.getBuyOrderInformation(goodsId, function (info) {
            var _a;
            for (var i = 0, l = listings.length; i < l; i++) {
                var listing = listings.item(i);
                var div = listing === null || listing === void 0 ? void 0 : listing.parentElement;
                if (!listing || !div)
                    continue;
                div.setAttribute(ATTR_REQUESTED_BO_PRICE, '');
                var price = readYuan(((_a = listing.querySelector('e')) !== null && _a !== void 0 ? _a : listing));
                var bo = -1;
                try {
                    bo = parseFloat(info.price);
                }
                catch (_b) { }
                if (bo == -1) {
                    console.debug('[BuffUtility] Failed to get buy order price.', listing);
                }
                else {
                    var diff = price - (bo * 0.975);
                    div.innerHTML += "<div style=\"color: " + (diff < 0 ? '#137800' : '#950000') + "; font-size: 12px;\">(" + (diff < 0 ? SYMBOL_ARROW_DOWN : SYMBOL_ARROW_UP) + " " + (diff < 0 ? diff * -1 : diff).toFixed(2) + ")</div>";
                }
            }
        }, function (status) { });
    }
    function addBuyOrderGain() {
        var elements = document.querySelectorAll(".list_tb > tbody > tr > td > div" + NOT_CONVERTED_BUY_ORDER + " > strong.f_Strong, .list_tb > tbody > tr > td" + NOT_CONVERTED_BUY_ORDER + " > strong.f_Strong");
        for (var i = 0, l = elements.length; i < l; i++) {
            var baseElement = elements.item(i);
            var priceElement = baseElement.querySelector('e');
            var parent_2 = baseElement.parentElement;
            var price = readYuan(priceElement) * 0.975;
            parent_2.setAttribute(ATTR_CONVERTED_BUY_ORDER, '');
            parent_2.innerHTML += "<div style=\"font-size: 12px; margin-top: 3px;\" class=\"f_Strong\">" + createCurrencyHoverContainer("(" + SYMBOL_YUAN + " " + price.toFixed(2) + ")", price) + "</div>";
        }
    }
    function addReferencePriceDifferenceBatch() {
        BuffApi.getTab();
        BuffApi.getMarketJsonData(function (json) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
            var liCollection = document.querySelectorAll('#j_list_card > ul > li');
            var tab = BuffApi.getTab();
            for (var i = 0, l = liCollection.length; i < l; i++) {
                var li = liCollection.item(i);
                var a = li.querySelector('a');
                var a_img = li.querySelector('a > img');
                var h3 = li.querySelector('h3');
                var h3_a = li.querySelector('h3 > a');
                var priceStr = void 0;
                var price = void 0;
                var scm_price = void 0;
                var diff = void 0;
                var hsl = void 0;
                switch (tab) {
                    case 'selling':
                    case 'goods':
                    case 'buying':
                    case 'goods/buying':
                        li.innerHTML = '';
                        var goodsItem = json.data.items[i];
                        var inner_p_strong = void 0;
                        var inner_p_span = void 0;
                        var inner_p = void 0;
                        var additional_info_span = '';
                        switch (tab) {
                            case 'selling':
                            case 'goods':
                                priceStr = goodsItem.sell_min_price.split('.');
                                price = readYuan(goodsItem.sell_min_price);
                                scm_price = readYuan(goodsItem.goods_info.steam_price_cny);
                                diff = scm_price <= 0 ? 100 : ((scm_price - price) / scm_price) * -1 * 100;
                                hsl = "hsl(" + Math.min(120, Math.max(0, 120 * (diff / 100))) + ", 100%, 25%)";
                                inner_p_strong = createCurrencyHoverContainer(SYMBOL_YUAN + " " + priceStr[0] + (!!priceStr[1] ? "<small>." + priceStr[1] + "</small>" : ''), price);
                                inner_p_span = "<e title=\"" + goodsItem.sell_num.toLocaleString('de-DE') + " on sale\">" + (goodsItem.sell_num > 1000 ? '1.000+' : goodsItem.sell_num) + " on sale</e>";
                                inner_p = "<span style=\"color: " + hsl + "; font-size: 11px; margin-left: 3px;\">(" + diff.toFixed(2) + "%)</span>";
                                break;
                            case 'buying':
                            case 'goods/buying':
                                priceStr = goodsItem.buy_max_price.split('.');
                                price = readYuan(goodsItem.buy_max_price);
                                scm_price = readYuan(goodsItem.goods_info.steam_price_cny);
                                diff = scm_price <= 0 ? 100 : ((scm_price - price) / scm_price) * -1 * 100;
                                hsl = "hsl(" + Math.min(120, Math.max(0, 120 * (diff / 100))).toFixed(2) + ", 100%, 25%)";
                                inner_p_strong = createCurrencyHoverContainer(SYMBOL_YUAN + " " + priceStr[0] + (!!priceStr[1] ? "<small>." + priceStr[1] + "</small>" : ''), price);
                                inner_p_span = "<e title=\"" + goodsItem.buy_num.toLocaleString('de-DE') + " demand\">" + (goodsItem.buy_num > 1000 ? '1.000+' : goodsItem.buy_num) + " demand</e>";
                                inner_p = "<span style=\"color: " + hsl + "; font-size: 11px; margin-left: 3px;\">(" + diff.toFixed(2) + "%)</span>";
                                break;
                        }
                        if ((_a = goodsItem.goods_info.info) === null || _a === void 0 ? void 0 : _a.tags['exterior']) {
                            additional_info_span = Util.buildHTML('span', {
                                "class": "tag tag_csgo_" + goodsItem.goods_info.info.tags['exterior'].internal_name,
                                content: goodsItem.goods_info.info.tags['exterior'].localized_name
                            });
                        }
                        else if (/^csgo_tool_sticker|type_customplayer$/.test((_b = goodsItem.goods_info.info.tags['type']) === null || _b === void 0 ? void 0 : _b.internal_name) && goodsItem.goods_info.info.tags['rarity']) {
                            var rarity = goodsItem.goods_info.info.tags['rarity'];
                            additional_info_span = Util.buildHTML('span', {
                                "class": "tag tag_black rarity_" + rarity.internal_name,
                                content: rarity.localized_name
                            });
                        }
                        li.innerHTML = Util.buildHTML('a', {
                            attributes: {
                                'href': "/market/goods?goods_id=" + goodsItem.id + "&from=market#tab=selling",
                                'title': goodsItem.short_name
                            },
                            content: Util.buildHTML('img', {
                                "class": 'lazy',
                                attributes: {
                                    'src': goodsItem.goods_info.icon_url,
                                    'data-original': goodsItem.goods_info.original_icon_url,
                                    'width': '210',
                                    'height': '138'
                                }
                            })
                        }) + Util.buildHTML('h3', {
                            content: Util.buildHTML('a', {
                                attributes: {
                                    'href': "/market/goods?goods_id=" + goodsItem.id + "&from=market#tab=selling",
                                    'title': goodsItem.short_name
                                },
                                content: goodsItem.short_name
                            })
                        }) + Util.buildHTML('p', {
                            style: {
                                'margin-top': '-12px'
                            },
                            content: [
                                Util.buildHTML('strong', {
                                    "class": 'f_Strong',
                                    content: inner_p_strong
                                }),
                                Util.buildHTML('span', {
                                    "class": 'l_Right f_12px f_Bold c_Gray',
                                    content: inner_p_span
                                }),
                                '<br>',
                                inner_p
                            ]
                        }) + additional_info_span;
                        break;
                    case 'sell_order/top_bookmarked':
                    case 'top-bookmarked':
                        var bookmarkedItem = json.data.items[i];
                        var bookmarkedGoodsInfo = json.data.goods_infos[bookmarkedItem.goods_id];
                        a.setAttribute('href', "/market/goods?goods_id=" + bookmarkedItem.id + "&from=market#tab=selling");
                        a.setAttribute('title', bookmarkedGoodsInfo.short_name);
                        a_img.setAttribute('src', (_c = bookmarkedItem.asset_info.info.icon_url) !== null && _c !== void 0 ? _c : bookmarkedGoodsInfo.original_icon_url);
                        a_img.setAttribute('data-original', (_d = bookmarkedItem.asset_info.info.icon_url) !== null && _d !== void 0 ? _d : bookmarkedGoodsInfo.original_icon_url);
                        if (li.querySelector('div.wear')) {
                            li.querySelector('div.wear > div.wear-value').innerHTML = "Float: " + bookmarkedItem.asset_info.paintwear;
                            var floatP = parseFloat(bookmarkedItem.asset_info.paintwear) * 100;
                            li.querySelector('div.wear > div.wear-pointer > div.wear-pointer-icon').setAttribute('style', "left: " + floatP + "%");
                        }
                        h3.setAttribute('style', 'margin-top: 1px !important;');
                        h3_a.setAttribute('href', "/market/goods?goods_id=" + bookmarkedItem.goods_id + "&from=market#tab=selling");
                        h3_a.setAttribute('title', bookmarkedGoodsInfo.short_name);
                        h3_a.innerText = bookmarkedGoodsInfo.short_name;
                        priceStr = bookmarkedItem.price.split('.');
                        price = readYuan(bookmarkedItem.price);
                        scm_price = readYuan(bookmarkedGoodsInfo.steam_price_cny);
                        diff = scm_price <= 0 ? 100 : ((scm_price - price) / scm_price) * -1 * 100;
                        li.querySelector('p').style['marginTop'] = '-3px';
                        var p_span_a = li.querySelector('p > span > a');
                        p_span_a.setAttribute('data-goodsid', "" + bookmarkedGoodsInfo.goods_id);
                        p_span_a.setAttribute('data-price', "" + bookmarkedItem.price);
                        p_span_a.setAttribute('data-orderid', "" + bookmarkedItem.id);
                        p_span_a.setAttribute('data-sellerid', "" + bookmarkedItem.user_id);
                        p_span_a.setAttribute('data-goods-name', "" + bookmarkedGoodsInfo.name);
                        p_span_a.setAttribute('data-goods-icon-url', "" + bookmarkedGoodsInfo.icon_url);
                        p_span_a.setAttribute('data-goods-sell-min-price', '');
                        p_span_a.setAttribute('data-cooldown', "" + bookmarkedItem.asset_info.has_tradable_cooldown);
                        p_span_a.setAttribute('data-asset-info', "" + JSON.stringify(bookmarkedItem.asset_info));
                        li.querySelector('p > strong').innerHTML = createCurrencyHoverContainer(SYMBOL_YUAN + " " + priceStr[0] + (!!priceStr[1] ? "<small>." + priceStr[1] + "</small>" : ''), price);
                        li.querySelector('p').innerHTML += "<div style=\"color: " + (diff < 0 ? '#137800' : '#950000') + "; font-size: 11px; margin-left: 3px;\">(" + diff.toFixed(2) + "%)</div>";
                        var tagBoxContent = '';
                        if (/^sticker|type_customplayer$/.test((_e = bookmarkedGoodsInfo.tags['category_group']) === null || _e === void 0 ? void 0 : _e.internal_name) && bookmarkedGoodsInfo.tags['rarity']) {
                            var rarity = bookmarkedGoodsInfo.tags['rarity'];
                            tagBoxContent += Util.buildHTML('div', {
                                "class": 'g_Right',
                                content: ' '
                            }) + Util.buildHTML('span', {
                                "class": "tag tag_black rarity_" + rarity.internal_name,
                                content: rarity.localized_name
                            });
                        }
                        else {
                            tagBoxContent += Util.buildHTML('div', {
                                "class": 'g_Right',
                                content: [
                                    Util.buildHTML('a', {
                                        style: {
                                            'cursor': 'pointer'
                                        },
                                        attributes: {
                                            'href': 'javascript:;'
                                        },
                                        content: Util.buildHTML('i', {
                                            "class": 'icon icon_spect j_tips_handler btn_game_cms',
                                            attributes: {
                                                'data-assetid': bookmarkedItem.asset_info.assetid,
                                                'data-direction': 'bottom',
                                                'data-title': 'Inspect in server',
                                                'data-content': null
                                            }
                                        })
                                    }),
                                    Util.buildHTML('a', {
                                        "class": 'btn_3d',
                                        style: {
                                            'cursor': 'pointer'
                                        },
                                        attributes: {
                                            'data-assetid': bookmarkedItem.asset_info.assetid
                                        },
                                        content: Util.buildHTML('i', {
                                            "class": 'icon icon_3dpersp j_tips_handler',
                                            attributes: {
                                                'data-direction': 'bottom',
                                                'data-title': '3D Inspect'
                                            }
                                        })
                                    })
                                ]
                            });
                            if (bookmarkedGoodsInfo.tags['exterior']) {
                                tagBoxContent += Util.buildHTML('span', {
                                    "class": "tag tag tag_csgo_" + bookmarkedGoodsInfo.tags['exterior'].internal_name,
                                    content: bookmarkedGoodsInfo.tags['exterior'].localized_name
                                });
                            }
                            if (/^unusual/.test((_g = (_f = bookmarkedGoodsInfo.tags['quality']) === null || _f === void 0 ? void 0 : _f.internal_name) !== null && _g !== void 0 ? _g : '')) {
                                tagBoxContent += Util.buildHTML('span', {
                                    "class": "tag tag_black quality_" + bookmarkedGoodsInfo.tags['quality'].internal_name,
                                    content: bookmarkedGoodsInfo.tags['quality'].localized_name
                                });
                            }
                            if (((_j = (_h = bookmarkedItem.asset_info) === null || _h === void 0 ? void 0 : _h.info) === null || _j === void 0 ? void 0 : _j.phase_data) && ((_l = (_k = bookmarkedItem.asset_info) === null || _k === void 0 ? void 0 : _k.info) === null || _l === void 0 ? void 0 : _l.metaphysic)) {
                                tagBoxContent += Util.buildHTML('span', {
                                    "class": 'tag tag_gray2 j_tips_handler',
                                    attributes: {
                                        'data-direction': 'bottom',
                                        'data-title': bookmarkedItem.asset_info.info.metaphysic.title
                                    },
                                    content: bookmarkedItem.asset_info.info.phase_data.name
                                });
                            }
                            else {
                                tagBoxContent += Util.buildHTML('span', {
                                    "class": 'tag tag_gray2 j_tips_handler',
                                    attributes: {
                                        'data-direction': 'bottom',
                                        'data-title': 'Paint seed'
                                    },
                                    content: "" + bookmarkedItem.asset_info.info.paintseed
                                });
                            }
                        }
                        li.querySelector('div.tagBox').innerHTML = tagBoxContent;
                        var tagBoxBContent = '';
                        if ((_o = (_m = bookmarkedItem.asset_info) === null || _m === void 0 ? void 0 : _m.info) === null || _o === void 0 ? void 0 : _o.inspect_en_url) {
                            tagBoxBContent += Util.buildHTML('a', {
                                "class": 'l_Right shalow-btn shalow-btn-green csgo-inspect-view',
                                attributes: {
                                    'href': 'javascript:;',
                                    'data-assetid': bookmarkedItem.asset_info.assetid,
                                    'data-contextid': "" + bookmarkedItem.asset_info.contextid,
                                    'data-inspecturl': bookmarkedItem.asset_info.info.inspect_en_url,
                                    'data-inspectversion': "" + bookmarkedItem.asset_info.info.inspect_version,
                                    'data-inspectsize': bookmarkedItem.asset_info.info.inspect_en_size
                                },
                                content: 'Screenshot'
                            });
                        }
                        for (var i_1 = 0, l_1 = (_s = (_r = (_q = (_p = bookmarkedItem.asset_info) === null || _p === void 0 ? void 0 : _p.info) === null || _q === void 0 ? void 0 : _q.stickers) === null || _r === void 0 ? void 0 : _r.length) !== null && _s !== void 0 ? _s : 0; i_1 < l_1; i_1++) {
                            var sticker = bookmarkedItem.asset_info.info.stickers[i_1];
                            tagBoxBContent += Util.buildHTML('span', {
                                "class": "icon icon_stickers j_tips_handler" + (sticker.wear > 0 ? ' masked' : ''),
                                attributes: {
                                    'data-direction': 'top',
                                    'data-title': sticker.name,
                                    'data-content': null
                                },
                                content: Util.buildHTML('img', {
                                    attributes: {
                                        'src': sticker.img_url
                                    }
                                })
                            });
                        }
                        li.querySelector('div.tagBoxB').innerHTML = tagBoxBContent;
                        li.setAttribute('id', "sell_order_");
                        li.innerHTML = Util.buildHTML('a', {
                            "class": 'img item-detail-img',
                            attributes: {
                                'href': "",
                                'data-classid': '',
                                'data-instanceid': '',
                                'data-assetid': '',
                                'data-contextid': '',
                                'data-appid': '',
                                'data-timeout': '',
                                'data-orderid': '',
                                'data-origin': '',
                                'title': ''
                            },
                            content: Util.buildHTML('img', {
                                "class": 'lazy',
                                attributes: {
                                    'src': '',
                                    'data-original': '',
                                    'width': '210',
                                    'height': '138'
                                }
                            })
                        }) + Util.buildHTML('div', {
                            "class": 'wear',
                            content: [
                                Util.buildHTML('div', {
                                    "class": 'wear-value',
                                    content: ""
                                })
                            ]
                        });
                        break;
                }
            }
        });
    }
    function convertSelectors() {
        for (var _i = 0, selectors_1 = selectors; _i < selectors_1.length; _i++) {
            var l_Selector = selectors_1[_i];
            if (l_Selector.pattern.test(window.location.href) && l_Selector.queries.length > 0) {
                var elements = document.querySelectorAll(l_Selector.queries.join(', '));
                if (elements.length > 0) {
                    if (!l_Selector.ignoreLog) {
                        console.info("[BuffUtility] Converting " + elements.length + " element(s).", l_Selector, programOptions.selectedCurrency, cachedCurrencyRates.rates[programOptions.selectedCurrency]);
                    }
                }
                else {
                    continue;
                }
                for (var i = 0, l = elements.length; i < l; i++) {
                    var strong = elements.item(i);
                    var parent_3 = strong.parentElement;
                    parent_3.setAttribute(ATTR_CONVERTED_CURRENCY, '');
                    var price = readYuan(strong);
                    strong.innerHTML = createCurrencyHoverContainer(strong.innerHTML, price);
                }
            }
        }
    }
    function updateConvertedCurrency() {
        addSellingAfterFeeGain();
        convertSelectors();
        var hovers = document.querySelectorAll("e[" + BUFF_UTILITY_HOVER + "]");
        for (var i = 0, l = hovers.length; i < l; i++) {
            var e = hovers.item(i);
            e.setAttribute('title', convertCurrency(readYuan(e)));
        }
    }
})(BuffUtility || (BuffUtility = {}));
(function () {
    try {
        indexedDB.deleteDatabase('buff_utility_db');
    }
    catch (_a) {
    }
})();
BuffUtility.init();
setTimeout(function () {
    console.log('%cHold Up!', 'font-size: 48px; color: #f00;');
    console.log('%cDont paste anything here, there is a 99% chance they are trying to scam you.', 'font-size: 24px;');
}, 1000);
