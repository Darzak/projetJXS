/**
 * Created by polivier on 11/04/17.
 */
export class Directory{

  name : string;
  taille : number;
  files : Array<File>;
  dirs : Array<Directory>;

  constructor(name: string, taille : number){

    this.files = new Array<File>();
    this.dirs = new Array<Directory>();
    this.name = name;
    this.taille =taille;

    /*for(let o of obj){
     if(o.isdir==false){
     this.files.push(new File(o.name,o.taille));
     }else{
     this.dirs.push(new Directory(o.name,o.taille,o.files));
     }
     }*/

  }
}
