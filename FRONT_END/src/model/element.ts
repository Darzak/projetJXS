/**
 * Created by Johann Durand on 13/04/2017.
 */
export class Element {
  keys: {google : string, dropbox : string};
  name: string;
  taille: string;
  isFolder: boolean;
  drives: string[];
  sharedList: string[];
  parent: {id : string, isRoot: boolean};

  constructor(keys: {google, dropbox}, name: string, taille: string, isFolder: boolean, sharedList: string[],parent: {id : string, isRoot: boolean}, drives: string[]) {
    this.keys.google= keys.google;
    this.keys.dropbox = keys.dropbox;
    this.name = name;
    this.taille = taille;
    this.isFolder = isFolder;
    this.sharedList = sharedList;
    this.parent = parent;
    this.drives=drives;
  }
}
