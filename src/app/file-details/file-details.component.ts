import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { File } from '../../model/file';
import { FileService } from "../../service/file.service";
import { FolderService} from "../../service/folder.service";
import { Element } from "../element";
import { Folder } from '../../model/folder';


@Component({
  selector: 'file-details',
  templateUrl: './file-details.component.html',
  styleUrls: ['./file-details.component.css'],
  providers: [FileService, FolderService]
})
export class FileDetailsComponent implements OnInit {
  @Input() element:Element;
  @Output() notify: EventEmitter<Element> = new EventEmitter<Element>();
  @Output() remove: EventEmitter<any> = new EventEmitter<any>();
  constructor(private fileService : FileService, private folderService : FolderService) {
  }

  ngOnInit() {
  }

  deleteFile(){
    if(this.element.isFolder){
      let folder = <Folder> this.element;
      /*for(let f of folder.files){
        this.fileService.deleteFile(f,folder);
      }*/
      this.folderService.deleteFolder(folder);
    }else{
      this.fileService.deleteFile(<File> this.element/*,undefined*/);
    }
    this.remove.emit(null);
  }
  copyFile(){
    this.notify.emit(this.element);
  }
}