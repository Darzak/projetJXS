/**
 * Created by Johann Durand on 13/04/2017.
 */
import { Injectable } from '@angular/core';

import { Folder } from './folder';
import { folders } from './mock-folders';

@Injectable()
export class FolderService {
  getFolder() : Folder[] {
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


}
