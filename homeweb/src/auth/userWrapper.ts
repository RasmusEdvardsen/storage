import { UserAgentApplication } from 'msal';
import { authParams } from './authParams';
import { config } from './config';

export default class UserWrapper {
    userAgentApplication: UserAgentApplication;

    constructor() {
        this.userAgentApplication = new UserAgentApplication(config);
    }

    init() {
        this.userAgentApplication = new UserAgentApplication(config);
    }

    isLoggedIn(): boolean {
        return !!this.userAgentApplication.getAccount();
    }

    account() {
        if (this.isLoggedIn())
            return this.userAgentApplication.getAccount();
    }

    logout() {
        this.userAgentApplication.logout();
    }

    loginPopup(callback?: () => void) {
        this.userAgentApplication
            .loginPopup(authParams)
            .then(_ => {
                this.userAgentApplication.acquireTokenSilent(authParams)
                    .then(tokenResponse => {
                        console.log(tokenResponse);
                        if (callback) callback();
                    })
                    .catch(error => {
                        console.log(error)
                    });
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}