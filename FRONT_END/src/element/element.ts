/**
 * Created by polivier on 11/04/17.
 */

export abstract class Element{

  name : string;
  taille : number;


  constructor(name: string, taille: number){
    this.name = name;
    this.taille = taille;
  }
}
