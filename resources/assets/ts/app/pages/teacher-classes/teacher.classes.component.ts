import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/toPromise';

import { AuthenticationService } from "../../services/authentication.service";

@Component({
    selector: 'teacher-classes-app',
    template: require('./teacher.classes.component.html'),
    styles: [`${require('./teacher.classes.component.scss')}`]
})
export class TeacherClasseseComponent implements OnInit {
    user: any = {};
    data: any;

    constructor(
        private authService: AuthenticationService
    ) {
        const user_infos = this.authService.getUser().then((res: any) => {
            this.user = res.user;
            this.getClasses();
        });
    }

    getClasses() {
        this.authService.getClasses(this.user.id).then((r) => {
           // console.log(r);
           const res = JSON.parse(r);
           this.data = res.data;
           // console.log(this.data);
        });
    }

    ngOnInit() { }
}