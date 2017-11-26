import { Component } from '@angular/core';

import { AuthenticationService } from "../../services/authentication.service";

@Component({
    selector: 'homepage-app',
    template: require('./homepage.component.html'),
    styles: [`${require('./homepage.component.scss')}`]
})
export class HomepageComponent {

    constructor() { }
}