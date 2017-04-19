/**
 * Created by Johann Durand on 13/04/2017.
 */
import { Injectable } from '@angular/core';
import {Headers, Http, RequestOptions, Response} from "@angular/http"

import { File } from '../model/file';
import { Folder } from '../model/folder';
import { files } from '../app/mock-files';

@Injectable()
export class FileService {
  http : Http;
  getFiles() : File[] {
    return files;
  }

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
