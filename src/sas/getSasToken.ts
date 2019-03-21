import { get } from './../web/web';

export default async function getSasToken(): Promise<string | number> {
    try {
        const sasTokenQueryParameters = '?p=read,write,list,add,delete,create';
        const sasTokenUri = 'https://homestoragefunc.azurewebsites.net/api/SasTokenGenerator';
        const sasCall = await get<{ token: string }>(sasTokenUri + sasTokenQueryParameters);
        if (sasCall.statusCode !== 200 || !sasCall.body) { return sasCall.statusCode; }
        return sasCall.body.token;
    } catch (error) {
        return 500;
    }
}
