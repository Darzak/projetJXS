import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions, Response} from "@angular/http";
import {Observable} from "rxjs";
import {Element} from "../model/element"

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map'
import {Folder} from "../model/folder";
import {File} from "../model/file";
import {observable} from "rxjs/symbol/observable";

/**
 * Created by polivier on 01/05/17.
 */

@Injectable()
export class ElementService{

  private url = 'http://localhost:8080/ServerREST/myWebService/Google/file';
  private URL_GETELEMENTS = '/getFolder';
  private URL_CREATEELEMENT = '/create';
  private URL_DELETEELEMENT = '/delete';
  private URL_COPYELEMENT ='/copy';


  constructor (private http: Http){ }

  /*
   * returns elements of root
   */
  getElements(id: string): Observable<Element[]> {

    let params: URLSearchParams = new URLSearchParams();
    params.set('id', id);
    console.log("getElements");
    return this.http.get(this.url+this.URL_GETELEMENTS + "?id=" + id)
      .map(this.extractElements)
      .catch(this.handleError);
  }


  /*
   * Sends http post request with the name of the file to create and the id of it's parent
   */
  createElement(dirId : string , elementName: string, elementType : string): Observable<Element> {
    //POST
    /*let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });*/

    //GET
    let params: URLSearchParams = new URLSearchParams();
    params.set('id', dirId);
    params.set('name', elementName);
    params.set('mimeType', elementType);

    return this.http.post(this.url+this.URL_CREATEELEMENT, { search : params })
      .map(this.extractElement)
      .catch(this.handleError);
  }

  /*
   * Sends http post request with the name of the file to create and the id of it's parent
   */
  copyElement(dirId : string ): Observable<Element> {
    //POST
    /*let headers = new Headers({ 'Content-Type': 'application/json' });
     let options = new RequestOptions({ headers: headers });*/

    //GET
    let params: URLSearchParams = new URLSearchParams();
    params.set('id', dirId);

    return this.http.post(this.url+this.URL_COPYELEMENT, { search : params })
      .map(this.extractElement)
      .catch(this.handleError);
  }

  /*
   * Sends id of the file to delete
   */
  deleteElement(elementId : string){
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.url+this.URL_DELETEELEMENT, JSON.stringify({id : elementId}), options)
      .map(this.extractElement)
      .catch(this.handleError);
  }
  /*-- Methods to use in http get or post requests--*/

  /*
   * Method to use with .map to get data from JSON response
   */
  private extractElements(res: Response) {
    let body = res.json();
    console.log(body.items);
    let elements : Element[] = [];
    for(let i = 0; i<body.items.length; i++){

      if(body.items[i].mimeType == "application/vnd.google-apps.folder"){
        //console.log(body.items[i].title);
        let tmpElement = body.items[i];
        let tmpFolder: Element = {key: tmpElement.id,name: tmpElement.title,isFolder : true, taille: "1",sharedList: [], parent : tmpElement.parents};
        console.log("id " + tmpElement.id + " par " + tmpElement.parents);
        elements.push(<Element>tmpFolder);
      }
      else{
        let tmpElement = body.items[i];
        let tmpFile: Element = {key: tmpElement.id,name: tmpElement.title,isFolder : false, taille: "1",sharedList: [], parent : tmpElement.parents};
        //console.log(tmpFile);
        elements.push(<Element>tmpFile);
      }
    }
    console.log("tab"+elements.length);
    return elements || { };
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
