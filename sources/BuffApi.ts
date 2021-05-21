/**
 * Provide a interface to the Buff API
 * with automatic retry on 429 whilst avoiding getting constantly limited
 *
 * Author: Felix Vogel
 */
module BuffApi {

    export type MarketResponse = {
        'code'?: string,
        'data'?: {
            'goods_infos'?: {
                [goods_id: string]: {
                    'appid'?: number,
                    'description'?: null,
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
            }
        }
    };

    /**
     * Gets the currently selected game for the api call
     */
    export function getSelectedGame(): string {
        return document.getElementById('j_game-switcher').getAttribute('data-current');
    }

    /**
     * Get market infortmation on a item
     *
     * @param id The item id
     * @param callback The successor callback
     * @param onretry The failure callback
     * @param maxRetry The max amount or retries before waiting 4.5 seconds
     */
    export function getMarketInformation(id: string, callback: (json: MarketResponse) => void, onretry: (status: number) => void, maxRetry: number = 5): void {
        let url = `https://buff.163.com/api/market/goods/sell_order?game=${getSelectedGame()}&goods_id=${id}`;

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

                callback(fRequest.parseJson(req));
            });
        }

        call();
    }

}
