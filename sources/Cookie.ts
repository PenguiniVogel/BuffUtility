/**
 * Author: Felix Vogel
 */
/** */
module Cookie {

    export const COOKIE_BUFF_UTILITY_OPTIONS: string = 'buff_utility_options';

    export function read(name: string): string {
        let result = new RegExp(`(?:^|; )${encodeURIComponent(name)}=([^;]*)`).exec(document.cookie);

        return result ? result[1] : null;
    }

    export function write(name: string, value: string, days: number = 365 * 20): void {
        let date = new Date();

        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));

        document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
    }

}
