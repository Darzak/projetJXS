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

  private connectionUrl = 'http://localhost:8080/ServerREST/myWebService/Google/connection';

  constructor (private http: Http){ }

  connectToDrive(): Observable<string>{
    return this.http.get(this.connectionUrl)
      .map(this.getUrl)
      .catch(this.handleError)
      ;
  }
  setCode(code:string){
    console.log(this.connectionUrl + "/getCode?code="+code)
    let res = this.http.get(this.connectionUrl + "/getCode?code="+code)
      .map(this.extractData)
      .catch(this.handleError);
    //console.log(res);
  }

  private getUrl(res: Response){
    let body = res.json();
    window.location.href = body.url;
    return body.url || { };
  }

  private extractData(res: Response) {
    let body = res.json();
    return body.data || { };
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

    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}

