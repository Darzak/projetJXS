/**
 * Created by Julien Durand on 11/04/2017.
 */
import {Component, Input} from '@angular/core';
import { Element } from '../element/element'

import { Directory } from '../model/directory'

@Component({
    selector: 'my-directory',
    template: `<h1>name : {{name}} ; taille : {{taille}}</h1>

                <div>
                  <ul>
                    <my-directory *ngFor="let dir of dirs" >
                      
                    </my-directory>
                  </ul>
                </div>
    
                <div>
                    <ul>
                        <my-file *ngFor="let file of files">
                        {{file.name}}  {{file.taille}}
                        </my-file>
                    </ul>
                </div>
`
})


export class DirectoryComponent{
  @Input('dirs') dirs : Array<Directory>;
  @Input('files') files : Array<File>;

  constructor(){
  }
}
