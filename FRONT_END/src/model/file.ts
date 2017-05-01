/**
 * Created by Johann Durand on 13/04/2017.
 */
import { Element } from './element';

export class File implements Element{
  key: number;
  name: string;
  taille : number;
  isFolder = false;
  sharedList: string[];

}


