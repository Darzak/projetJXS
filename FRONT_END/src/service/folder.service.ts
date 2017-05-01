/**
 * Created by Johann Durand on 13/04/2017.
 */
import { Injectable } from '@angular/core';

import { Folder } from '../model/folder';
import { folders } from '../app/mock-folders';
import {Observable} from "rxjs";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {Headers, Http, RequestOptions, Response} from "@angular/http";

@Injectable()
export class FolderService {

  private url = 'http://localhost:8080/ServerREST/myWebService/Google/folder';
  private URL_GETFOLDERS = '/getFolder';
  private URL_CREATEFOLDER = '/create';


  constructor (private http: Http){ }


  deleteFolder(folder: Folder) : void {
    folders.splice(folders.indexOf(folder),1);
  }

  addFolder(folder: Folder, folderParent : Folder) : void {
    if(!folderParent){
      folders.push(folder);
    }else{
      folderParent.files.push(folder);
    }
  }

  addShare(folder: Folder, share: string){
    folder.sharedList.push(share);
  }

  getFolder(name : string) : Folder {
    for(let f of folders){
        if(f.name == name){
          return f;
        }
    }
  }


  /*
   * Sends http post request with the name of the file to create
   */
  create(dirName : string , fileName: string): Observable<Folder> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.url+this.URL_CREATEFOLDER, { dirName , fileName }, options)
      .map(this.extractFolders)
      .catch(this.handleError);
  }


  /*
   * returns folders of specified folder
   */
  getFolders(folder: Folder): Observable<Folder[]> {

    /*let params: URLSearchParams = new URLSearchParams();
    params.set('foldername', folder.name);

    return this.http.get(this.url+this.URL_GETFOLDERS , { search : params })
     .map(this.extractFolders)
     .catch(this.handleError);

     */
    let dir: Folder[] = [];
    for(let f of folder.files){
      if(f.isFolder){
        dir.push(<Folder> f);
      }
    }
    return Observable.of(dir);
  }


  /*
   * returns folders of root
   */
  getRoot(): Observable<Folder[]> {

    /*return this.http.get(this.url+"/getRoot")
      .map(this.extractFolders)
      .catch(this.handleError);
      */

    return Observable.of(folders);
  }

  /*-- Methods to use in http get or post requests--*/

  /*
   * Method to use with .map
   */
  private extractFolders(res: Response) {
    let body = res.json();
    return body.data || { };
  }

  /*
   * Methods to use with .catch
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
