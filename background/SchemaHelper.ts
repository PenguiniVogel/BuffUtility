module SchemaHelper {

    DEBUG && console.debug('[BuffUtility] Module.SchemaHelper');

    // imports
    import Schema = SchemaTypes.Schema;
    import Weapon = SchemaTypes.Weapon;
    import Paint = SchemaTypes.Paint;

    interface IWeapon extends Weapon {
        paints: {
            [id: number]: Paint
        };
    }

    interface ISchema extends Schema {
        stickers?: {
            [id: number]: string
        };
        weapons?: {
            [id: number]: IWeapon
        };
    }

    export const LAST_UPDATE = '2.1.8-28.11.2022';

    let parsed: Schema = <Schema>SchemaData.CSGO_SCHEMA;

    export function init(): void {
        let start = Date.now();

        if (typeof SchemaData.CSGO_SCHEMA == 'string') {
            parsed = JSON.parse(SchemaData.CSGO_SCHEMA);
        }

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

                weapon.id = l_weapon;

                parsed.map_weapons.push(weapon);

                let keys_paints = Object.keys(weapon.paints).map(x => +x);

                weapon.map_paints = [];

                for (let l_paint of keys_paints) {
                    let paint = weapon.paints[l_paint];

                    paint.id = l_paint;
                    paint.weapon_id = l_weapon;

                    weapon.map_paints.push(paint);

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

            parsed.formatted = true;

            console.warn('[BuffUtility] Schema not formatted!');
            console.debug('[BuffUtility] Schema not formatted:', parsed, JSON.stringify(parsed));
        }

        console.debug(`[BuffUtility] Schema (v. ${LAST_UPDATE}) loaded. (${Date.now() - start} ms)`);
    }

    /**
     * Find weapon(s) by the specified name <br>
     * e.g. Glock-18 | Gamma Doppler would return the Glock-18 with the 5 gamma phase paints
     *
     * @param name
     * @param weaponOnly
     * @param isVanilla
     * @param reducedInformation
     */
    export function find(name: string, weaponOnly: boolean = false, isVanilla: boolean = false, reducedInformation: boolean = false): Weapon[] {
        const d_filter = (a: string, b: string) => a.indexOf(b) > -1 || b.indexOf(a) > -1;
        const d_sort = (a: { name: string }, b: { name: string }, compare: string) => pStrCompare(a.name, compare) > pStrCompare(b.name, compare) ? -1 : 1;

        let parts = name.split(' | ');

        let result = findWeapons(x => d_filter(x.name, parts[0]), reducedInformation);

        // result = result.sort((a, b) => Util.pStrCompare(a.name, parts[0]) > Util.pStrCompare(b.name, parts[0]) ? -1 : 1);
        result = result.sort((a, b) => d_sort(a, b, parts[0]));

        // we only have a weapon name (presumably)
        if ((parts.length == 1 && !isVanilla) || weaponOnly) {
            return result ?? [];
        } else {
            if (isVanilla) {
                parts[1] = 'Vanilla';
            }

            result = result.map(x => <Weapon>findPaintOnWeapon(x, p => d_filter(p.name, parts[1])));
            result.forEach(x => x.map_paints.sort((a, b) => d_sort(a, b, parts[1])));

            // result.forEach(x => x.map_paints.sort((a, b) => Util.pStrCompare(a.name, parts[1]) > Util.pStrCompare(b.name, parts[1]) ? -1 : 1));
            // result.forEach(x => x.map_paints.sort((a, b) => d_sort(a, b, 1, parts)));
        }

        return result ?? [];
    }

    /**
     * Finds all weapons that pass the specified test
     *
     * @param filter
     * @param reducedInformation
     */
    export function findWeapons(filter: (weapon: Weapon) => boolean, reducedInformation: boolean = false): Weapon[] {
        let weapons: Weapon[] = [];

        for (let l_weapon of parsed.map_weapons) {
            if (filter(l_weapon)) {
                let clone: Weapon = JSON.parse(JSON.stringify(l_weapon));

                if (reducedInformation) {
                    clone.map_paints = [];
                }

                weapons.push(clone);
            }
        }

        return weapons;
    }

    /**
     * Returns all weapons that contain a paint that passed the specified test <br>
     * The paint list only contains paints that passed the test
     *
     * @param filter
     */
    export function findPaints(filter: (paint: Paint) => boolean): Weapon[] {
        let weapons: Weapon[] = [];

        for (let l_weapon of parsed.map_weapons) {
            let f_paints = l_weapon.map_paints.filter(x => filter(x));

            // if we have no paints don't add
            if (f_paints?.length == 0) continue;

            weapons.push(JSON.parse(JSON.stringify({
                ...l_weapon,
                map_paints: f_paints
            })));
        }

        return weapons;
    }

    /**
     * Returns the weapon with filtered paints
     *
     * @param weapon
     * @param filter
     */
    export function findPaintOnWeapon(weapon: Weapon, filter: (paint: Paint) => boolean): Weapon {
        let f_paints = weapon.map_paints.filter(x => filter(x));

        return <Weapon>JSON.parse(JSON.stringify(<Weapon>{ ...weapon, map_paints: f_paints }));
    }

    // string compare

    function pStrCompare(first, second): number {
        first = first.replace(/\s+/g, '');
        second = second.replace(/\s+/g, '');

        if (first === second) return 1;
        if (first.length < 2 || second.length < 2) return 0;

        let firstBigrams = {};
        for (let i = 0; i < first.length - 1; i++) {
            const bigram = first.substring(i, i + 2);
            firstBigrams[bigram] = firstBigrams[bigram] ? firstBigrams[bigram] + 1 : 1;
        }

        let intersectionSize = 0;
        for (let i = 0; i < second.length - 1; i++) {
            const bigram = second.substring(i, i + 2);
            const count = firstBigrams[bigram] ? firstBigrams[bigram] : 0;

            if (count > 0) {
                firstBigrams[bigram] = count - 1;
                intersectionSize ++;
            }
        }

        return (2.0 * intersectionSize) / (first.length + second.length - 2);
    }

}
