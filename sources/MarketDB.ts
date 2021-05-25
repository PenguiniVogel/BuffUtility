module MarketDB {

    export const enum MarketStoreID {
        SELL,
        BUY
    }

    export type MarketDBStoreData = {
        gid: string,
        timestamp: number,
        data: string
    }

    const DB_MARKET = 'buff_utility_db';
    const STORE_SELL_ORDER = 'buff_utility_store_sell_order';
    const STORE_BUY_ORDER = 'buff_utility_store_buy_order';

    export let onopen: () => void = () => {};

    let marketDB: IDBDatabase;

    export function init() {
        let openDBReq = indexedDB.open(DB_MARKET, 4);

        openDBReq.onupgradeneeded = (e) => {
            marketDB = marketDB ?? openDBReq.result;

            let sellStore = marketDB.createObjectStore(STORE_SELL_ORDER, { autoIncrement: true, keyPath: 'gid' });
            sellStore.createIndex('timestamp', 'timestamp', { unique: false });

            let buyStore = marketDB.createObjectStore(STORE_BUY_ORDER, { autoIncrement: true, keyPath: 'gid' });
            buyStore.createIndex('timestamp', 'timestamp', { unique: false });
        };

        openDBReq.onsuccess = () => {
            marketDB = marketDB ?? openDBReq.result;

            onopen();
        };

        openDBReq.onerror = (e) => console.error('[BuffUtility]', e);
    }

    function getObjectStore(name: string): IDBObjectStore {
        let store: IDBObjectStore = null;

        try {
            if (marketDB.objectStoreNames.contains(name)) {
                store = marketDB.transaction(name, 'readwrite').objectStore(name);
            }
        } catch {
            console.error(`[BuffUtility] Failed accessing store ${name}.`);
        }
        
        return store;
    }

    export function get(gid: string, store: MarketStoreID): IDBRequest<MarketDBStoreData> {
        switch (store) {
            case MarketDB.MarketStoreID.SELL:
                return getObjectStore(STORE_SELL_ORDER).get(gid);
            case MarketDB.MarketStoreID.BUY:
                return getObjectStore(STORE_BUY_ORDER).get(gid);
        }
    }

    export function add(data: MarketDBStoreData, store: MarketStoreID): IDBRequest<IDBValidKey> {
        return put(data, store);
    }

    export function put(data: MarketDBStoreData, store: MarketStoreID): IDBRequest<IDBValidKey> {
        switch (store) {
            case MarketDB.MarketStoreID.SELL:
                return getObjectStore(STORE_SELL_ORDER).put(data);
            case MarketDB.MarketStoreID.BUY:
                return getObjectStore(STORE_BUY_ORDER).put(data);
        }
    }

}
