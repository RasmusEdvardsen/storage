import { UserAgentApplication } from 'msal';
import { authParams } from './authParams';
import { config } from './config';

export default class UserWrapper {
    userAgentApplication: UserAgentApplication;

    constructor() {
        this.userAgentApplication = new UserAgentApplication(config);
    }

    init(): void {
        this.userAgentApplication = new UserAgentApplication(config);
    }

    isLoggedIn(): boolean {
        return !!this.userAgentApplication.getAccount();
    }

    account() {
        if (this.isLoggedIn())
            return this.userAgentApplication.getAccount();
    }

    logout(): void {
        this.userAgentApplication.logout();
    }

    loginPopup(callback?: () => void): void {
        this.userAgentApplication
            .loginPopup(authParams)
            .then(_ => {
                this.userAgentApplication.acquireTokenSilent(authParams)
                    .then(_ => {if (callback) callback();})
                    .catch(error => console.log(error));
            })
            .catch(err => console.log(err));
    }

    async accessToken(): Promise<string> {
        try {
            let tmp = await this.userAgentApplication.acquireTokenSilent(authParams)
            return tmp.accessToken;
        } catch (error) {
            return "";
        }
    }
}