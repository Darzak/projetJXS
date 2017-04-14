/**
 * Created by Johann Durand on 13/04/2017.
 */
import { File } from './file';
import { Element } from './element';
export class Folder implements Element{
  key: number;
  name: string;
  taille : number;
  files : File[];
  isFolder = true;
}
