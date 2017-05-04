import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions, Response} from "@angular/http";
import {Observable} from "rxjs";
import {Element} from "../model/element"

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map'

import {observable} from "rxjs/symbol/observable";


@Injectable()
export class ElementDetailsService {

  private URL_GOOGLE = 'http://localhost:8080/ServerREST/myWebService/Google';
  private URL_DROPBOX = 'http://localhost:8080/ServerREST/myWebService/DropBox';
  private URL_RENAMEELEMENT = "/rename";
  private URL_DOWNLOADELEMENT = "/downloadFiles";
  private URL_SHAREELEMENT = "/shared_link";

  constructor(private http: Http) {
  }

  renameElementDropbox(path: string,newpath: string){
    return this.http.get(this.URL_DROPBOX+this.URL_RENAMEELEMENT+"?input_path=" + path +"&new_path="+ newpath)
      .map(this.extractElement)
      .catch(this.handleError);
  }

  shareDropbox(path: string){
    console.log(this.URL_DROPBOX+this.URL_SHAREELEMENT+"?path=" + path );
    return this.http.get(this.URL_DROPBOX+this.URL_SHAREELEMENT+"?path=" + path)
      .map(this.extractShare)
      .catch(this.handleError);
  }

  download(path: string){
      console.log(this.URL_DROPBOX+this.URL_SHAREELEMENT+"?path=" + path );
      return this.http.get(this.URL_DROPBOX+this.URL_SHAREELEMENT+"?path=" + path)
        .map(this.getUrl)
        .catch(this.handleError);
    }

  private extractElement(res: Response) {
    console.log(res)
    let body = res.json();
    console.log(body)
    return body || { };
  }
  private extractShare(res: Response) {
    let body = res.json();
    console.log(body);
    window.location.href = body.url;
    return body.url || { };
  }
  private getUrl(res: Response){
    console.log(res);
    let body = res.json();
    window.location.href = body.url;
    return body.url || { };
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
