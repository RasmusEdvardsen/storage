export async function get(url: string): Promise<WebResult> {
    try {
        const call = await fetch(url);
        if (!call.ok) { return new WebResult(call.status, call.statusText); }

        const json = await call.text();

        return new WebResult(call.status, json);
    } catch (error) {
        return new WebResult(500, 'Error occurred.');
    }
}

export async function getWithRetry(url: string): Promise<WebResult> {
    return await new WebResult(500, 'not implemented');
}

export async function post(url: string, payload: any): Promise<WebResult> {
    try {
        const call = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'post',
            body: JSON.stringify(payload),
        });
        if (!call.ok) { return new WebResult(call.status, call.statusText); }

        const json = await call.json();

        return new WebResult(call.status, JSON.stringify(json));
    } catch (error) {
        return new WebResult(500, 'Error occurred.');
    }
}

export async function postWithRetry(url: string, payload: any): Promise<WebResult> {
    return await new WebResult(500, 'not implemented');
}

export async function put(url: string, payload: any): Promise<WebResult> {
    return await new WebResult(500, 'not implemented');
}

export async function puttWithRetry(url: string, payload: any): Promise<WebResult> {
    return await new WebResult(500, 'not implemented');
}

export async function remove(url: string): Promise<WebResult> {
    return await new WebResult(500, 'not implemented');
}

export async function del(url: string): Promise<WebResult> {
    return await new WebResult(500, 'not implemented');
}

export async function delWithRetry(url: string): Promise<WebResult> {
    return await new WebResult(500, 'not implemented');
}

export class WebResult {
    public statusCode: number;
    public body?: string;

    constructor(statusCode: number, body?: string) {
        this.statusCode = statusCode;
        if (body) { this.body = body; }
    }
}

// todo check content type, and do .json() or .text()
// call.headers.forEach((value, key, parent) => {
//     console.log(key, value);
// })
// console.log(call.headers.get('content-type'));
