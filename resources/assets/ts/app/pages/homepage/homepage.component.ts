import { Component } from '@angular/core';
import { Router } from "@angular/router";

import { AuthenticationService } from '../../services/authentication.service';

@Component({
    selector: 'homepage-app',
    template: require('./homepage.component.html'),
    styles: [`${require('./homepage.component.scss')}`]
})
export class HomepageComponent {
    user: any;
    role: any;
    class_link: any = '#';

    constructor(private router: Router, private authService: AuthenticationService) {
        this.authService.getUser().then((res) => {
            console.log(res);
            this.user = res.user;
            this.role = res.role;
            if (res.role.role_id === 1) {
                this.class_link = '/student-classes';
            }
            if (res.role.role_id === 2) {
                this.class_link = '/teacher-classes';
            }
        });
        console.log(this.authService.user);
    }
}