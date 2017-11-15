import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';

@Injectable()
export class AccountService {

  url = environment.backednUrl;

  constructor(private http: Http) { }

  getAllAccounts(userId, bookId) {
    let headers = new Headers();
    headers.append('Content-type', 'application/json');

    return this.http
    .post(
      this.url + '/fetchallaccounts',
      JSON.stringify({ userId, bookId }),
      { headers }
    )
    .map(response => response.json())
    .catch((error:any) => Observable.throw(error.json().error) || 'Server Error');
  }


  createNewAccount(userId, bookId, accountName) {
    let headers = new Headers();
    headers.append('Content-type', 'application/json');

    return this.http
    .post(
      this.url + '/createnewaccount',
      JSON.stringify({ userId, bookId, accountName }),
      { headers }
    )
    .map(response => response.json())
    .catch((error:any) => Observable.throw(error.json().error || 'Server Error'));
  }

  editAccount(userId, bookId, editAccountId, formData) {
    let headers = new Headers();
    headers.append('Content-type', 'application/json');

    return this.http
    .post(
      this.url + '/editaccount',
      JSON.stringify({ userId, bookId, editAccountId, formData }),
      { headers }
    )
    .map(response => response.json())
    .catch((error:any) => Observable.throw(error.json().error || 'Server Error'));
  }

    deleteAccount(userId, bookId, deleteAccountId) {
    let headers = new Headers();
    headers.append('Content-type', 'application/json');

    return this.http
    .post(
      this.url + '/deleteaccount',
      JSON.stringify({ userId, bookId, deleteAccountId }),
      { headers }
    )
    .map(response => response.json())
    .catch((error:any) => Observable.throw(error.json().error || 'Server Error'));
  }


}
