import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {
    public token: string;

    constructor(private http: Http) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
    }

    login(data: any): Promise<any> {
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('/api/auth/login', JSON.stringify(data), {headers: headers})
            .toPromise()
            .then(res => {
                // res.json().data;
                // console.log(res);
                // console.log(data);
                let token = res.json() && res.json().token;
                // console.log(token);
                if (token) {
                    // set token property
                    this.token = token;

                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify({ username: data.email, token: token }));

                    // return true to indicate successful login
                    return true;
                } else {
                    // return false to indicate failed login
                    return false;
                }
            });
    }

    register(data: any): Promise<any> {
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('/api/auth/register', JSON.stringify(data), {headers: headers})
            .toPromise()
            .then(res => {
                console.log(res);
                console.log(res.json().data);
                let token = res.json() && res.json().token;
                console.log(token);
                if (token) {
                    // set token property
                    this.token = token;

                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify({ username: data.email, token: token }));

                    // return true to indicate successful login
                    return true;
                } else {
                    // return false to indicate failed login
                    return false;
                }
            });
    }

    logout(): void {
        this.token = null;
        localStorage.removeItem('currentUser');
    }

    getUser(): Promise<any> {
        const headers = new Headers();
        headers.set('Content-Type', 'application/json');
        headers.set('token', this.token);

        return this.http.get('/api/user', { search: { token: this.token } }).toPromise().then(
            res => {
                console.log(res.json().result);
                return res.json().result;
            }
        );
    }
}