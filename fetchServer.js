export default class fetchServer {
    static baseUrl = 'https://dev.besmit.com/Pet-Efectivo/api/';

    constructor() {
    }

    static async call(url = '', method = 'GET', data = {}) {
        let othat = this;
        let callUrl = othat.baseUrl + url;
        let settings = {
            method: method,
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        };
        if (data.constructor === Object && Object.keys(data).length !== 0) {
            settings.body = JSON.stringify(data);
        }
        return await fetch(callUrl, settings)
            .then(res => {
                //if (!res.ok) throw new Error(res.status);
                return res.text().then(function (text) {
                    return { 'data': text, 'status': res.status, 'ok': res.ok }
                });
            })
            .then(
                (result) => {
                    let response = result;
                    try {
                        response.data = JSON.parse(result.data);
                        return response;
                    } catch (er) {
                        return result;
                    }
                },
                (error) => {
                    throw new Error(error);
                }
            );
    }

}