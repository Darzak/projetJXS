import {Injectable} from "@angular/core";
import { Http, Response} from "@angular/http";
import {Observable} from "rxjs";
import {Element} from "../model/element"

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map'
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

  private URL_CREATEELEMENTFILE = '/createFiles';
  private URL_CREATEELEMENTFOLDER = '/createFolder';
  private URL_DELETEELEMENT = '/delete';
  private URL_COPYELEMENT ='/paste';



  constructor (private http: Http){ }

  getElementsDropbox(id : string){
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

  /*
   * Sends http post request with the name of the file to create and the id of it's parent
   */
  createElement(dirId : string , elementName: string, elementType : string): Observable<Element> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('id', dirId);
    params.set('name', elementName);
    params.set('mimeType', elementType);

    return this.http.post(this.URL_GOOGLE+this.URL_CREATEELEMENTFILE, { search : params })
      .map(this.extractElement)
      .catch(this.handleError);
  }

  createFileGoogle(path : string, id: string){
    return this.http.get(this.URL_GOOGLE+this.URL_CREATEELEMENTFILE+"?title="+path+"&idFolder="+id)
      .map(this.extractCreateGoogle)
      .catch(this.handleError);
  }

  createFileDropbox(path : string){
    return this.http.get(this.URL_DROPBOX+this.URL_CREATEELEMENTFILE+"?path="+path)
      .map(this.extractElement)
      .catch(this.handleError);
  }

  createFolderDropbox(path : string){
    return this.http.get(this.URL_DROPBOX+this.URL_CREATEELEMENTFOLDER+"?path="+path)
      .map(this.extractElement)
      .catch(this.handleError);
  }

  /*
   * Sends http post request with the name of the file to create and the id of it's parent
   */
  copyElementGoogle(path : string, newpath: string){
    return this.http.get(this.URL_GOOGLE+this.URL_COPYELEMENT+"?input_path=" + path +"&new_path="+ newpath)
      .map(this.extractElement)
      .catch(this.handleError);
  }

  copyElementDropbox(path : string,newpath: string ){
    return this.http.get(this.URL_DROPBOX+this.URL_COPYELEMENT+"?input_path=" + path +"&new_path="+ newpath)
      .map(this.extractElement)
      .catch(this.handleError);
  }

  /*
   * Sends id of the file to delete
   */
  deleteElementDropbox(path : string){
    return this.http.get(this.URL_DROPBOX+this.URL_DELETEELEMENT+"?path="+path)
      .map(this.extractElement)
      .catch(this.handleError);
  }

  deleteElementGoogle(id: string){
    return this.http.get(this.URL_GOOGLE+this.URL_DELETEELEMENT+"?id="+id)
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
    for(let i = 0; i<body.length; i++){

      let tmpElement = body[i];
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
        let tmpFolder: Element = {keys: {google : tmpElement.id, dropbox : ""},name: tmpElement.title,isFolder : true, taille: tmpElement.fileSize,sharedList: [], parent : tmpParent,drives: ["google"]};
        elements.push(<Element>tmpFolder);
      }
      else{
        let tmpFile: Element = {keys: {google : tmpElement.id, dropbox : ""},name: tmpElement.title,isFolder : false, taille: tmpElement.fileSize,sharedList: [], parent : tmpParent,drives: ["google"]};
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
        let tmpFolder: Element = {keys : {google : "", dropbox :tmpElement.path_display},name: tmpElement.name,isFolder : true, taille: tmpElement.size,sharedList: [], parent : tmpParent,drives: ["dropbox"]};
        elements.push(<Element>tmpFolder);
      }
      else{
        let tmpFile: Element = {keys : {google : "", dropbox :tmpElement.path_display},name: tmpElement.name,isFolder : false, taille: tmpElement.size,sharedList: [], parent : tmpParent,drives: ["dropbox"]};
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
    return body || { };
  }


  private extractCreateGoogle(res: Response) {
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
