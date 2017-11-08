import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import 'rxjs/add/operator/toPromise';
import { Router } from "@angular/router";

import { AuthenticationService } from "../services/authentication.service";

@Component({
    selector: 'login-app',
    template: require('./login.component.html'),
    styles: [`${require('./login.component.scss')}`]
})
export class LoginComponent {
    login_form: FormGroup;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private authService: AuthenticationService
    ) {
        this.iniForm();
    }

    iniForm() {
        this.login_form = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
            remember: ''
        });
    }

    loginUser(): Promise <any> {
        const formModel = this.login_form.value;

        return this.authService.login(formModel).then(res => {
            if (res) {
                this.router.navigate(['/']);
            } else {
                console.log('Username or password is incorrect');
            }
        });
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}