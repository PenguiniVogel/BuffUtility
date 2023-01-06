module PSE_Currencies {

    DEBUG && console.debug('[PSE] Module.PSE_Currencies');

    export interface SteamCurrency {
        code: string,
        currencyId: number,
        symbol: string
    }

    export const STEAM_CURRENCIES: SteamCurrency[] = [
        {
            code: 'USD',
            currencyId: 1,
            symbol: '$'
        },
        {
            code: 'GBP',
            currencyId: 2,
            symbol: '£'
        },
        {
            code: 'EUR',
            currencyId: 3,
            symbol: '€'
        },
        {
            code: 'CHF',
            currencyId: 4,
            symbol: 'CHF'
        },
        {
            code: 'RUB',
            currencyId: 5,
            symbol: 'pуб.'
        },
        {
            code: 'BRL',
            currencyId: 7,
            symbol: 'R$'
        },
        {
            code: 'JPY',
            currencyId: 8,
            symbol: '¥'
        },
        {
            code: 'NOK',
            currencyId: 9,
            symbol: 'kr'
        },
        {
            code: 'IDR',
            currencyId: 10,
            symbol: 'Rp'
        },
        {
            code: 'MYR',
            currencyId: 11,
            symbol: 'RM'
        },
        {
            code: 'PHP',
            currencyId: 12,
            symbol: 'P'
        },
        {
            code: 'SGD',
            currencyId: 13,
            symbol: 'S$'
        },
        {
            code: 'THB',
            currencyId: 14,
            symbol: '฿'
        },
        {
            code: 'VND',
            currencyId: 15,
            symbol: '₫'
        },
        {
            code: 'KRW',
            currencyId: 16,
            symbol: '₩'
        },
        {
            code: 'TRY',
            currencyId: 17,
            symbol: 'TL'
        },
        {
            code: 'UAH',
            currencyId: 18,
            symbol: '₴'
        },
        {
            code: 'MXN',
            currencyId: 19,
            symbol: 'Mex$'
        },
        {
            code: 'CAD',
            currencyId: 20,
            symbol: 'CDN$'
        },
        {
            code: 'AUD',
            currencyId: 21,
            symbol: 'A$'
        },
        {
            code: 'NZD',
            currencyId: 22,
            symbol: 'NZ$'
        },
        {
            code: 'PLN',
            currencyId: 6,
            symbol: 'zł'
        },
        {
            code: 'CNY',
            currencyId: 23,
            symbol: '¥'
        },
        {
            code: 'INR',
            currencyId: 24,
            symbol: '₹'
        },
        {
            code: 'CLP',
            currencyId: 25,
            symbol: 'CLP$'
        },
        {
            code: 'PEN',
            currencyId: 26,
            symbol: 'S/.'
        },
        {
            code: 'COP',
            currencyId: 27,
            symbol: 'COL$'
        },
        {
            code: 'ZAR',
            currencyId: 28,
            symbol: 'R'
        },
        {
            code: 'HKD',
            currencyId: 29,
            symbol: 'HK$'
        },
        {
            code: 'TWD',
            currencyId: 30,
            symbol: 'NT$'
        },
        {
            code: 'SAR',
            currencyId: 31,
            symbol: 'SR'
        },
        {
            code: 'AED',
            currencyId: 32,
            symbol: 'AED'
        },
        {
            code: 'SEK',
            currencyId: 33,
            symbol: 'kr'
        },
        {
            code: 'ARS',
            currencyId: 34,
            symbol: 'ARS$'
        },
        {
            code: 'ILS',
            currencyId: 35,
            symbol: '₪'
        },
        {
            code: 'BYN',
            currencyId: 36,
            symbol: 'Br'
        },
        {
            code: 'KZT',
            currencyId: 37,
            symbol: '₸'
        },
        {
            code: 'KWD',
            currencyId: 38,
            symbol: 'KD'
        },
        {
            code: 'QAR',
            currencyId: 39,
            symbol: 'QR'
        },
        {
            code: 'CRC',
            currencyId: 40,
            symbol: '₡'
        },
        {
            code: 'UYU',
            currencyId: 41,
            symbol: '$U'
        },
        {
            code: 'BGN',
            currencyId: 42,
            symbol: 'лв'
        },
        {
            code: 'HRK',
            currencyId: 43,
            symbol: 'kn'
        },
        {
            code: 'CZK',
            currencyId: 44,
            symbol: 'Kč'
        },
        {
            code: 'DKK',
            currencyId: 45,
            symbol: 'kr.'
        },
        {
            code: 'HUF',
            currencyId: 46,
            symbol: 'Ft'
        },
        {
            code: 'RON',
            currencyId: 47,
            symbol: 'lei'
        },
        {
            code: 'RMB',
            currencyId: 9000,
            symbol: '刀币'
        },
        {
            code: 'NXP',
            currencyId: 9001,
            symbol: '원'
        }
    ];

    export function getByCode(code: string): SteamCurrency {
        return STEAM_CURRENCIES.find(e => e.code == code);
    }

    export function getById(id: number): SteamCurrency {
        return STEAM_CURRENCIES.find(e => e.currencyId == id);
    }

    export function getBySymbol(symbol: string): SteamCurrency {
        return STEAM_CURRENCIES.find(e => e.symbol == symbol);
    }

}
