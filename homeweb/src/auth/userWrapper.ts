import { UserAgentApplication } from "msal";
import { authParams } from "./authParams";
import { config } from "./config";
import { error } from "@/log/log";

export default class UserWrapper {
    public userAgentApplication: UserAgentApplication;

    constructor() {
        this.userAgentApplication = new UserAgentApplication(config);
    }

    public init(): void {
        this.userAgentApplication = new UserAgentApplication(config);
    }

    public isLoggedIn(): boolean {
        return !!this.userAgentApplication.getAccount();
    }

    public account() {
        if (this.isLoggedIn()) {
            return this.userAgentApplication.getAccount();
        }
    }

    public logout(): void {
        this.userAgentApplication.logout();
    }

    public loginPopup(callback?: () => void): void {
        this.userAgentApplication
            .loginPopup(authParams)
            .then((_) => {
                this.userAgentApplication.acquireTokenSilent(authParams)
                    .then((__) => {if (callback) { callback(); }})
                    .catch((err) => error(err));
            })
            .catch((e) => error(e));
    }

    public async accessToken(): Promise<string> {
        try {
            const tmp = await this.userAgentApplication.acquireTokenSilent(authParams);
            return tmp.accessToken;
        } catch (error) {
            return "";
        }
    }
}
