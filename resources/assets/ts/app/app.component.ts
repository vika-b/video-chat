import { Component } from '@angular/core';

import { AuthenticationService } from "../app/services/authentication.service";

@Component({
    selector: 'my-app',
    template: require('./app.component.html'),
    styles: [`${require('./app.component.scss')}`]
})
export class AppComponent {
    public username: string;

    constructor(private authService: AuthenticationService) {
        const user = this.authService.getUser().then(res => {
            this.username = res.user.name;
        });
    }
}