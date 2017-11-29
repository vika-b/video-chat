import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { ActivatedRoute } from "@angular/router";
import { DatePipe } from '@angular/common';

import { AuthenticationService } from "../../services/authentication.service";

@Component({
    selector: 'class-app',
    template: require('./class.component.html'),
    styles: [`${require('./class.component.scss')}`]
})
export class ClassComponent implements OnInit {
    data: any = {
        picture: 'default.png'
    };

    constructor(
        private authService: AuthenticationService,
        private activatedRoute: ActivatedRoute
    ) {
        this.activatedRoute.params.subscribe(params => {
            let id = params['id'];
            this.authService.getClass(id).then((res: any) => {
                const result = JSON.parse(res);
                this.data = result.data;
                console.log(id);
                console.log(this.data);
            });
        });
    }

    ngOnInit() { }
}