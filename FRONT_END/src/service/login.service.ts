/**
 * Created by Johann Durand on 13/04/2017.
 */
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {

  private URL_CONNECT = '/connection';
  private URL_GOOGLE = 'http://localhost:8080/ServerREST/myWebService/Google';
  private URL_DROPBOX = 'http://localhost:8080/ServerREST/myWebService/DropBox';


  constructor (private http: Http){ }

  connectToDrive(drive : string): Observable<string>{
    let connectionUrl : string;

    if(drive.toString() == "google"){
      connectionUrl = this.URL_GOOGLE
    }
    else if(drive.toString() == "dropbox"){
      connectionUrl = this.URL_DROPBOX
    }
    return this.http.get(connectionUrl+this.URL_CONNECT)
      .map(this.getUrl)
      .catch(this.handleError);
  }


  private getUrl(res: Response){
    let body = res.json();
    window.location.href = body.url;
    return body.url || { };
  }

  private extractData(res: Response) {
    let body = res.json();
    console.log("body"+body);
    return body.data || { };
  }

  private handleError (error: Response | any) {
    console.log("aie");
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;

    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}

