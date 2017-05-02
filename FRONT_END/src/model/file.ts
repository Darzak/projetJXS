/**
 * Created by Johann Durand on 13/04/2017.
 */
import { Element } from './element';

export class File implements Element{
  key: string;
  name: string;
  taille : string;
  isFolder = false;
  sharedList: string[];
  parent: {id : string, isRoot: boolean};

}


