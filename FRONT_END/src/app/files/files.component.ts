import {Component, OnInit} from '@angular/core';
import { File } from '../../model/file';
import { Folder } from '../../model/folder';
import {FileService} from "../../service/file.service";
import {FolderService} from "../../service/folder.service";
import { Element } from '../../model/element';
import {ElementService} from "../../service/element.service";
import {el} from "@angular/platform-browser/testing/src/browser_util";


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

  elements : Element[];

  constructor(private elementService : ElementService, private fileService : FileService, private  folderService: FolderService) {
    this.paths.push("root");
    this.concatPath();
  }

  ngOnInit() : void {
    this.getElements("root");
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
    this.folderService.getFolders(folder)
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



  /*
   * Creates a file with the specified name via a post request then add the File to the File list
   */
  createFile(folder: Folder){
    let f : File = {key: this.files.length,name: this.newName,taille: 0, isFolder: false, sharedList: []};
    this.fileService.addFile(f,folder);

    let dirName = folder.name;
    let fileName = "TestCreate?"


    this.fileService.create(dirName, fileName)
      .subscribe(
        file => this.files.push(file),
        error => this.errorMessage = <any>error);
  }

  /*
   * Creates a folder with the specified name via a post request then add the Folder to the Folder list
   */
  createFolder(folder: Folder){
    let f : Folder = {key: this.folders.length, name: this.newName,taille: 0,files: [], isFolder: true, sharedList: []};
    this.folderService.addFolder(f,folder);

    let dirName = folder.name;
    let folderName = "TestCreateFolder?"


    this.folderService.create(dirName, folderName)
      .subscribe(
        folder => this.files.push(folder),
        error => this.errorMessage = <any>error);
  }


  /*-- FINAL --*/

  /*
   * Method to create file
   */
  createElement(userCode : string, dirId : string , elementName: string, elementType : string){

    this.elementService.createElement(userCode, dirId, elementName, elementType)
      .subscribe(
        element => this.elements.push(element),
        error => this.errorMessage = <any>error);
  }


  /*
   * Method to delete file
   */
  deleteElement(userCode : string, elementId : string ){

    this.elementService.deleteElement(userCode, elementId)
      .subscribe(
        //TO DO : supprimer élément de la liste
        element => this.elements.push(),
        error => this.errorMessage = <any>error);
  }

  /*
   * Method to get files from server
   */
  getElements(id : string) {
    this.elementService.getElements(id)
      .subscribe(
        elements => this.elements = elements,
            error =>  this.errorMessage = <any>error);
            }

}
