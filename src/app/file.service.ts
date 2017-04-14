/**
 * Created by Johann Durand on 13/04/2017.
 */
import { Injectable } from '@angular/core';

import { File } from './file';
import { Folder } from './folder';
import { files } from './mock-files';

@Injectable()
export class FileService {
  getFiles() : File[] {
    return files;
  }

  deleteFile(file: File, folder : Folder) : void {
    if(!folder){
      files.splice(files.indexOf(file),1);
    }else{
      folder.files.splice((folder.files.indexOf(file),1));
    }
  }

  addFile(file: File, folder : Folder) : void {
    if(!folder){
      files.push(file);
    }else{
      folder.files.push(file);
    }
  }

}
