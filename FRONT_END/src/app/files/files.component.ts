import {Component, OnInit} from '@angular/core';
import { File } from '../../model/file';
import { Folder } from '../../model/folder';
import {FileService} from "../../service/file.service";
import {FolderService} from "../../service/folder.service";
import { Element } from '../../model/element';


@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css'],
  providers: [FileService, FolderService]
})

export class FilesComponent implements OnInit{
  errorMessage: string;
  mode = 'Observable';
  files : File[];
  folders : Folder[];

  constructor(private fileService : FileService, private  folderService: FolderService) {
    this.paths.push("root");
    this.concatPath();
  }

  ngOnInit() : void {
    this.getFiles();
    this.getFolders();
  }

  rightClicked : Element;
  selectedElement: Element;

  copiedFile : Element;
  pastedFile : Element;
  paths : string[] = new Array();
  path : string = '';
  newName: string = '';
  contextMenuPos: Object = {};

  onSelect(element: Element): void {
    this.selectedElement = element;
  }

  detectRightMouseClick($event, element: Element) {
    if ($event.which === 3) {
      this.contextMenuPos = {'display': 'block', 'left': $event.clientX + 'px', 'top': $event.clientY + 'px'};
      this.rightClicked = element;
      return false;
    }
  }

  closeContextMenu() {
    this.contextMenuPos = {'display':'none'};
    this.rightClicked = null;
  }

  onCopy(element: Element):void {
    if(this.rightClicked != null){
      this.copiedFile = this.rightClicked;
      this.closeContextMenu();
    }else{
      this.copiedFile= element;
    }
  }

  onPaste(): void {
    if(this.copiedFile != null){
      this.pastedFile = this.copiedFile.constructor();
      this.pastedFile.name = this.copiedFile.name + " (copy)";
      this.pastedFile.taille = this.copiedFile.taille;
      this.pastedFile.isFolder = this.copiedFile.isFolder;
      this.pastedFile.sharedList = this.copiedFile.sharedList;
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
    let f : File = {key: this.files.length,name: this.newName,taille: 0, isFolder: false, sharedList: []};
    this.fileService.addFile(f,folder);
  }

  //Uniquement répertoire courant
  createFolder(folder: Folder){
    let f : Folder = {key: this.folders.length, name: this.newName,taille: 0,files: [], isFolder: true, sharedList: []};
    this.folderService.addFolder(f,folder);
  }

  onRemove(a : any):void {
    if(this.rightClicked != null){
      if(this.rightClicked.isFolder){
        let folder = <Folder> this.rightClicked;
        this.folderService.deleteFolder(folder);
      }else{
        this.fileService.deleteFile(<File> this.rightClicked);
      }
      this.rightClicked = null;
      this.closeContextMenu();
    }else{
      this.selectedElement=null;
    }
  }

  onOpen(folder : Folder){
    this.paths.push(folder.name);
    this.concatPath();
    this.fileService.getFiles(folder)
      .subscribe(
      dir => this.files = dir,
      error =>  this.errorMessage = <any>error);
    this.folderService.getFiles(folder)
      .subscribe(
        dir => this.folders = dir,
        error =>  this.errorMessage = <any>error);

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
  getFiles() {
    this.fileService.getRoot()
      .subscribe(
        files => this.files = files,
        error =>  this.errorMessage = <any>error);
  }

  /*getFolders() : void {
   this.folders = this.folderService.getFolders();
   }*/

  getFolders() {
    this.folderService.getRoot()
      .subscribe(
        folders => this.folders = folders,
        error =>  this.errorMessage = <any>error);
  }



}