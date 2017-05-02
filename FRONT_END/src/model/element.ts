/**
 * Created by Johann Durand on 13/04/2017.
 */
export class Element {
  key: string;
  name: string;
  taille: string;
  isFolder: boolean;



  sharedList: string[];
  parent: {id : string, isRoot: boolean};

  constructor(key: string, name: string, taille: string, isFolder: boolean, sharedList: string[],parent: {id : string, isRoot: boolean}) {
    this.key = key;
    this.name = name;
    this.taille = taille;
    this.isFolder = isFolder;
    this.sharedList = sharedList;
    this.parent = parent;
  }
}
