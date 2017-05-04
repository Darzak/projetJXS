import {Component, OnInit} from '@angular/core';
import {File} from '../../model/file';
import {Folder} from '../../model/folder';
import {FileService} from "../../service/file.service";
import {FolderService} from "../../service/folder.service";
import {Element} from '../../model/element';
import {ElementService} from "../../service/element.service";


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

  //Contains all the elements from google
  elementsGoogle: Element[];
  currentDirMerged: Element [];
  processing: Element[];


  FOLDERTYPE = "application/vnd.google-apps.folder";
  rightClicked: Element;
  selectedElement: Element;
  copiedFile: Element;

  paths: string[] = new Array();
  path: string = '';

  googleKeys: string[] = new Array();
  dropboxKeys: string[] = new Array();

  newName: string = '';
  contextMenuPos: Object = {};

  constructor(private elementService: ElementService, private fileService: FileService, private  folderService: FolderService) {
    this.paths.push("root");
    this.dropboxKeys.push("root");
    this.concatPath();
    this.elementsGoogle = [];
    this.currentDirMerged = [];
  }

  ngOnInit(): void {
    this.getElements("root");
  }

  /*
   * Method to get files from server
   */
  getElements(id: string) {
    //this.getElementsGoogle();
    this.getElementsDropbox(id);

  }


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

  getImageSource(element: Element): string[] {
    let imagesSource: string[] = [];
    if (element.drives.indexOf("google") != -1) {
      imagesSource.push("/src/app/image/google_drive_icon.jpg");
    }
    if (element.drives.indexOf("dropbox") != -1) {
      imagesSource.push("/src/app/image/dropbox_icon.png");
    }
    return imagesSource;
  }

  update() {
    this.currentDirMerged = [];
    let dropboxLength: number = this.dropboxKeys.length;
    let googleLength: number = this.googleKeys.length;

    if (dropboxLength == googleLength) {
      this.updateDropBox();
      this.updateGoogle()
    }
    else if (dropboxLength > googleLength) {
      this.updateDropBox();
    }
    else if (googleLength > dropboxLength) {
      this.updateGoogle();
    }
  }

  /*-- FINAL --*/
  onComeBack() {

    if (this.paths.length > 1) {

      this.paths.pop();
      this.concatPath();

      let dropboxLength: number = this.dropboxKeys.length;
      let googleLength: number = this.googleKeys.length;

      console.log("ON COME BACK [LENGTH] DROPBOX :" + dropboxLength + "--- GOOGLE :" + googleLength);
      if (dropboxLength == googleLength) {
        this.googleKeys.pop();
        this.dropboxKeys.pop();

        this.update();
      }
      else if (dropboxLength > googleLength) {
        this.dropboxKeys.pop();
        this.update();
      }
      else if (googleLength > dropboxLength) {
        this.googleKeys.pop();
        this.update();
      }
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
        {google:"", dropbox:""},
        this.copiedFile.name + " (copy)",
        this.copiedFile.taille,
        this.copiedFile.isFolder,
        this.copiedFile.sharedList,
        this.copiedFile.parent,
        this.copiedFile.drives
      );

      this.elementsGoogle.push(pastedFile);

      //TO DO CREATE ON ALL DRIVES
      this.elementService.copyElement(this.copiedFile.keys.google).subscribe(
        element => console.log("Fichier copié avec succés"),
        error => this.errorMessage = <any>error);
    }
  }

  /*
   * Method used to delete an element
   */
  onRemove(element: Element) {

    //TO DO REMOVE ON ALL DRIVES
    let id = element.keys.google;

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
    this.currentDirMerged = [];
    let parent = folder.keys;
    let name = folder.name;

    this.paths.push(name);
    this.concatPath();

    //Si le dossier ouvert est présent sur google
    if (folder.drives.indexOf("google") != -1) {
      this.googleKeys.push(parent.google);
      this.updateGoogle();
    }
    //Si le dossier ouvert est présent sur dropbox
    if (folder.drives.indexOf("dropbox") != -1) {
      this.dropboxKeys.push(parent.dropbox);
      this.updateDropBox();
    }
    this.selectedElement = null;
  }

  merge(elements: Element[], drive: string) {

    /*//Si le tableau d'éléments est vide, on ajoute tout
     if (this.currentDirMerged.length == 0) {
     for (let i = 0; i < elements.length; i++) {
     this.currentDirMerged.push(elements[i]);
     }
     }*/

    //Sinon on merge les folders de même nom

    for (let i = 0; i < elements.length; i++) {
      let tmpElement = elements[i];

      //Si c'est pas un folder, on s'en fiiiiche
      if (!tmpElement.isFolder) {
        this.currentDirMerged.push(tmpElement);
      }
      //On merge les folders
      else {
        let inDir = this.currentDirMerged.find(elem => elem.name == tmpElement.name);
        if (inDir === undefined) {
          this.currentDirMerged.push(elements[i]);
        } else {

          inDir.drives.push(tmpElement.drives[0]);

          switch (drive) {
            case "google": {
              inDir.keys.google = tmpElement.keys.google;
              break;
            }
            case "dropbox": {
              inDir.keys.dropbox = tmpElement.keys.dropbox;
              break;
            }
            default: {
            }
              break;
          } // end of switch
        } // end else
      } // end for
    }


  }


  concatPath() {
    this.path = ''
    for (let p of this.paths) {
      this.path += " > " + p;
    }
  }

  onCreate(isFolder: boolean) {
    let dropboxLength: number = this.dropboxKeys.length;
    let googleLength: number = this.googleKeys.length;

    console.log("ON COME BACK [LENGTH] DROPBOX :" + dropboxLength + "--- GOOGLE :" + googleLength);
    //On crée sur les deux ?
    if (dropboxLength == googleLength) {
      if (isFolder) {

      }
      else {
        this.createFileOnDropbox();
        this.createFileOnGoogle();
      }

    }
    //On crée sur dropbox
    else if (dropboxLength > googleLength) {
      if (isFolder) {

      }
      else {
        this.createFileOnDropbox();
      }
    }

    //on crée sur google
    else if (googleLength > dropboxLength) {
      if (isFolder) {

      }
      else {
        this.createFileOnGoogle();
      }
    }
  }


  /*
   * Method used to create simple file
   */
  createFileOnDropbox() {
    console.log(this.newName + "fichier");
    let key : string;
    if(this.dropboxKeys.length>1){
      key = this.dropboxKeys[this.dropboxKeys.length-1];
    }
    else{
      key="";
    }

    let name = "/"+this.newName;

    let newElement = {keys : {google : "", dropbox : key+name}, name : this.newName, taille :"", isFolder :false, sharedList :[], parent : undefined,drives: ["dropbox"]};
    this.currentDirMerged.push(newElement);
    console.log("FICHIER ENVOYE AU SERVICE :")
    this.elementService.createFileDropbox(name).subscribe(
      element => console.log("FICHIER CREE :"),
      error => this.errorMessage = <any>error);
  }

  //TODO
  createFileOnGoogle() {

  }

  /*
   * Methods used to create folder
   */
  createFolder() {
    console.log(this.newName + "dossier");
    //this.elementsGoogle.push(new Element("", this.newName, "", true, [], undefined, ["TODO : mettre un DRIVE"]));
    this.createElement(this.FOLDERTYPE);
  }

  /*
   * Method to create file
   */
  createElement(elementType: string) {
    this.elementService.createElement(this.googleKeys[this.googleKeys.length - 1], this.newName, elementType)
      .subscribe(
        element => this.elementsGoogle.push(element),
        error => this.errorMessage = <any>error);
  }


  getElementsGoogle() {
    let el: Element[];
    this.elementService.getElementsGoogle()
      .subscribe(
        elements => this.initElementsGoogle(elements),
        error => this.errorMessage = <any>error);
  }

  getElementsDropbox(id: string) {
    let el: Element[];
    this.elementService.getElementsDropbox(id)
      .subscribe(
        elements => this.initElementsDropbox(elements),
        error => this.errorMessage = <any>error);
  }

  initElementsGoogle(elements: Element[]) {
    let id: string = "";
    this.elementsGoogle = elements;
    let currentDirElements: Element [] = [];

    for (let i = 0; i < this.elementsGoogle.length; i++) {
      let element = this.elementsGoogle[i];
      if (element.parent.isRoot == true) {
        currentDirElements.push(element);
        id = element.parent.id;
      }
    }
    this.merge(currentDirElements, "google");
    this.googleKeys.push(id);
  }

  initElementsDropbox(elements: Element[]) {
    this.merge(elements, "dropbox");
  }

  updateGoogle() {
    let tmpCurrentDirElementsGoogle: Element[] = [];
    let currentDirId = this.googleKeys[this.googleKeys.length - 1];

    for (let i = 0; i < this.elementsGoogle.length; i++) {
      let element = this.elementsGoogle[i];
      if (element.parent.id == currentDirId) {
        tmpCurrentDirElementsGoogle.push(element);

      }
    }
    this.merge(tmpCurrentDirElementsGoogle, "google");
  }

  updateDropBox() {
    let thePath = this.dropboxKeys[this.dropboxKeys.length - 1];

    console.log("DROPBOX PATH :" + thePath)
    this.getElementsDropbox(thePath);
  }

}
