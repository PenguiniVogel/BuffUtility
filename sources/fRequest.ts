/**
 * Author: Felix Vogel
 */
module fRequest {

    export function parseJson<T extends object>(req: XMLHttpRequest): T {
        let result: T = <T>{};

        if (typeof req.response == 'object') {
            result = req.response;
        } else {
            result = JSON.parse(req.responseText);
        }

        return result;
    }

    export function get(url: string, args: any[], callback: (request: XMLHttpRequest, args: any[], e: Event) => void): void {
        let req = new XMLHttpRequest();

        req.onreadystatechange = (e) => {
            if (callback) callback(req, args, e);
        };

        req.open('GET', url);
        req.send();
    }

}
