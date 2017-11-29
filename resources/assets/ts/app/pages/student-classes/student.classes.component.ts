import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import 'rxjs/add/operator/toPromise';

import { AuthenticationService } from "../../services/authentication.service";

@Component({
    selector: 'student-classes-app',
    template: require('./student.classes.component.html'),
    styles: [`${require('./student.classes.component.scss')}`]
})
export class StudentClasseseComponent implements OnInit {
    user: any = {};
    user_info: any = {};
    profile_form: FormGroup;
    avatar_form: FormGroup;
    user_pic: any;
    errors: Array<any>;

    @ViewChild('button') submit_btn: ElementRef;
    @ViewChild('avatar') fileInput: ElementRef;

    constructor(
        private fb: FormBuilder,
        private authService: AuthenticationService
    ) {
        this.user = {
            email: '',
            name: '',
            created_at: '',
        };
        this.user_info = {
            phone: '',
            university: '',
            about_me: '',
            address: '',
            facebook: '',
            twitter: '',
            linkedin: '',
            google_plus: '',
            github: '',
            profile_pic: '',
        };

        const user_infos = this.authService.getUser().then((res: any) => {
            this.user = res;
            this.authService.getUserInfo(res.user.id).then( (res: any) => {
                console.log(res);
                if(!res.error) {
                    this.user_info = res.data;
                    this.user_pic = '/img/profiles/'+ this.user_info.profile_pic;
                }
                this.iniForm();
            });
        });
    }

    iniForm() {
        this.profile_form = this.fb.group({
            email: [this.user.email, [Validators.email]],
            name: [this.user.name],
            phone: [this.user_info.phone,
                [
                    // Validators.pattern('[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}')
                    Validators.pattern('[0-9]{10}')
                ]
            ],
            university: [this.user_info.university],
            about_me: [this.user_info.about_me],
            address: [this.user_info.address],
            facebook: [this.user_info.facebook],
            twitter: [this.user_info.twitter],
            linkedin: [this.user_info.linkedin],
            google_plus: [this.user_info.google_plus],
            github: [this.user_info.github],
            token: [this.authService.token],
            user_id: [this.user.id],
        });

        this.avatar_form = this.fb.group({
            avatar: null,
            user_id: [this.user.id],
            token: [this.authService.token],
        });
    }

    // updateProfile(): Promise <any> {
    updateProfile() {
        const formModel = this.profile_form.value;

        if (this.profile_form.valid) {
            this.authService.updateUserInfo(formModel);
            /*return this.authService.register(formModel).then(res => {
                if (res) {
                    // this.router.navigate(['/']);
                } else {
                    console.log('Username or password is incorrect');
                }
            });*/
        }
    }

    fileChange(event: any) {
        let reader = new FileReader();
        const formModel = this.avatar_form.value;
        if(event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.authService.updateUserPic(reader.result, this.user.id).then((res: any) => {
                    console.log(JSON.parse(res._body));
                    let result = JSON.parse(res._body);
                    if(result.status) {
                        this.user_pic = result.profile_pic;
                    }
                    else {
                        this.errors.push('Whoops, looks like something went wrong.')
                    }
                    console.log(result);
                });
            };

            console.log(this.avatar_form);
        }
    }

    ngOnInit() {
        this.iniForm();
    }
}