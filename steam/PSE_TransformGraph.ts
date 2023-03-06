module PSE_TransformGraph {

    DEBUG && console.debug('%c■', 'color: #0000ff', '[BuffUtility:PSE] Module.PSE_TransformGraph');

    // imports
    import Settings = ExtensionSettings.Settings;
    import getSetting = ExtensionSettings.getSetting;

    // module

    interface $J {
        (...args: any[]): $J;

        children(): $J;
        first(): $J;
        last(): $J;
        remove(): $J;
    }

    interface jqPlot {
        data: [
            [string, number, string][],
            [string, number, string][]
        ];
        axes: {
            [key in ('xaxis' | 'yaxis' | 'y2axis')]: {
                renderer: any,
                numberTicks: any,
                tickOptions: {
                    formatString: any
                }
            }
        };
        series: any[];
        seriesColors: any[];

        drawSeries(options, idx);
        replot(options);
        reInitialize(data, opts);
        moveSeriesToFront(idx);
    }

    declare var $J: $J;
    declare var g_plotPriceHistory: jqPlot;
    declare var g_timePriceHistoryEarliest: any;
    declare var g_timePriceHistoryLatest: any;

    declare function pricehistory_zoomMonthOrLifetime(plot: jqPlot, earliest: any, latest: any): void;

    async function init(): Promise<void> {
        if (!await getSetting(Settings.MODULE_PSE_TRANSFORMGRAPH)) {
            console.debug('%c■', 'color: #ff0000', '[BuffUtility:PSE] PSE_TransformGraph - disabled');
            return;
        } else {
            console.debug('%c■', 'color: #00ff00', '[BuffUtility:PSE] PSE_TransformGraph');
        }

        const showYears = await getSetting(Settings.PSE_GRAPH_SHOW_YEARS);
        const showVolume = await getSetting(Settings.PSE_GRAPH_SHOW_VOLUME);
        const cumulateRecent = await getSetting(Settings.PSE_GRAPH_CUMULATE_RECENT);

        if (showYears || showVolume) {
            const walletInfo: {
                wallet_currency: number
            } = await InjectionService.requestObject('g_rgWalletInfo');
            const steamCurrency = PSE_Currencies.getById(walletInfo.wallet_currency);

            const cleanY2Axis = function () {
                $J('#pricehistory .jqplot-y2axis').children().first().remove();
                $J('#pricehistory .jqplot-y2axis').children().last().remove();
            };

            InjectionService.shadowFunction('pricehistory_zoomDays', 'null', cleanY2Axis);
            InjectionService.shadowFunction('pricehistory_zoomLifetime', 'null', cleanY2Axis);
            InjectionService.shadowFunction('pricehistory_zoomMonthOrLifetime', 'null', cleanY2Axis);

            InjectionServiceLib.injectCode(`${PSE_transform_graph.toString()}\nPSE_transform_graph(${showYears}, ${showVolume}, ${cumulateRecent}, '${steamCurrency?.symbol ?? ''}');`, 'body');
        }
    }

    function PSE_transform_graph(showYears: boolean, showVolume: boolean, cumulateRecent: boolean, currency: string): void {
        let maxSales = 0;
        let swappedData: [string, number, string][] = [];

        // don't swap data around if we don't even want it visible
        if (showVolume) {
            let clonedData: [string, number, number][] = g_plotPriceHistory.data.slice()[0].map(x => {
                const parsedVolume = parseInt(x[2]);
                maxSales = Math.max(parsedVolume, maxSales, 0);

                return [x[0], parsedVolume, x[1]];
            });

            if (cumulateRecent) {
                let groups: {
                    [key: string]: [string, number, number][]
                } = {};

                // collect groups
                for (const entry of clonedData) {
                    const keyRegex = /^([A-Z][a-z]{2} \d{2} \d{4})/;
                    const key = keyRegex.exec(entry[0])[1];

                    let arr = (groups[key] ?? []);

                    arr.push(entry);

                    groups[key] = arr;
                }

                clonedData = [];

                // merge groups
                const keys = Object.keys(groups);
                for (const group of keys) {
                    const collection = groups[group];

                    if (collection.length > 1) {
                        let totalVolume = 0;
                        let averagePrice = 0;

                        for (const entry of collection) {
                            totalVolume += entry[1];
                            averagePrice += entry[2];
                        }

                        averagePrice /= collection.length;

                        clonedData.push([`${group} 01: +0`, totalVolume, averagePrice]);
                    } else {
                        clonedData.push(collection[0]);
                    }
                }
            }

            swappedData = clonedData.map(x => [x[0], x[1], `${x[2].toFixed(2)}${currency}`]);
        }

        g_plotPriceHistory.reInitialize([g_plotPriceHistory.data[0], swappedData], {
            title: {
                text: 'Median Sale Prices',
                textAlign: 'left'
            },
            gridPadding: {
                left: 45,
                right: 45,
                top: 25
            },
            axesDefaults: {
                showTickMarks: false
            },
            axes: {
                xaxis: {
                    renderer: g_plotPriceHistory.axes.xaxis.renderer,
                    tickOptions: {
                        formatString: showYears ? '%b %#d <br> %Y %#I%p' : '%b %#d <br> %#I%p'
                    },
                    pad: 1
                },
                yaxis: {
                    pad: 1.1,
                    tickOptions: {
                        formatString: g_plotPriceHistory.axes.yaxis.tickOptions.formatString,
                        labelPosition: 'start',
                        showMark: false
                    },
                    numberTicks: g_plotPriceHistory.axes.yaxis.numberTicks
                },
                y2axis: {
                    min: 0,
                    max: maxSales,
                    pad: 1.1,
                    tickOptions:{
                        formatString: '%d',
                        labelPosition: 'start',
                        showMark: false
                    },
                    numberTicks: g_plotPriceHistory.axes.yaxis.numberTicks
                }
            },
            grid: {
                gridLineColor: '#1b2939',
                borderColor: '#1b2939',
                background: '#101822'
            },
            cursor: {
                show: true,
                zoom: true,
                showTooltip: false
            },
            highlighter: {
                show: true,
                lineWidthAdjust: 2.5,
                sizeAdjust: 5,
                showTooltip: true,
                tooltipLocation: 'n',
                tooltipOffset: 20,
                fadeTooltip: true,
                yvalues: 2
            },
            legend: {
                show: false
            },
            series: [
                {
                    lineWidth: 3,
                    markerOptions: {
                        show: false,
                        style:'circle'
                    },
                    highlighter: {
                        formatString: '<strong>%s</strong><br>%s<br>%s sold'
                    }
                },
                {
                    show: showVolume,
                    yaxis: 'y2axis',
                    lineWidth: 3,
                    markerOptions: {
                        show: false,
                        style:'circle'
                    },
                    highlighter: {
                        formatString: '<strong>%s</strong><br>%s sold<br>%s'
                    }
                }
            ],
            seriesColors: [ '#688F3E', '#6b8fc3' ]
        });

        pricehistory_zoomMonthOrLifetime(g_plotPriceHistory, g_timePriceHistoryEarliest, g_timePriceHistoryLatest);

        g_plotPriceHistory.moveSeriesToFront(0);
    }

    init();

}
