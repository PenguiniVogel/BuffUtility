module Cookie {

    /**
     * @deprecated please use {@link BrowserInterface.Storage.get} now
     *
     * @param name
     */
    export function read(name: string): string {
        let result = new RegExp(`(?:^|; )${encodeURIComponent(name)}=([^;]*)`).exec(document.cookie);

        return result ? result[1] : null;
    }

    /**
     * @deprecated please use {@link BrowserInterface.Storage.set} now
     *
     * @param name
     * @param value
     * @param days
     */
    export function write(name: string, value: string, days: number = 365 * 20): void {
        let date = new Date();

        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));

        if (DEBUG) {
            console.debug(`${name}=${value};path=/;expires=${date.toUTCString()}`);
        }

        document.cookie = `${name}=${value};path=/;expires=${date.toUTCString()}`;
    }

}
