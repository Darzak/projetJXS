import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {File} from '../../model/file';
import {FileService} from "../../service/file.service";
import {FolderService} from "../../service/folder.service";
import {ElementDetailsService} from "../../service/element-details.service";
import {Element} from "../../model/element";
import {Folder} from '../../model/folder';


@Component({
  selector: 'file-details',
  templateUrl: './file-details.component.html',
  styleUrls: ['./file-details.component.css'],
  providers: [FileService, FolderService, ElementDetailsService]
})
export class FileDetailsComponent implements OnInit {
  name: string;
  errorMessage: any;
  newShare: string = '';
  link: string = "";
  @Input() element: Element;
  @Input() paths: string[];
  @Output() notify: EventEmitter<Element> = new EventEmitter<Element>();
  @Output() remove: EventEmitter<Element> = new EventEmitter<Element>();

  constructor(private fileService: FileService, private folderService: FolderService, private elementDetailsService: ElementDetailsService) {
  }

  ngOnInit() {
    this.name=this.element.name;
  }

  getPath(){
    let res:string = "/";
    for(let p of this.paths){
      if(p!="root"){
        res+=p+"/";
      }
    }
    return res;
  }

  validName(){
    let path = this.getPath();
    if (this.element.drives.indexOf("google")!=-1){
      //this.elementService.renameElementGoogle(this.element.name);
    }
    if (this.element.drives.indexOf("dropbox")!=-1){
      this.elementDetailsService.renameElementDropbox(path+this.name,path+this.element.name).subscribe(
        element => alert("Fichier renommé avec succés"),
        error => this.errorMessage = <any>error)
    }
  }

  getImageSource(): string[]{
    let imagesSource: string[] = [];
    if (this.element.drives.indexOf("google")!=-1){
      imagesSource.push("src/app/image/google_drive_icon.jpg");
    }
    if (this.element.drives.indexOf("dropbox")!=-1){
      imagesSource.push("src/app/image/dropbox_icon.png");
    }
    return imagesSource;
  }

  share() {
    let path = this.getPath();
    this.elementDetailsService.shareDropbox(path+this.name).subscribe(
      element => {this.link=element; alert("Fichier partagé avec succés")},
      error => this.errorMessage = <any>error)
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

   /*this.elementDetailsService.download(this.element.keys.dropbox).subscribe(
        element => alert("ça download 1"+element),
         error => this.errorMessage = <any>error);*/
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
