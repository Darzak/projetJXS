/**
 * Created by Johann Durand on 13/04/2017.
 */
import { Element } from './element';

export class Folder implements Element{
  key: string;
  name: string;
  taille : string;
  files : Element[];
  isFolder = true;
  sharedList: string[];
  parent : string[];
}
