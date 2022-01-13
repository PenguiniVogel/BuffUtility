module SchemaHelper {

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
        name: string;
        paints: {
            [id: number]: Paint
        };
        sticker_amount: number;
        type: string;
    }

    export interface Paint {
        collection: string;
        image: string;
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
        stickers: {
            [id: number]: string
        };
        weapons: {
            [id: number]: Weapon
        };
        wears: string[]
    }

    export const lastUpdate = '2.0.9-13.01.2022';

    export let PARSED: any = null;

    export function init(): void {
        PARSED = JSON.parse(raw_schema);

        // remove from memory
        raw_schema = null;
    }

}
