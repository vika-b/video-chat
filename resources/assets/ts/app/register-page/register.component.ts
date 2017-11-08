import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import 'rxjs/add/operator/toPromise';
import { Router } from "@angular/router";

import { AuthenticationService } from "../services/authentication.service";

@Component({
    selector: 'register-app',
    template: require('./register.component.html'),
    styles: [
        `${require('./register.component.scss')}`,
        `${require('../login-page/login.component.scss')}`,
    ]
})
export class RegisterComponent {
    register_form: FormGroup;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private authService: AuthenticationService
    ) {
        this.iniForm();
    }

    iniForm() {
        this.register_form = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
            name: ['', [Validators.required]],
        });
    }

    registerUser(): Promise <any> {
        const formModel = this.register_form.value;

        if (this.register_form.valid) {
            return this.authService.register(formModel).then(res => {
                if (res) {
                    this.router.navigate(['/']);
                } else {
                    console.log('Username or password is incorrect');
                }
            });
        }
    }
}