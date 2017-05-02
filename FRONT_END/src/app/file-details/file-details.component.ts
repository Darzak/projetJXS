import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {File} from '../../model/file';
import {FileService} from "../../service/file.service";
import {FolderService} from "../../service/folder.service";
import {Element} from "../../model/element";
import {Folder} from '../../model/folder';


@Component({
  selector: 'file-details',
  templateUrl: './file-details.component.html',
  styleUrls: ['./file-details.component.css'],
  providers: [FileService, FolderService]
})
export class FileDetailsComponent implements OnInit {
  shareOpen: boolean = false;
  newShare: string = '';
  @Input() element: Element;
  @Output() notify: EventEmitter<Element> = new EventEmitter<Element>();
  @Output() remove: EventEmitter<Element> = new EventEmitter<Element>();

  constructor(private fileService: FileService, private folderService: FolderService) {
  }

  ngOnInit() {
  }

  openShare() {
    this.shareOpen = !this.shareOpen;
  }

  addShare() {
    if (this.element.isFolder) {
      let folder = <Folder> this.element;
      this.folderService.addShare(folder, this.newShare);
    } else {
      this.fileService.addShare(<File> this.element, this.newShare);
    }
    this.newShare = '';
  }


  copyFile() {
    this.notify.emit(this.element);
  }

  /* ----- FINAL -----*/

  /*
   * Sends an even to files.component with the id of the file to delete
   */
  deleteFile() {
    /*if(this.element.isFolder){
     let folder = <Folder> this.element;
     this.folderService.deleteFolder(folder);
     }else{
     this.fileService.deleteFile(<File> this.element/*,undefined);
     }*/
    this.remove.emit(this.element);
  }

}
