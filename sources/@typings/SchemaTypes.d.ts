declare module SchemaTypes {

    export interface Collection {
        key: string;
        name: string;
        has_souvenir?: boolean;
        has_crate?: boolean;
    }

    export interface Rarity {
        key: string;
        name: string;
        value: number;
    }

    export interface Weapon {
        id: number;
        name: string;
        sticker_amount: number;
        type: string;

        map_paints: Paint[];
    }

    export interface Paint {
        id: number;
        weapon_id: number;
        collection: string;
        max: number;
        min: number;
        name: string;
        rarity: number;
        souvenir?: boolean;
        stattrak?: boolean;
    }

    export interface Schema {
        collections: Collection[];
        rarities: Rarity[];
        wears: string[];

        formatted?: boolean;
        map_stickers: { id: number, name: string }[];
        map_weapons: Weapon[];
    }

}
