declare module SchemaData {

    export const NAME_MAPPING_CH: {
        [name: string]: string
    };

    export const RAW_SCHEMA: SchemaHelper.Schema;

    export const BUFF_SCHEMA: {
        hash_to_id: {
            [hash: string]: number
        },
        id_to_name: {
            [id: number]: string
        },
        name_to_id: {
            [name: string]: number
        }
    };

}