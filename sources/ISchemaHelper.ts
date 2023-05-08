module ISchemaHelper {

    DEBUG && console.debug('[BuffUtility] Module.ISchemaHelper');

    export const NAME_MAPPING_CH: {
        [name: string]: string
    } = {
        '鲍伊猎刀': 'Bowie Knife',
        '蝴蝶刀': 'Butterfly Knife',
        '弯刀': 'Falchion Knife',
        '折叠刀': 'Flip Knife',
        '穿肠刀': 'Gut Knife',
        '猎杀者匕首': 'Huntsman Knife',
        'M9 刺刀': 'M9 Bayonet',
        '刺刀': 'Bayonet',
        '爪子刀': 'Karambit',
        '暗影双匕': 'Shadow Daggers',
        '短剑': 'Stiletto Knife',
        '熊刀': 'Ursus Knife',
        '折刀': 'Navaja Knife',
        '锯齿爪刀': 'Talon Knife',
        '海豹短刀': 'Classic Knife',
        '系绳匕首': 'Paracord Knife',
        '求生匕首': 'Survival Knife',
        '流浪者匕首': 'Nomad Knife',
        '骷髅匕首': 'Skeleton Knife',

        'P2000': 'P2000',
        'USP 消音版': 'USP-S',
        '格洛克 18 型': 'Glock-18',
        'P250': 'P250',
        'FN57': 'Five-SeveN',
        'CZ75 自动手枪': 'CZ75-Auto',
        'Tec-9': 'Tec-9',
        'R8 左轮手枪': 'R8 Revolver',
        '沙漠之鹰': 'Desert Eagle',
        '双持贝瑞塔': 'Dual Berettas',

        '加利尔 AR': 'Galil AR',
        'SCAR-20': 'SCAR-20',
        'AWP': 'AWP',
        'AK-47': 'AK-47',
        '法玛斯': 'FAMAS',
        'M4A4': 'M4A4',
        'M4A1 消音版': 'M4A1-S',
        'M4A1 消音型': 'M4A1-S',
        'SG 553': 'SG 553',
        'SSG 08': 'SSG 08',
        'AUG': 'AUG',
        'G3SG1': 'G3SG1',

        'P90': 'P90',
        'MAC-10': 'MAC-10',
        'UMP-45': 'UMP-45',
        'MP7': 'MP7',
        'PP-野牛': 'PP-Bizon',
        'MP9': 'MP9',
        'MP5-SD': 'MP5-SD',

        '截短霰弹枪': 'Sawed off',
        'XM1014': 'XM1014',
        '新星': 'Nova',
        'MAG-7': 'MAG-7',

        'M249': 'M249',
        '内格夫': 'Negev',

        '血猎手套': 'Bloodhound Gloves',
        '驾驶手套': 'Driver Gloves',
        '手部束带': 'Hand Wraps',
        '摩托手套': 'Moto Gloves',
        '专业手套': 'Specialist Gloves',
        '运动手套': 'Sport Gloves',
        '九头蛇手套': 'Hydra Gloves',
        '狂牙手套': 'Broken Fang Glove'
    };

    export async function find(name: string, weaponOnly: boolean = false, isVanilla: boolean = false, reduceInformation: boolean = false) {
        return await BrowserInterface.delegate<BrowserInterface.SchemaHelperFindDelegation, SchemaTypes.Weapon[]>({
            method: BrowserInterface.DelegationMethod.SCHEMA_HELPER_FIND,
            parameters: {
                name: name,
                weaponOnly: weaponOnly,
                isVanilla: isVanilla,
                reduceInformation: reduceInformation
            }
        });
    }

}
