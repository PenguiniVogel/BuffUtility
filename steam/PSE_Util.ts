module PSE_Util {

    DEBUG && console.debug('%c■', 'color: #0000ff', '[BuffUtility:PSE] Module.PSE_Util');

    export function addBuyOrderCancelConfirmation(): void {
        let dialog: HTMLElement = document.querySelector('dialog#pse_cancel_buyorder_dialog');
        if (dialog == null) {
            dialog = document.createElement('dialog');

            dialog.setAttribute('id', 'pse_cancel_buyorder_dialog');
            dialog.setAttribute('class', 'pse_newmodal');

            dialog.innerHTML = `
                <div class="pse_newmodal_header">Remove buy-order</div>
                <div class="pse_newmodal_content">
                    <div style="font-size: 14px;">Do you really want to remove <span data-target="quantity"></span> buy order(s) for: <span data-target="name"></span></div>
                    <div style="margin-top: 10px;">
                        <button class="btn_green_white_innerfade btn_medium_wide" data-target="yes"><span style="font-size: 15px; padding: 0 20px;">Yes, remove this buy-order</span></button>
                        <button style="margin-left: 10px;" class="btn_grey_white_innerfade btn_medium_wide" onclick="document.getElementById('pse_cancel_buyorder_dialog').close();"><span style="font-size: 15px; padding: 0 20px;">No</span></button>
                    </div>
                </div>
            `;

            document.body.append(dialog);
        }

        InjectionService.shadowFunction('CancelMarketBuyOrder', 'null', function (buy_orderid: string, exec: boolean) {
            const buyOrderQuantity = <HTMLElement>document.querySelector(`#mybuyorder_${buy_orderid} .market_listing_buyorder_qty .market_listing_price`);
            const buyOrderName = <HTMLElement>document.querySelector(`#mbuyorder_${buy_orderid}_name`);

            if (!exec) {
                let dialog: HTMLElement & { showModal(); } = document.querySelector('dialog#pse_cancel_buyorder_dialog');

                (<HTMLElement>dialog.querySelector('[data-target="name"]')).style['color'] = buyOrderName.style['color'];
                dialog.querySelector('[data-target="name"]').innerHTML = `<b>${buyOrderName.innerText.trim()}</b>`;
                dialog.querySelector('[data-target="quantity"]').innerHTML = buyOrderQuantity.innerText.trim();

                dialog.querySelector('[data-target="yes"]').setAttribute('onclick', `CancelMarketBuyOrder('${buy_orderid}', true);`);

                dialog.showModal();
            }

            return exec;
            // return confirm(`Do you really want to remove ${buyOrderQuantity.innerText.trim()} buy order(s) for: ${buyOrderName.innerText.trim()}`);
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
