import {Component, OnInit} from '@angular/core';
import { File } from '../model/file';
import { Folder } from '../model/folder';
import {FileService} from "../service/file.service";
import {FolderService} from "../service/folder.service";
import { Element } from './element';
import { Log } from '../model/log';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [FileService, FolderService]
})

export class AppComponent implements OnInit{

  constructor(private fileService : FileService, private  folderService: FolderService) {
    this.paths.push("root");
    this.concatPath();
  }

  ngOnInit() : void {
    this.getFiles();
    this.getFolders();
    //this.testRequest();
    this.login = false;
  }

  nRightClicks : number = 0;
  drives: [string,string] = ["google", "dropbox"];
  selectedElement: Element;
  files : File[];
  folders : Folder[];
  copiedFile : Element;
  pastedFile : Element;
  paths : string[] = new Array();
  path : string = '';
  login: boolean;
  ids: Log[] = new Array();
  newName: string = '';
  rightPanelStyle: Object = {};

  onSelect(element: Element): void {
    this.selectedElement = element;
  }

  getFiles() : void {
    this.files = this.fileService.getFiles();
  }

  getFolders() : void {
    this.folders = this.folderService.getFolders();
  }

  onRightClick() {
    this.nRightClicks++;
    return false;
  }

  detectRightMouseClick($event) {
    if ($event.which === 3) {
      this.rightPanelStyle = {'display': 'block', 'left': $event.clientX + 'px', 'top': $event.clientY + 'px'};
      return false;
    }
  }

  closeContextMenu() {
    this.rightPanelStyle = {'display':'none'};
  }

  onNotify(element: Element):void {
    this.copiedFile= element;
    /* Gérer les copies de fichiers*/
  }

  onPaste(): void {
    if(this.pastedFile != null){
      this.pastedFile = this.copiedFile.constructor();
      this.pastedFile.name = this.copiedFile.name + " (copy)";
      this.pastedFile.taille = this.copiedFile.taille;
      this.pastedFile.isFolder = this.copiedFile.isFolder;

      if(this.pastedFile.isFolder){
        this.pastedFile.key = this.folders.length;
        this.folderService.addFolder(<Folder>this.pastedFile,this.folderService.getFolder(this.paths[this.paths.length-1]));
      }else{
        this.pastedFile.key = this.files.length;
        this.fileService.addFile(this.pastedFile,this.folderService.getFolder(this.paths[this.paths.length-1]));
      }
    }
  }

  //Uniquement répertoire courant
  createFile(folder: Folder){
    let f : File = {key: this.files.length,name: this.newName,taille: 0, isFolder: false};
    this.fileService.addFile(f,folder);
  }

  //Uniquement répertoire courant
  createFolder(folder: Folder){
    let f : Folder = {key: this.folders.length, name: this.newName,taille: 0,files: [], isFolder: true};
    this.folderService.addFolder(f,folder);
  }

  onRemove(a : any):void {
    this.selectedElement=null;
  }
  onOpen(folder : Folder){
    this.paths.push(folder.name);
    this.concatPath();
  }

  onComeBack(){
    if(this.paths.length>1){
      let f: Folder = this.folderService.getFolder(this.paths.pop());
      this.concatPath();
    }
  }

  concatPath(){
    this.path = ''
    for(let p of this.paths){
      this.path+= " > " + p ;
    }
  }

  testRequest(){
    this.fileService.testRequest();
  }

  getImageSource(drive: string): string{
    switch(drive) {
      case "google": {
        return "src/app/image/google_drive.jpg";
      }
      case "dropbox": {
        return "src/app/image/dropbox.png";
      }
      default: {
        break;
      }
    }
  }

  getId(log: Log){
    this.ids.push(log);
    //a modifier
    if(this.ids.length==this.drives.length){
      this.login=true;
    }
  }

}
