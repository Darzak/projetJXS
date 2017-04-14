/**
 * Created by Johann Durand on 13/04/2017.
 */
import { Folder } from './folder';
import { File } from './file';

var file1 : File = { key: 0, name: 'file1', taille: 1, isFolder: false };
var file2 : File = { key: 1, name: 'file2', taille: 1, isFolder: false};
export const folders: Folder[] = [
  { key: 0, name: 'folder1', taille: 1, files: [file1,file2], isFolder: true},
  { key: 1, name: 'folder2', taille: 2, files: [], isFolder: true}
];
