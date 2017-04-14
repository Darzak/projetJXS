/**
 * Created by Johann Durand on 13/04/2017.
 */
import { Element } from '../app/element';

export class File implements Element{
  key: number;
  name: string;
  taille : number;
  isFolder = false;
}


