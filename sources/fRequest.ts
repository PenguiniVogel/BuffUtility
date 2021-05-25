/**
 * Author: Felix Vogel
 */
module fRequest {

    export function get(url: string, args: any[], callback: (request: XMLHttpRequest, args: any[], e: Event) => void): void {
        let req = new XMLHttpRequest();

        req.onreadystatechange = (e) => {
            if (callback) callback(req, args, e);
        };

        req.open('GET', url);
        req.send();
    }

}
