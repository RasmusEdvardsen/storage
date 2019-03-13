// consider parsing in type T, and then return type T in webresult.

export async function get<T>(url: string): Promise<WebResult<T>> {
    try {
        const call = await fetch(url);
        if (!call.ok) { return new WebResult<T>(call.status, undefined, call.statusText); }

        const json = await call.json() as T;

        return new WebResult(call.status, json);
    } catch (error) {
        return new WebResult<T>(500, undefined, 'Error occurred.');
    }
}

export async function getWithRetry(url: string): Promise<any> {
    return await new WebResult(500, 'not implemented');
}

export async function post(url: string, payload: any): Promise<any> {
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

export async function postWithRetry(url: string, payload: any): Promise<any> {
    return await new WebResult(500, 'not implemented');
}

export async function put(url: string, payload: any): Promise<any> {
    return await new WebResult(500, 'not implemented');
}

export async function putWithRetry(url: string, payload: any): Promise<any> {
    return await new WebResult(500, 'not implemented');
}

export async function remove(url: string): Promise<any> {
    return await new WebResult(500, 'not implemented');
}

export async function del(url: string): Promise<any> {
    return await new WebResult(500, 'not implemented');
}

export async function delWithRetry(url: string): Promise<any> {
    return await new WebResult(500, 'not implemented');
}

export class WebResult<T> {
    public statusCode: number;
    public statusText?: string;

    public body?: T;

    constructor(statusCode: number, body?: T, statusText?: string) {
        this.statusCode = statusCode;
        if (statusText) { this.statusText = statusText; }

        if (body) { this.body = body; }
    }
}
