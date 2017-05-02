/**
 * Created by Johann Durand on 13/04/2017.
 */
export class Element {
  key: string;
  name: string;
  taille: string;
  isFolder: boolean;
  drives: string[];



  sharedList: string[];
  parent: {id : string, isRoot: boolean};

  constructor(key: string, name: string, taille: string, isFolder: boolean, sharedList: string[],parent: {id : string, isRoot: boolean}, drives: string[]) {
    this.key = key;
    this.name = name;
    this.taille = taille;
    this.isFolder = isFolder;
    this.sharedList = sharedList;
    this.parent = parent;
    this.drives=drives;
  }
}
