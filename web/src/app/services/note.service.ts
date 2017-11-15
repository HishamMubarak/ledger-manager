import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';

@Injectable()
export class NoteService {

  url = environment.backednUrl;
  
  constructor(
    private http: Http) { }

  addNewNote(userId, bookId, accountId, formData) {
    let headers = new Headers();
    headers.append('Content-type', 'application/json');

    return this.http
    .post(
      this.url + '/addnote',
      JSON.stringify({ userId, bookId, accountId, formData}),
      { headers }
    )
    .map(response => response.json())
    .catch((error:any) => Observable.throw(error.json().error || 'Server Error'));
  }

  getAllNotes(userId, bookId, accountId, activeFlag) {
    let headers = new Headers();
    headers.append('Content-type', 'application/json');

    return this.http
    .post(
      this.url + '/fetchallnotes',
      JSON.stringify({ userId, bookId, accountId, activeFlag }),
      { headers }
    )
    .map(response => response.json())
    .catch((error:any) => Observable.throw(error.json().error || 'Server Error'));
  }

  editNote(userId, bookId, accountId, formData) {
    let headers = new Headers();
    headers.append('Content-type', 'application/json');

    return this.http
    .post(
      this.url + '/editnote',
      JSON.stringify({userId, bookId, accountId, formData}),
      { headers }
    )
    .map(response => response.json())
    .catch((error:any) => Observable.throw(error.json().error || 'Server Error'));
  }

  deleteNote(userId, bookId, accountId, noteId) {
    let headers = new Headers();
    headers.append('Content-type','application/json');

    return this.http
    .post(
      this.url + '/deletenote',
      JSON.stringify({ userId, bookId, accountId, noteId }),
      { headers }
    )
    .map(response => response.json())
    .catch((error:any) => Observable.throw(error.json().error || 'Server Error'));
  }

}
