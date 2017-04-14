/**
 * Created by Johann Durand on 13/04/2017.
 */
import { Injectable } from '@angular/core';

import { Folder } from '../model/folder';
import { folders } from '../app/mock-folders';

@Injectable()
export class FolderService {
  getFolders() : Folder[] {
    return folders;
  }

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

  getFolder(name : string) : Folder {
    for(let f of folders){
        if(f.name == name){
          return f;
        }
    }
  }

}
