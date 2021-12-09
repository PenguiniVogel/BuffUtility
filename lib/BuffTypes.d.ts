declare module BuffTypes {

    export module SellOrder {

        export interface Category {
            category: string;
            internal_name: string;
            localized_name: string;
        }

        export interface Tags {
            [name: string]: Category;
        }

        export interface GoodsInfo {
            appid: number;
            description?: any;
            game: string;
            goods_id: number;
            icon_url: string;
            item_id?: any;
            market_hash_name: string;
            market_min_price: string;
            name: string;
            original_icon_url: string;
            short_name: string;
            steam_price: string;
            steam_price_cny: string;
            steam_price_custom: string;
            tags: Tags;
        }

        export interface GoodsInfos {
            [id: number]: GoodsInfo;
        }

        export interface HasMarketStores {
            [name: string]: boolean;
        }

        export interface Info {
            fraudwarnings?: any;
            icon_url: string;
            original_icon_url: string;
            paintindex: number;
            paintseed: number;
            stickers: any[];
            tournament_tags: any[];
        }

        export interface AssetInfo {
            action_link: string;
            appid: number;
            assetid: string;
            classid: string;
            contextid: number;
            goods_id: number;
            has_tradable_cooldown: boolean;
            info: Info;
            instanceid: string;
            paintwear: string;
            tradable_cooldown_text: string;
            tradable_unfrozen_time?: any;
        }

        export interface Item {
            allow_bargain: boolean;
            appid: number;
            asset_info: AssetInfo;
            bookmarked: boolean;
            can_bargain: boolean;
            cannot_bargain_reason: string;
            coupon_infos?: any;
            created_at: number;
            description: string;
            featured: number;
            fee: string;
            game: string;
            goods_id: number;
            id: string;
            income: string;
            lowest_bargain_price: string;
            mode: number;
            price: string;
            recent_average_duration: number;
            recent_deliver_rate: number;
            state: number;
            supported_pay_methods: number[];
            tradable_cooldown?: any;
            updated_at: number;
            user_id: string;
        }

        export interface UserInfo {
            avatar: string;
            avatar_safe: string;
            is_premium_vip: boolean;
            nickname: string;
            seller_level: number;
            shop_id: string;
            user_id: string;
            v_types?: any;
        }

        export interface UserInfos {
            [name: string]: UserInfo;
        }

        export interface Data {
            goods_infos: GoodsInfos;
            has_market_stores: HasMarketStores;
            items: Item[];
            page_num: number;
            page_size: number;
            sort_by: string;
            total_count: number;
            total_page: number;
            user_infos: UserInfos;
        }

        export interface RootObject {
            code: string;
            data: Data;
            msg?: any;
        }

    }

}
