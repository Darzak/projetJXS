import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions, Response} from "@angular/http";
import {Observable} from "rxjs";
import {Element} from "../model/element"

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map'

/**
 * Created by polivier on 01/05/17.
 */

@Injectable()
export class ElementService{

  private url = 'http://localhost:8080/ServerREST/myWebService/Google/file';
  private URL_GETELEMENTS = '/getFolder';
  private URL_CREATEELEMENT = '/create';
  private URL_DELETEELEMENT = '/delete';

  constructor (private http: Http){ }


  /*
   * returns elements of root
   */
  getElements(id: string): Observable<Element[]> {

    let params: URLSearchParams = new URLSearchParams();
    params.set('id', id);

    return this.http.get(this.url+this.URL_GETELEMENTS, { search : params })
      .map(this.extractElements)
      .catch(this.handleError);

  }


  /*
   * Sends http post request with the name of the file to create and the id of it's parent
   */
  createElement(userCode : string, dirId : string , elementName: string, elementType : string): Observable<Element> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.url+this.URL_CREATEELEMENT, JSON.stringify({code : userCode, id : dirId, name : elementName, type : elementType}), options)
      .map(this.extractElement)
      .catch(this.handleError);
  }

  /*
   * Sends id of the file to delete
   */
  deleteElement(userCode : string, elementId : string){
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.url+this.URL_DELETEELEMENT, JSON.stringify({code : userCode, id : elementId}), options)
      .map(this.extractElement)
      .catch(this.handleError);
  }
  /*-- Methods to use in http get or post requests--*/

  /*
   * Method to use with .map to get data from JSON response
   */
  private extractElements(res: Response) {
    let body = res.json();
    return body.items || { };
  }

  /*
   * Method to use with .map to get data from JSON response
   */
  private extractElement(res: Response) {
    let body = res.json();
    return body || { };
  }



  /*
   * Methods to use with .catch to handle any error
   */
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
