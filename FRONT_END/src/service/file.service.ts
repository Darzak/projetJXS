/**
 * Created by Johann Durand on 13/04/2017.
 */
import { Injectable } from '@angular/core';
import {Headers, Http, RequestOptions, Response} from "@angular/http"

import { File } from '../model/file';
import { Folder } from '../model/folder';
import { files } from '../app/mock-files';
import {Observable} from "rxjs";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class FileService {

  private url = 'http://localhost:8080/ServerREST/myWebService/Google/file';

  constructor (private http: Http){ }

  /*getFiles() : File[] {
    return files;
  }*/

  deleteFile(file: File/*, folder : Folder*/) : void {
      files.splice(files.indexOf(file),1);
  }

  addFile(file: File, folder : Folder) : void {
    if(!folder){
      files.push(file);
    }else{
      folder.files.push(file);
    }
  }

  addShare(file: File, share: string){
    file.sharedList.push(share);
  }


  // files du dossier folder
  getFiles(folder: Folder): Observable<File[]> {
    /*return this.http.get(this.url+"/getFolder")
      .map(this.extractFiles)
      .catch(this.handleError);*/
    let dir: File[] = [];
    for(let f of folder.files){
      if(!f.isFolder){
        dir.push(<File> f);
      }
    }
    return Observable.of(dir);
  }

  // files de root
  getRoot(): Observable<File[]> {
    /*console.log(this.url+"/getRoot");
    return this.http.get(this.url+"/getRoot")
     .map(this.extractFiles)
     .catch(this.handleError);*/
    return Observable.of(files);
  }

  delete(name: string): Observable<File> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.url+"delete", { name }, options)
      .map(this.extractData)
      .catch(this.handleError);
  }



  create(name: string): Observable<File> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.url+"create", { name }, options)
      .map(this.extractData)
      .catch(this.handleError);
  }


  private extractFiles(res: Response) {
    let body = res.json();
    return body.data || { };
  }

  private extractFolders(res: Response) {
    let body = res.json();
    return body.data || { };
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
    console.log(errMsg);
    return Observable.throw(errMsg);
  }



  testRequest() {
    let body = JSON.stringify({ "name":"Louis", "author":"Louis","size":"7","drive":"GOOGLE" });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    this.http.post('http://192.168.43.67:8080/ServerREST/myWebService/files/postFile', body, options)
      .subscribe(data => {
        alert('ok');
      }, error => {
        console.log(JSON.stringify(error.json()));
      });
  }

}
