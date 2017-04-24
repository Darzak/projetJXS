/**
 * Created by Johann Durand on 13/04/2017.
 */
import { Injectable } from '@angular/core';

import { Folder } from '../model/folder';
import { folders } from '../app/mock-folders';
import {Observable} from "rxjs";

@Injectable()
export class FolderService {


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

  /*getFolders() : Folder[] {
    return folders;
  }*/

  getFolders(): Observable<Folder[]> {
    /*return this.http.get(this.connectionUrl)
     .map(this.extractFiles)
     .catch(this.handleError);*/

    return Observable.of(folders);
  }

}
