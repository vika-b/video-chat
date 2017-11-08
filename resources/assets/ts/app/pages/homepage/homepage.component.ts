import { Component } from '@angular/core';

import { AuthenticationService } from "../../services/authentication.service";

@Component({
    selector: 'homepage-app',
    template: require('./homepage.component.html'),
    styles: [`${require('./homepage.component.scss')}`]
})
export class HomepageComponent {
    public username: string;

    constructor(private authService: AuthenticationService) {
        const user = this.authService.getUser().then(res => {
            this.username = res.name;
        });
    }
}