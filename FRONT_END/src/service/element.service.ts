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

  private URL_GOOGLE = 'http://localhost:8080/ServerREST/myWebService/Google';
  private URL_DROPBOX = 'http://localhost:8080/ServerREST/myWebService/DropBox';

  private URL_GETELEMENTSGOOGLE = '/getFiles';
  private URL_GETELEMENTSDROPBOX = '/getFiles';
  private URL_GETSTORAGE = '/getStorage';

  private URL_CREATEELEMENT = '/createFiles';
  private URL_DELETEELEMENT = '/delete';
  private URL_COPYELEMENT ='/copy';
  private URL_RENAMEELEMENT = "/rename"


  constructor (private http: Http){ }



  getElementsDropbox(id : string){
    /*let params: URLSearchParams = new URLSearchParams();
    params.set('path', "");*/

    let path : string;
    if(id == "root")
      path = "?path="
    else
      path = "?path="+id

    return  this.http.get(this.URL_DROPBOX+this.URL_GETELEMENTSDROPBOX+path)
      .map(this.extractsElementsDropbox)
      .catch(this.handleError);
  }

  /*
   * returns elementsGoogle of root
   */
  getElementsGoogle(): Observable<Element[]> {

    return this.http.get(this.URL_GOOGLE+this.URL_GETELEMENTSGOOGLE)
      .map(this.extractsElementsGoogle)
      .catch(this.handleError);
  }

  getStorageGoogle(): Observable<string[]> {
    return this.http.get(this.URL_GOOGLE+this.URL_GETSTORAGE)
      .map(this.extractElement)
      .catch(this.handleError);
  }


  renameElementDropbox(path: string,newpath: string){
    console.log(this.URL_GOOGLE+this.URL_RENAMEELEMENT+"?input_path=" + path +"&new_path="+ newpath);
    return this.http.get(this.URL_DROPBOX+this.URL_RENAMEELEMENT+"?input_path=" + path +"&new_path="+ newpath)
      .map(this.extractElement)
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

    return this.http.post(this.URL_GOOGLE+this.URL_CREATEELEMENT, { search : params })
      .map(this.extractElement)
      .catch(this.handleError);
  }

  createFileDropbox(path : string){
    //GET
    /*let params: URLSearchParams = new URLSearchParams();
    params.set('path', path);*/

    console.log("CREATE SERVICE DROPBOX -- ENVOI DE LA REQUETE")
    return this.http.get(this.URL_DROPBOX+this.URL_CREATEELEMENT+"?path="+path)
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

    return this.http.post(this.URL_GOOGLE+this.URL_COPYELEMENT, { search : params })
      .map(this.extractElement)
      .catch(this.handleError);
  }

  /*
   * Sends id of the file to delete
   */
  deleteElement(elementId : string){
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.URL_GOOGLE+this.URL_DELETEELEMENT, JSON.stringify({id : elementId}), options)
      .map(this.extractElement)
      .catch(this.handleError);
  }
  /*-- Methods to use in http get or post requests--*/

  /*
   * Method to use with .map to get data from JSON response
   */
  private extractsElementsGoogle(res: Response) {
    let body = res.json();
    let elements : Element[] = [];
    for(let i = 0; i<body.items.length; i++){

      let tmpElement = body.items[i];
      let tmpParents = tmpElement.parents;

      let tmpParent : {id : string, isRoot : boolean} = {id : "", isRoot : false};

      if(tmpParents.length>=1) {
        tmpParent.id = tmpParents[0].id;
        tmpParent.isRoot = tmpParents[0].isRoot
      }
      else{
        tmpParent.id = "undefined";
      }


      if(tmpElement.mimeType == "application/vnd.google-apps.folder"){
        let tmpFolder: Element = {keys: {google : tmpElement.id, dropbox : undefined},name: tmpElement.title,isFolder : true, taille: tmpElement.fileSize,sharedList: [], parent : tmpParent,drives: ["google"]};
        elements.push(<Element>tmpFolder);
      }
      else{
        let tmpFile: Element = {keys: {google : tmpElement.id, dropbox : undefined},name: tmpElement.title,isFolder : false, taille: tmpElement.fileSize,sharedList: [], parent : tmpParent,drives: ["google"]};
        elements.push(<Element>tmpFile);
      }
    }
    return elements || { };
  }

  private extractsElementsDropbox(res: Response) {
    let body = res.json();
    let elements : Element[] = [];
    for(let i = 0; i<body.entries.length; i++){

      let tmpElement = body.entries[i];

      let tmpParent : {id : string, isRoot : boolean} = {id : "", isRoot : false};

      if(tmpElement[".tag"] == "folder"){
        //console.log(body.items[i].title);
        let tmpFolder: Element = {keys : {google : undefined, dropbox :tmpElement.path_display},name: tmpElement.name,isFolder : true, taille: "1",sharedList: [], parent : tmpParent,drives: ["dropbox"]};
        elements.push(<Element>tmpFolder);
        console.log("DROPBOX : "+tmpElement.path_display)
      }
      else{
        let tmpFile: Element = {keys : {google : undefined, dropbox :tmpElement.path_display},name: tmpElement.name,isFolder : false, taille: "1",sharedList: [], parent : tmpParent,drives: ["dropbox"]};
        elements.push(<Element>tmpFile);
      }
    }
    return elements || { };
  }
  /*
   * Method to use with .map to get data from JSON response
   */
  private extractElement(res: Response) {
    let body = res.json();
    console.log("yo" + body);
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
