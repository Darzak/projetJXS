import {Component, OnInit} from '@angular/core';
import { File } from './file';
import { Folder } from './folder';
import {FileService} from "./file.service";
import {FolderService} from "./folder.service";
import { Element } from './element';


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
    this.getFolder();
  }

  nRightClicks : number = 0;
  title = 'drive!';
  selectedElement: Element;
  files : File[];
  folders : Folder[];
  copiedFile : Element;
  paths : string[] = new Array();
  path : string = '';

  onSelect(element: Element): void {
    this.selectedElement = element;
  }

  getFiles() : void {
    this.files = this.fileService.getFiles();
  }

  getFolder() : void {
    this.folders = this.folderService.getFolder();
  }

  onRightClick() {
    this.nRightClicks++;
    return false;
  }

  onNotify(element: Element):void {
    this.copiedFile= element.constructor();
    this.copiedFile.name = element.name + " (copy)";
    this.copiedFile.taille = element.taille;
    this.copiedFile.isFolder = element.isFolder;
    if(this.copiedFile.isFolder){
      this.copiedFile.key = this.folders.length;;
    }else{
      this.copiedFile.key = this.files.length;
    }
    /* Gérer les copies de fichiers*/
  }

  onPaste(folder: Folder): void {
    if(this.copiedFile.isFolder){
      this.folderService.addFolder(<Folder>this.copiedFile,folder);
    }else{
      this.fileService.addFile(this.copiedFile,folder);
    }
  }

  onRemove(a : any):void {
    this.selectedElement=null;
  }
  onOpen(folder : Folder){
    this.paths.push(folder.name);
    this.concatPath();
  }

  concatPath(){
    this.path = ''
    for(let p of this.paths){
      this.path+= " > " + p ;
    }
  }

}
