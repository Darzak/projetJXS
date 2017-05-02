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
  processing : Element[];


  constructor(private elementService: ElementService, private fileService: FileService, private  folderService: FolderService) {
    this.paths.push("root");
    this.keys.push("root");
    this.currentDir = ("root");
    this.concatPath();
  }

  ngOnInit(): void {
    this.getElements(this.currentDir);
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
      this.currentDir = this.keys.pop();
      this.elementService.getElements(this.currentDir).subscribe(
        elements => console.log("RETOUR VERS LE FUTUR"),
        error => this.errorMessage = <any>error);

    }
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
        []
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
    let parent = folder.key;
    let name = folder.name;

    this.paths.push(name);
    this.keys.push(parent);
    this.concatPath();

    this.elementService.getElements(parent)
      .subscribe(
        dir => this.elements = dir,
        error => this.errorMessage = <any>error);

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
    this.elements.push(new Element("", this.newName, "", false,[], []));
    this.createElement("fichier");
  }

  /*
   * Methods used to create folder
   */
  createFolder() {
    console.log(this.newName + "dossier");
    this.elements.push(new Element("", this.newName, "", true,[], []));
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
        elements => this.elements = elements,
        error => this.errorMessage = <any>error);

  }


}
