import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import 'rxjs/add/operator/toPromise';
import { ActivatedRoute, Router } from "@angular/router";

import { AuthenticationService } from "../../services/authentication.service";

@Component({
    selector: 'edit-class-app',
    template: require('./edit.class.component.html'),
    styles: [`${require('./edit.class.component.scss')}`]
})
export class EditClassComponent implements OnInit {
    class: any = {};
    user: any = {};
    data: any = {
        picture: 'default.png'
    };
    class_id: any = 1;
    class_pic: any = '';
    errors: Array<any>;
    date: Date = new Date();
    input7Moment: any = [this.date, new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0)];

    new_class_form: FormGroup;
    en: any;

    @ViewChild('button') submit_btn: ElementRef;
    @ViewChild('avatar') fileInput: ElementRef;

    constructor(
        private fb: FormBuilder,
        private authService: AuthenticationService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
        this.activatedRoute.params.subscribe(params => {
            this.class_id = params['id'];
            this.authService.getClass(this.class_id).then((res: any) => {
                const result = JSON.parse(res);
                this.data = result.data;
                this.class_pic = '/img/classes/'+this.data.picture;
                console.log(this.class_id);
                console.log(this.data);
            });
        });

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

    editClass() {
        const formModel = this.new_class_form.value;
        if (this.new_class_form.valid) {
            console.log(formModel);
            this.authService.editClass(formModel, this.class_pic, this.class_id).then((res) => {
                console.log(res);
                const result = JSON.parse(res);
                if(result.status) {
                    this.router.navigate(['/teacher-classes'])
                }
            });
        }

    }

    ngOnInit() {
        this.iniForm();
    }
}