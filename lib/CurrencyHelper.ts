/**
 * CurrencyHelper w24.02.2022
 * Felix Vogel
 */
/** */
module CurrencyHelper {

    export interface Data {
        'date': string,
        'rates': {
            [name: string]: [number, number]
        },
        'symbols': {
            [name: string]: string
        }
    }

    const raw = `{"date":"2022-03-23","rates":{"AED":[0.5762722445307841,2],"AFN":[13.732741122309474,2],"ALL":[17.365493023640756,2],"AMD":[76.45430846602575,2],"ANG":[0.28206837198944623,2],"AOA":[71.20747270618007,2],"ARS":[17.26824349440529,2],"AUD":[0.21033526170697042,2],"AWG":[0.28240183908882854,2],"AZN":[0.2666522377562115,2],"BAM":[0.2782967097818059,2],"BBD":[0.3160096345684083,2],"BDT":[13.494951635183298,2],"BGN":[0.27797632540018186,2],"BHD":[0.059151375292263664,3],"BIF":[320.9699191345839,2],"BMD":[0.15688994220567226,2],"BND":[0.21252946100056058,2],"BOB":[1.0760036222063776,2],"BRL":[0.7705025384738554,2],"BSD":[0.15650855254232754,2],"BTC":[0.0000037144610105148084,7],"BTN":[11.918895255495523,2],"BWP":[1.8083363361962679,2],"BYN":[0.5106981080399273,2],"BYR":[3075.0423430692454,2],"BZD":[0.3154830551786374,2],"CAD":[0.19733530635885493,2],"CDF":[315.6625214833868,2],"CHF":[0.14662313724140658,2],"CLF":[0.0045075650815437265,4],"CLP":[124.37919802371327,2],"COP":[590.7438742307148,2],"CRC":[101.30536442621332,2],"CUC":[0.15688994220567226,2],"CUP":[4.157582757433046,2],"CVE":[15.689702962581437,2],"CZK":[3.5065210237852344,2],"DJF":[27.8628601266919,2],"DKK":[1.0580875512536798,2],"DOP":[8.597189092767563,2],"DZD":[22.320420927911663,2],"EGP":[2.902819723846581,2],"ERN":[2.3533495596954457,2],"ETB":[8.034349955305455,2],"EUR":[0.14220345389436956,2],"FJD":[0.3278839073754959,2],"FKP":[0.12032815437834479,2],"GBP":[0.11817974459690866,2],"GEL":[0.50517748555284,2],"GGP":[0.12032815437834479,2],"GHS":[1.1738142862709107,2],"GIP":[0.12032815437834479,2],"GMD":[8.39301906180418,2],"GNF":[1398.9011661820848,2],"GTQ":[1.2051182435939476,2],"GYD":[32.74397547957404,2],"HKD":[1.2278699429963236,2],"HNL":[3.8414789841781594,2],"HRK":[1.0772843065121502,2],"HTG":[16.42820602663926,2],"HUF":[52.69587174841138,2],"IDR":[2252.1390473904385,2],"ILS":[0.5043336502574309,2],"IMP":[0.12032815437834479,2],"INR":[11.947716482717018,2],"IQD":[228.42380554075848,2],"IRR":[6636.443522191844,2],"ISK":[20.235652738027962,2],"JEP":[0.12032815437834479,2],"JMD":[23.87886754288643,2],"JOD":[0.11123011960163695,2],"JPY":[19.005960173363075,2],"KES":[17.971786123730084,2],"KGS":[15.669348671208263,2],"KHR":[632.3151521477414,2],"KMF":[70.15335789281784,2],"KPW":[141.20097884325455,2],"KRW":[190.61649321163372,2],"KWD":[0.04771807539570245,3],"KYD":[0.13042374638412166,2],"KZT":[79.62739481281616,2],"LAK":[1798.7721431397213,2],"LBP":[236.67992036037768,2],"LKR":[44.60497259881646,2],"LRD":[24.043327970367073,2],"LSL":[2.326659820044373,2],"LTL":[0.46325505412405665,2],"LVL":[0.09490118139785426,3],"LYD":[0.7282251672241515,2],"MAD":[1.523579465707495,2],"MDL":[2.879832108914194,2],"MGA":[632.7790094334928,2],"MKD":[8.767252051924737,2],"MMK":[278.30080822755053,2],"MNT":[451.65041982725694,2],"MOP":[1.2618211598170581,2],"MRO":[56.00967282113734,2],"MUR":[7.060044555186174,2],"MVR":[2.423946890991667,2],"MWK":[127.86334233860404,2],"MXN":[3.180974087971038,2],"MYR":[0.6621389560958212,2],"MZN":[10.014313630855192,2],"NAD":[2.328244393131118,2],"NGN":[65.18619338133932,2],"NIO":[5.597682112142213,2],"NOK":[1.3742767887843566,2],"NPR":[19.07059548265132,2],"NZD":[0.22561004570703413,2],"OMR":[0.060414141962845655,3],"PAB":[0.15650570847324968,2],"PEN":[0.5924565618219562,2],"PGK":[0.5514891687895271,2],"PHP":[8.215932816262614,2],"PKR":[28.443607513916742,2],"PLN":[0.6652054313755994,2],"PYG":[1090.950287663367,2],"QAR":[0.5712378156525617,2],"RON":[0.7029918753478652,2],"RSD":[16.7440708980916,2],"RUB":[16.787219265496407,2],"RWF":[159.0420942132011,2],"SAR":[0.5883687813363087,2],"SBD":[1.2616852133151348,2],"SCR":[2.2616889106049363,2],"SDG":[70.05142986994925,2],"SEK":[1.4797550630828742,2],"SGD":[0.2130290217340915,2],"SHP":[0.21610004752439432,2],"SLL":[1839.5343503819158,2],"SOS":[91.78052973061831,2],"SRD":[3.247700356845347,2],"STD":[3247.3044905859892,2],"SVC":[1.3694073159126519,2],"SYP":[394.10752060030336,2],"SZL":[2.326501120989827,2],"THB":[5.278168868876755,2],"TJS":[2.035399843405557,2],"TMT":[0.549114655516399,2],"TND":[0.46196299354197234,2],"TOP":[0.35428085011499993,2],"TRY":[2.323445310969091,2],"TTD":[1.0629839005781707,2],"TWD":[4.4800697593263425,2],"TZS":[363.51390294728037,2],"UAH":[4.60146387079508,2],"UGX":[563.272645828931,2],"USD":[0.15688994220567226,2],"UYU":[6.672730411545328,2],"UZS":[1801.342677332684,2],"VEF":[33547805505.288677,2],"VND":[3589.092150966599,2],"VUV":[17.903744330703805,2],"WST":[0.4113725505810575,2],"XAF":[93.33838662786978,2],"XAG":[0.006326773867214397,4],"XAU":[0.0000817669859892625,6],"XCD":[0.4240027769490476,2],"XDR":[0.11325239491946876,2],"XOF":[93.33838662786978,2],"XPF":[17.014719621716058,2],"YER":[39.26985465953791,2],"ZAR":[2.32453672247773,2],"ZMK":[1412.196834750201,2],"ZMW":[2.766378922717827,2],"ZWL":[50.51848872426152,2]},"symbols":{"AED":"","AFN":"","ALL":"","AMD":"","ANG":"","AOA":"","ARS":"$","AUD":"A$","AWG":"","AZN":"","BAM":"","BBD":"","BDT":"","BGN":"","BHD":"","BIF":"","BMD":"","BND":"","BOB":"","BRL":"R$","BSD":"","BTC":"","BTN":"","BWP":"","BYN":"","BYR":"","BZD":"","CAD":"C$","CDF":"","CHF":"Fr","CLF":"","CLP":"","COP":"","CRC":"","CUC":"","CUP":"","CVE":"","CZK":"","DJF":"","DKK":"Kr","DOP":"","DZD":"","EGP":"","ERN":"","ETB":"","EUR":"€","FJD":"","FKP":"","GBP":"","GEL":"","GGP":"","GHS":"","GIP":"","GMD":"","GNF":"","GTQ":"","GYD":"","HKD":"","HNL":"","HRK":"","HTG":"","HUF":"","IDR":"","ILS":"","IMP":"","INR":"₹","IQD":"","IRR":"","ISK":"","JEP":"","JMD":"","JOD":"","JPY":"¥","KES":"","KGS":"","KHR":"","KMF":"","KPW":"","KRW":"₩","KWD":"","KYD":"","KZT":"","LAK":"","LBP":"","LKR":"","LRD":"","LSL":"","LTL":"","LVL":"","LYD":"","MAD":"","MDL":"","MGA":"","MKD":"","MMK":"","MNT":"","MOP":"","MRO":"","MUR":"","MVR":"","MWK":"","MXN":"M$","MYR":"","MZN":"","NAD":"","NGN":"","NIO":"","NOK":"","NPR":"","NZD":"","OMR":"","PAB":"","PEN":"","PGK":"","PHP":"","PKR":"","PLN":"","PYG":"","QAR":"","RON":"","RSD":"","RUB":"","RWF":"","SAR":"SR","SBD":"","SCR":"","SDG":"","SEK":"kr","SGD":"S$","SHP":"","SLL":"","SOS":"","SRD":"","STD":"","SVC":"","SYP":"","SZL":"","THB":"","TJS":"","TMT":"","TND":"","TOP":"","TRY":"₺","TTD":"","TWD":"","TZS":"","UAH":"","UGX":"","USD":"$","UYU":"","UZS":"","VEF":"","VND":"","VUV":"","WST":"","XAF":"","XAG":"","XAU":"","XCD":"","XDR":"","XOF":"","XPF":"","YER":"","ZAR":"","ZMK":"","ZMW":"","ZWL":""}}`;

    let data: Data;

    export function initialize(): void {
        data = JSON.parse(raw);
    }

    export function getData(): Data {
        return data;
    }

}
