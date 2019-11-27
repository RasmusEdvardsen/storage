import { Configuration } from "msal";

export const config: Configuration = {
    auth: {
        clientId: "f45ee6d4-23dd-4ada-b42a-447352d9dd70",
        authority:
            "https://login.microsoftonline.com/0d584642-1f4f-47d2-9ae2-8c67fea8fa12",
        redirectUri: "http://localhost:8080",
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true,
    },
};
