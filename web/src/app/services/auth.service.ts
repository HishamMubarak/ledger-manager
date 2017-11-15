import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { JwtHelper, tokenNotExpired } from 'angular2-jwt';

import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { Router } from "@angular/router";

@Injectable()
export class AuthService {

  private loggedIn = false;
  url = environment.backednUrl;
  constructor(private http: Http, private router: Router) { }

  signUp(firstName, lastName, email, password) {
    
    let headers = new Headers();
    headers.append('Content-type', 'application/json');

    return this.http
    .post(
      this.url + '/signup',
      JSON.stringify({ firstName, lastName, email, password }),
      { headers }
    )
    .map(response => response.json());
  }

  login(email, password) {

    let headers = new Headers();
    headers.append('Content-type', 'application/json');

    return this.http
    .post(
      this.url + '/login',
      JSON.stringify({email, password}),
      { headers }
    )
    .map(response => response.json());
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  isLoggedIn() {
    return tokenNotExpired();
  }

  get currentUser() {
    let token = localStorage.getItem('token');
    if (!token) return null;

    return new JwtHelper().decodeToken(token);
    
  }

}
