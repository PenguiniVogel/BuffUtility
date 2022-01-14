module SchemaHelper {

    // manage https://csgofloat.com/api/v1/schema

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
        sticker_amount: number;
        type: string;

        map_paints: { id: number, paint: Paint }[];
    }

    interface IWeapon extends Weapon {
        paints: {
            [id: number]: Paint
        };
    }

    export interface Paint {
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
        map_weapons: { id: number, weapon: IWeapon }[];
    }

    interface ISchema extends Schema {
        stickers?: {
            [id: number]: string
        };
        weapons?: {
            [id: number]: IWeapon
        };
    }

    export const LAST_UPDATE = '2.0.9-14.01.2022';

    let parsed: Schema = null;

    export function init(): void {
        parsed = JSON.parse(raw_schema);

        // remove from memory
        raw_schema = null;

        if (!parsed.formatted) {
            // set stuff
            let keys_stickers = Object.keys((<ISchema>parsed).stickers).map(x => +x);
            let keys_weapons = Object.keys((<ISchema>parsed).weapons).map(x => +x);

            parsed.map_stickers = [];
            parsed.map_weapons = [];

            // map stuff
            for (let l_sticker of keys_stickers) {
                parsed.map_stickers.push({ id: l_sticker, name: (<ISchema>parsed).stickers[l_sticker] });
            }

            delete parsed['stickers'];

            for (let l_weapon of keys_weapons) {
                let weapon = (<ISchema>parsed).weapons[l_weapon];

                parsed.map_weapons.push({ id: l_weapon, weapon: weapon });

                let keys_paints = Object.keys(weapon.paints).map(x => +x);

                weapon.map_paints = [];

                for (let l_paint of keys_paints) {
                    let paint = weapon.paints[l_paint];

                    weapon.map_paints.push({ id: l_paint, paint: paint });

                    // delete a bunch of overhead data
                    delete paint['image'];
                    delete paint['normal_prices'];
                    delete paint['normal_volume'];
                    delete paint['stattrak_prices'];
                    delete paint['stattrak_volume'];
                }

                delete weapon['paints'];
            }

            delete parsed['weapons'];

            console.warn('[BuffUtility] Schema not formatted:', parsed, JSON.stringify(parsed));
        }
    }

    export function getWeaponByName(name: string): Weapon {
        return parsed.map_weapons.filter(x => name == x.weapon.name)[0]?.weapon;
    }

    export function getSkinFromWeaponByName(weapon: Weapon, name: string): Paint {
        return weapon.map_paints.filter(x => name == x.paint.name)[0]?.paint;
    }

    export function getWeaponAndSkinByName(name: string): [Weapon, Paint] {
        let parts = name.split(' | ');
        let weapon = getWeaponByName(parts[0]);
        let paint = getSkinFromWeaponByName(weapon, parts[1]);

        return [weapon, paint];
    }

}
