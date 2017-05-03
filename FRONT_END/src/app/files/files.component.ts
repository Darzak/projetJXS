import {Component, OnInit} from '@angular/core';
import {File} from '../../model/file';
import {Folder} from '../../model/folder';
import {FileService} from "../../service/file.service";
import {FolderService} from "../../service/folder.service";
import {Element} from '../../model/element';
import {ElementService} from "../../service/element.service";
import {el} from "@angular/platform-browser/testing/src/browser_util";


@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css'],
  providers: [FileService, FolderService, ElementService]
})

export class FilesComponent implements OnInit {

  errorMessage: string;
  mode = 'Observable';
  files: File[];
  folders: Folder[];

  elementsGoogle: Element[];
  currentDirElementsGoogle: Element[];
  currentDirElementsDropbox : Element[];
  processing : Element[];


  constructor(private elementService: ElementService, private fileService: FileService, private  folderService: FolderService) {
    this.paths.push("root");
    this.concatPath();
    this.elementsGoogle = [];
    this.currentDirElementsGoogle = [];
  }

  ngOnInit(): void {
    this.getElements("root");
  }

  FOLDERTYPE = "application/vnd.google-apps.folder";


  rightClicked: Element;
  selectedElement: Element;
  copiedFile: Element;

  paths: string[] = new Array();
  path: string = '';

  googleKeys: string[] = new Array();
  currentDir : string;

  newName: string = '';
  contextMenuPos: Object = {};



  detectRightMouseClick($event, element: Element) {
    if ($event.which === 3) {
      this.contextMenuPos = {'display': 'block', 'left': $event.clientX + 'px', 'top': $event.clientY + 'px'};
      this.rightClicked = element;
      return false;
    }
  }

  closeContextMenu() {
    this.contextMenuPos = {'display': 'none'};
    this.rightClicked = null;
  }




  /*-- FINAL --*/
  onComeBack() {
    if(this.paths.length>1){
      this.paths.pop();
      this.concatPath();
      this.googleKeys.pop();
      this.currentDir = this.googleKeys[this.googleKeys.length-1];
      this.updateCurrentDir();
      /*this.elementService.getElementsGoogle(this.currentDir).subscribe(
        elementsGoogle => console.log("RETOUR VERS LE FUTUR"),
        error => this.errorMessage = <any>error);*/

    }
    this.selectedElement = null;
  }

  onSelect(element: Element): void {
    this.selectedElement = element;
  }

  /*
   * Method used to copy an element into the cache
   */
  onCopy(element: Element): void {
    if (this.rightClicked != null) {
      this.copiedFile = this.rightClicked;
      this.closeContextMenu();
    } else {
      this.copiedFile = element;
    }
  }

  /*
   * Method used to past an element already copied into the cache
   */
  onPaste(): void {
    if (this.copiedFile != null) {
      let pastedFile = new Element(
        "",
        this.copiedFile.name + " (copy)",
        this.copiedFile.taille,
        this.copiedFile.isFolder,
        this.copiedFile.sharedList,
        this.copiedFile.parent,
        this.copiedFile.drives
        );

      this.elementsGoogle.push(pastedFile);

      this.elementService.copyElement(this.copiedFile.key).subscribe(
        element => console.log("Fichier copié avec succés"),
        error => this.errorMessage = <any>error);
    }
  }

  /*
   * Method used to delete an element
   */
  onRemove(element: Element) {
    let id = element.key;

    this.elementsGoogle.splice(this.elementsGoogle.indexOf(element), 1);
    if (this.rightClicked != null) {
      this.rightClicked = null;
      this.closeContextMenu();
    } else {
      this.selectedElement = null;
    }

    this.elementService.deleteElement(id).subscribe(
      element => console.log("Fichier supprimé avec succès"),
      error => this.errorMessage = <any>error);
  }

  /*
   * Method used to navigate through a folder
   */
  onOpen(folder: Element) {
    console.log("ON OPEN" + folder.name);
    let parent = folder.key;
    let name = folder.name;

    this.paths.push(name);
    this.googleKeys.push(parent);
    this.concatPath();
    this.currentDir = parent;

    if(folder.drives.indexOf("google")!=-1)
      this.updateCurrentDir();
    else if(folder.drives.indexOf("dropbox")!=-1){
        let thePath ="";
        for(let i = 1; i<this.paths.length; i++){
          thePath+="/"+this.paths[i];
        }

        this.getElementsDropbox(thePath);

    }

    this.selectedElement = null;

    /*this.elementService.getElementsGoogle(parent)
      .subscribe(
        dir => this.elementsGoogle = dir,
        error => this.errorMessage = <any>error);*/

  }

  concatPath() {
    this.path = ''
    for (let p of this.paths) {
      this.path += " > " + p;
    }
  }

  /*
   * Method used to create simple file
   */
  createFile() {
    console.log(this.newName + "fichier");
    this.elementsGoogle.push(new Element("", this.newName, "", false,[], undefined,["TODO : mettre un DRIVE"]));
    this.createElement("fichier");
  }

  /*
   * Methods used to create folder
   */
  createFolder() {
    console.log(this.newName + "dossier");
    this.elementsGoogle.push(new Element("", this.newName, "", true,[], undefined,["TODO : mettre un DRIVE"]));
    this.createElement(this.FOLDERTYPE);
  }

  /*
   * Method to create file
   */
  createElement(elementType: string) {

    this.elementService.createElement(this.currentDir, this.newName, elementType)
      .subscribe(
        element => this.elementsGoogle.push(element),
        error => this.errorMessage = <any>error);
  }

  /*
   * Method to get files from server
   */
  getElements(id: string) {
    //this.getElementsGoogle();
    this.getElementsDropbox(id);

  }

  getElementsGoogle(){
    console.log("files")
    let el: Element[];
    this.elementService.getElementsGoogle()
      .subscribe(
        elements => this.initElementsGoogle(elements),
        error => this.errorMessage = <any>error);
  }

  getElementsDropbox(id : string){
    console.log("GETELEMENTS DROPBOX");
    let el: Element[];
    this.elementService.getElementsDropbox(id)
      .subscribe(
        elements => this.initElementsDropbox(elements),
        error => this.errorMessage = <any>error);
  }



  initElementsGoogle(elements: Element[]){
    let id : string = "";
    this.elementsGoogle = elements;
    for(let i = 0; i<this.elementsGoogle.length; i++){
      let element = this.elementsGoogle[i];
      if(element.parent.isRoot == true){
        this.currentDirElementsGoogle.push(element);
        id = element.parent.id;
      }
    }
    this.currentDir=id;
    this.googleKeys.push(this.currentDir);
  }

  initElementsDropbox(elements: Element[]){
    console.log("INITELEMENTS DROPBOX");
    console.log("ELEMENTS" +elements);
    let id : string = "";
    this.currentDirElementsDropbox = elements;
  }

  updateCurrentDir(){
    console.log("FILE COMPONENT : CURRENT DIR");
    this.currentDirElementsGoogle = [];
    console.log("CURRENT DIR"+this.currentDir);

    for(let i = 0; i<this.elementsGoogle.length; i++){
      let element = this.elementsGoogle[i];
      if(element.parent.id == this.currentDir){
        this.currentDirElementsGoogle.push(element);
      }
    }
  }

}
