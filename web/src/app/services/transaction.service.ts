import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';

@Injectable()
export class TransactionService {
  
  url = environment.backednUrl;

  constructor(private http: Http) { }

  getTransactions(userId, bookId, accountId) {
    let headers = new Headers();
    headers.append('Content-type', 'application/json');

    return this.http
    .post(
      this.url + '/gettransactions',
      JSON.stringify({ userId, bookId, accountId }),
      { headers }
    )
    .map(response => response.json())
    .catch((error:any) => Observable.throw(error.json().error || 'Server Error'));
  }

  addTransaction(userId, bookId, accountId, formData) {
    let headers = new Headers();
    headers.append('Content-type', 'application/json');

    return this.http
    .post(
      this.url + '/addtransaction',
      JSON.stringify({ userId, bookId, accountId, formData }),
      { headers }
    )
    .map(response => response.json())
    .catch((error:any) => Observable.throw(error.json().error || 'Server Error'));
  }

  editTransaction(userId, bookId, accountId, formData) {
    let headers = new Headers();
    headers.append('Content-type','application/json');

    return this.http
    .post(
      this.url + '/edittransaction',
      JSON.stringify({userId, bookId, accountId, formData}),
      { headers }
    )
    .map(response => response.json())
    .catch((error:any) => Observable.throw(error.json().error || 'Server Error Editing'));
  }

  deleteTransaction(userId, bookId, accountId, transId) {
    let headers = new Headers();
    headers.append('Content-type', 'application/json');

    return this.http
    .post(
      this.url + '/deletetransaction',
      JSON.stringify({ userId, bookId, accountId, transId }),
      { headers }
    )
    .map(response => response.json())
    .catch((error:any) => Observable.throw(error.json().error || 'Server Error'));
  }
  
}
