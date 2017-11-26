import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthenticationService {
    public token: string;
    public user: any;

    constructor(private http: Http) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
    }

    login(data: any): Promise<any> {
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('/api/auth/login', JSON.stringify(data), {headers: headers})
            .toPromise()
            .then(res => {
                let token = res.json() && res.json().token;
                if (token) {
                    this.token = token;
                    localStorage.setItem('currentUser', JSON.stringify({ username: data.email, token: token }));
                    // return true;
                    return res;
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
                    return res.json().data;
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
                return res.json().result;
            }
        );
    }

    getUserInfo(user_id: any): Promise<any> {
        const headers = new Headers();
        headers.set('Content-Type', 'application/json');
        headers.set('token', this.token);
        return this.http.get('/api/user/get/profile/data/', {
            search:
            {
                id: user_id,
                token: this.token
            }
        }).toPromise().then(
            res => {
                console.log(res.json());
                return res.json();
            }
        );
    }

    updateUserInfo(data: any): Promise<any> {
        const headers = new Headers({'Content-Type': 'application/json'});
        headers.set('token', this.token);
        return this.http.post('/api/user/update/profile/data', JSON.stringify(data), {headers: headers})
            .toPromise()
            .then(res => {
                console.log(res);
                console.log(res.json().data);
            });
    }

    updateUserPic(file: any, id: any): Promise<any> {
        const headers = new Headers({'Content-Type': 'application/json'});
        headers.set('token', this.token);
        const data = {
            'avatar': file,
            'user_id': id,
            'token': this.token
        };

        return this.http.post('/api/user/update/update/avatar', JSON.stringify(data), {headers: headers})
            .toPromise()
            .then(res => {
                return res;
            });
    }
}
