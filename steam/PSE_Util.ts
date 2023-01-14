module PSE_Util {

    DEBUG && console.debug('[PSE] Module.PSE_Util');

    export function addBuyOrderCancelConfirmation(): void {
        InjectionService.shadowFunction('CancelMarketBuyOrder', 'null', function (buy_orderid: string) {
            const buyOrderQuantity = <HTMLElement>document.querySelector(`#mybuyorder_${buy_orderid} .market_listing_buyorder_qty .market_listing_price`);
            const buyOrderName = <HTMLElement>document.querySelector(`#mbuyorder_${buy_orderid}_name`);

            return confirm(`Do you really want to remove ${buyOrderQuantity.innerText.trim()} buy order(s) for: ${buyOrderName.innerText.trim()}`);
        }, {
            order: 'custom'
        });
    }

    export function stringSimilarity(s1, s2) {
        let longer = s1;
        let shorter = s2;

        if (s1.length < s2.length) {
            longer = s2;
            shorter = s1;
        }

        let longerLength = longer.length;
        if (longerLength == 0) {
            return 1.0;
        }

        function _editDistance(s1, s2) {
            let costs = [];
            for (let i = 0; i <= s1.length; i++) {
                let lastValue = i;
                for (let j = 0; j <= s2.length; j++) {
                    if (i == 0) {
                        costs[j] = j;
                    } else {
                        if (j > 0) {
                            let newValue = costs[j - 1];
                            if (s1.charAt(i - 1) != s2.charAt(j - 1)) {
                                newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                            }

                            costs[j - 1] = lastValue;
                            lastValue = newValue;
                        }
                    }
                }

                if (i > 0) {
                    costs[s2.length] = lastValue;
                }
            }

            return costs[s2.length];
        }

        return (longerLength - _editDistance(longer, shorter)) / parseFloat(longerLength);
    }

}
