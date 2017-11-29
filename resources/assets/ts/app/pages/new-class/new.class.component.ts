import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import 'rxjs/add/operator/toPromise';
import { Router } from "@angular/router";

import { AuthenticationService } from "../../services/authentication.service";

@Component({
    selector: 'new-class-app',
    template: require('./new.class.component.html'),
    styles: [`${require('./new.class.component.scss')}`]
})
export class NewClassComponent implements OnInit {
    class: any = {};
    user: any = {};
    class_pic: any = '';
    errors: Array<any>;
    pickerColor: string = '#BA0800';
    date: Date = new Date();
    input7Moment: any = [this.date, new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0)];

    new_class_form: FormGroup;
    en: any;

    @ViewChild('button') submit_btn: ElementRef;
    @ViewChild('avatar') fileInput: ElementRef;

    constructor(
        private fb: FormBuilder,
        private authService: AuthenticationService,
        private router: Router
    ) {
        this.class = {
            name: '',
            description: '',
            enroll_date: this.date,
            finish_date: new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0),
        };
        this.en = {
            firstDayOfWeek: 0,
            dayNames: ["Sunday", "Monday", "Tuesday","Wednesday", "Thursday", "Friday", "Saturday"],
            dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            monthNames: [ "January","February","March","April","May","June","July","August","September","October","November","December" ],
            monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
        };

        const user_infos = this.authService.getUser().then((res: any) => {
            console.log(res);
            this.user = res.user;
            /*this.authService.getUserInfo(res.user.id).then( (res: any) => {
                if(!res.error) {
                    this.class = res.data;
                    this.class = '/img/profiles/'+ this.class.profile_pic;
                }
            });*/
            this.iniForm();
        });
    }

    iniForm() {
        this.new_class_form = this.fb.group({
            class_name: [this.class.name, [Validators.required]],
            class_description: [this.class.description],
            user_id: [this.user.id],
            picture: null,
            date_range: [null, [Validators.required]],
            token: [this.authService.token],
        });
    }

    fileChange(event: any) {
        let reader = new FileReader();

        if(event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.class_pic = reader.result;
            };
        }
    }

    createNewClass() {
        const formModel = this.new_class_form.value;
        if (this.new_class_form.valid) {
            console.log(formModel);
            this.authService.createClass(formModel, this.class_pic).then((res) => {
                console.log(res);
                const result = JSON.parse(res);
                if(result.status) {
                    this.router.navigate(['/my-classes'])
                }
            });
        }

    }

    ngOnInit() {
        this.iniForm();
    }
}