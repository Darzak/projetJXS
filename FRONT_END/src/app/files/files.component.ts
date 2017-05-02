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

  elements: Element[];
  currentDirElements: Element[];
  processing : Element[];


  constructor(private elementService: ElementService, private fileService: FileService, private  folderService: FolderService) {
    this.paths.push("root");
    this.concatPath();
    this.elements = [];
    this.currentDirElements = [];
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

  keys: string[] = new Array();
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
      this.keys.pop();
      this.currentDir = this.keys[this.keys.length-1];
      this.updateCurrentDir();
      /*this.elementService.getElements(this.currentDir).subscribe(
        elements => console.log("RETOUR VERS LE FUTUR"),
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
        this.copiedFile.parent
        );

      this.elements.push(pastedFile);

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

    this.elements.splice(this.elements.indexOf(element), 1);
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
    this.keys.push(parent);
    this.concatPath();
    this.currentDir = parent;
    this.updateCurrentDir();
    this.selectedElement = null;

    /*this.elementService.getElements(parent)
      .subscribe(
        dir => this.elements = dir,
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
    this.elements.push(new Element("", this.newName, "", false,[], undefined));
    this.createElement("fichier");
  }

  /*
   * Methods used to create folder
   */
  createFolder() {
    console.log(this.newName + "dossier");
    this.elements.push(new Element("", this.newName, "", true,[], undefined));
    this.createElement(this.FOLDERTYPE);
  }

  /*
   * Method to create file
   */
  createElement(elementType: string) {



    this.elementService.createElement(this.currentDir, this.newName, elementType)
      .subscribe(
        element => this.elements.push(element),
        error => this.errorMessage = <any>error);
  }

  /*
   * Method to get files from server
   */
  getElements(id: string) {
    console.log("files")
    let el: Element[];
    this.elementService.getElements(id)
      .subscribe(
        elements => this.initElements(elements),
        error => this.errorMessage = <any>error);

  }

  initElements(elements: Element[]){
    let id : string = "";
    this.elements = elements;
    for(let i = 0; i<this.elements.length; i++){
      let element = this.elements[i];
      if(element.parent.isRoot == true){
        this.currentDirElements.push(element);
        id = element.parent.id;
      }
    }
    this.currentDir=id;
    this.keys.push(this.currentDir);
  }

  updateCurrentDir(){
    console.log("FILE COMPONENT : CURRENT DIR");
    this.currentDirElements = [];
    console.log("CURRENT DIR"+this.currentDir);

    for(let i = 0; i<this.elements.length; i++){
      let element = this.elements[i];
      if(element.parent.id == this.currentDir){
        this.currentDirElements.push(element);
      }
    }
  }

}
