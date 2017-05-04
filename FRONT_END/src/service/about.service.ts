import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions, Response} from "@angular/http";
import {Observable} from "rxjs";
import {Element} from "../model/element"

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map'

import {observable} from "rxjs/symbol/observable";


@Injectable()
export class AboutService {

  private URL_GOOGLE = 'http://localhost:8080/ServerREST/myWebService/Google';
  private URL_DROPBOX = 'http://localhost:8080/ServerREST/myWebService/DropBox';
  private URL_GETSTORAGE = '/getStorage';

  constructor(private http: Http) {
  }

  getStorageGoogle(): Observable<number[]> {
  return this.http.get(this.URL_GOOGLE+this.URL_GETSTORAGE)
    .map(this.extractElementGoogle)
    .catch(this.handleError);
}

  getStorageDropbox(): Observable<number[]> {
    return this.http.get(this.URL_DROPBOX+this.URL_GETSTORAGE)
      .map(this.extractElementDropbox)
      .catch(this.handleError);
  }

  private extractElementGoogle(res: Response) {
    let body = res.json();
    return [body.quotaBytesUsed,body.quotaBytesTotal] || { };
  }

  private extractElementDropbox(res: Response) {
    let body = res.json();
    return [body.used,body.allocation.allocated] || { };
  }

  private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;

    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.log(errMsg);
    return Observable.throw(errMsg);
  }

}
