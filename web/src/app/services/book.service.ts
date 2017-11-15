import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';

@Injectable()
export class BookService {

  url = environment.backednUrl;

  constructor(
    private http: Http) { }

    createNewBook(userId, newBookName) {
    let headers = new Headers();
    headers.append('Content-type', 'application/json');

    return this.http
    .post(
      this.url + '/createnewbook',
      JSON.stringify({userId, newBookName}),
      { headers }
    )
    .map(response=> response.json())
    .catch((error:any) => Observable.throw(error.json().error || 'Server Error'));
  }


  getAllBooks(userId) {
    let headers = new Headers();
    headers.append('Content-type', 'application/json');

    return this.http
    .post(
      this.url + '/fetchallbooks',
      JSON.stringify({ userId }),
      { headers }
    )
    .map(response => response.json())
    .catch((error:any) => Observable.throw(error.json().error || 'Serer Error'))
  }


  editBook(userId, bookId, editedName) {
    let headers = new Headers();
    headers.append('Content-type', 'application/json');

    return this.http
    .post(
      this.url + '/editbook',
      JSON.stringify({ userId, bookId, editedName }),
      { headers }
    )
    .map(response => response.json())
    .catch((error:any) => Observable.throw(error.json().error || 'Server Error'));
  }


  deleteBook(userId, bookId) {
    let headers = new Headers();
    headers.append('Content-type','application/json');

    return this.http
    .post(
      this.url + '/deletebook',
      JSON.stringify({userId, bookId}),
      { headers }
    )
    .map(response => response.json())
    .catch((error:any) => Observable.throw(error.json().error || 'Server Error'));
  }


}