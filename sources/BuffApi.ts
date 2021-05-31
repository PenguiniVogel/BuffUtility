/**
 * Provide a interface to the Buff API
 * with automatic retry on 429 whilst avoiding getting constantly limited
 *
 * Author: Felix Vogel
 */
/** */
module BuffApi {

    export type GoodsInfo = {
        'appid'?: number,
        'description'?: any,
        'game'?: string,
        'goods_id'?: number,
        'icon_url'?: string,
        'item_id'?: string,
        'market_hash_name'?: string,
        'market_min_price'?: string,
        'name'?: string,
        'original_icon_url'?: string,
        'short_name'?: string,
        'steam_price'?: string,
        'steam_price_cny'?: string,
        'steam_price_custom'?: string,
        'tags'?: {
            'category'?: {
                'category'?: string,
                'internal_name'?: string,
                'localized_name'?: string
            },
            'category_group'?: {
                'category'?: string,
                'internal_name'?: string,
                'localized_name'?: string
            },
            'custom'?: {
                'category'?: string,
                'internal_name'?: string,
                'localized_name'?: string
            },
            'exterior'?: {
                'category'?: string,
                'internal_name'?: string,
                'localized_name'?: string
            },
            'itemset'?: {
                'category'?: string,
                'internal_name'?: string,
                'localized_name'?: string
            },
            'quality'?: {
                'category'?: string,
                'internal_name'?: string,
                'localized_name'?: string
            },
            'rarity'?: {
                'category'?: string,
                'internal_name'?: string,
                'localized_name'?: string
            },
            'type'?: {
                'category'?: string,
                'internal_name'?: string,
                'localized_name'?: string
            },
            'weapon'?: {
                'category'?: string,
                'internal_name'?: string,
                'localized_name'?: string
            },
            'weaponcase'?: {
                'category'?: string,
                'internal_name'?: string,
                'localized_name'?: string
            }
        }
    }

    export type SellOrderResponse = {
        'code'?: string,
        'data'?: {
            'goods_infos'?: {
                [goods_id: string]: GoodsInfo
            }
        }
    };

    export type BuyOrderInfo = {
        'allow_tradable_cooldown'?: number,
        'appid'?: number,
        'created_at'?: number,
        'fee'?: string,
        'frozen_amount'?: string,
        'frozen_num'?: number,
        'game'?: string,
        'goods_id'?: number,
        'icon_url'?: string,
        'id'?: string,
        'num'?: number,
        'pay_method'?: number,
        'price'?: string,
        'real_num'?: number,
        'specific'?: any[],
        'state'?: string,
        'state_text'?: string,
        'tradable_cooldown'?: any,
        'updated_at'?: number,
        'user_id'?: string
    }

    export type BuyOrderResponse = {
        'code'?: string,
        'data'?: {
            'items'?: BuyOrderInfo[]
        }
    }

    /**
     * Gets the currently selected game for the api call
     */
    export function getSelectedGame(): string {
        return document.getElementById('j_game-switcher').getAttribute('data-current');
    }

    /**
     * Get market sell order information on a item
     *
     * @param id The item id
     * @param callback The successor callback
     * @param onretry The failure callback
     * @param maxRetry The max amount or retries before waiting 4.5 seconds
     */
    export function getSellOrderInformation(id: string, callback: (goodsInfo: GoodsInfo) => void, onretry: (status: number) => void, maxRetry: number = 5): void {

        let url = `https://buff.163.com/api/market/goods/sell_order?game=${getSelectedGame()}&goods_id=${id}`;

        let retryCount = 0;

        function call() {
            if (retryCount > maxRetry) return callback(null);

            fRequest.get(url, [], (req, args, e) => {
                if (req.readyState != 4) return;

                if (req.status != 200) {
                    retryCount ++;

                    onretry(req.status);

                    return setTimeout(() => call(), 2_500);
                }

                let result = <SellOrderResponse>Util.parseJson(req);
                let goodsInfo = <GoodsInfo>(result.data.goods_infos[id] ?? {});

                callback(goodsInfo);
            });
        }

        call();
    }

    /**
     * Get market buy order information on a item
     *
     * @param id The item id
     * @param callback The successor callback
     * @param onretry The failure callback
     * @param maxRetry The max amount or retries before waiting 4.5 seconds
     */
    export function getBuyOrderInformation(id: string, callback: (json: BuyOrderInfo) => void, onretry: (status: number) => void, maxRetry: number = 5): void {

        let url = `https://buff.163.com/api/market/goods/buy_order?game=${getSelectedGame()}&goods_id=${id}`;

        let retryCount = 0;

        function call() {
            if (retryCount > maxRetry) return callback(null);

            fRequest.get(url, [], (req, args, e) => {
                if (req.readyState != 4) return;

                if (req.status != 200) {
                    retryCount ++;

                    onretry(req.status);

                    return setTimeout(() => call(), 2500);
                }

                let result = <BuyOrderResponse>Util.parseJson(req);

                let buyOrderInfo: BuyOrderInfo;

                for (let i = 0, l = result.data.items.length; i < l; i ++) {
                    let it = <BuyOrderInfo>result.data.items[i] ?? {};

                    // ignore specific buy orders
                    if ((it.specific ?? []).length > 0) continue;

                    buyOrderInfo = it;

                    break;
                }

                callback(buyOrderInfo);
            });
        }

        call();
    }

    export function getGoodsPageData(callback: () => void): void {
        let query = window.location.href.split('?')[1];

        fRequest.get(`https://buff.163.com/api/market/goods?${query}`, null, (req, args, e) => {
            if (req.readyState != 4) return;

            let response;
            try {
                response = Util.parseJson(req);
            } catch { }

            console.log(response);
        });
    }

}
