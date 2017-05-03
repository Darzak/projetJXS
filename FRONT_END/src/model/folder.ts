/**
 * Created by Johann Durand on 13/04/2017.
 */
import { Element } from './element';

export class Folder {
  keys: {google : string, dropbox : string};
  name: string;
  taille : string;
  files : Element[];
  isFolder = true;
  sharedList: string[];
  parent: {id : string, isRoot: boolean};
  drives: string[];
}
