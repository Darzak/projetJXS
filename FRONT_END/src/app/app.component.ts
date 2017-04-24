import {Component, OnInit, SimpleChanges} from '@angular/core';
import { File } from '../model/file';
import { Folder } from '../model/folder';
import {FileService} from "../service/file.service";
import {FolderService} from "../service/folder.service";
import { Element } from '../model/element';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [FileService, FolderService]
})

export class AppComponent implements OnInit{
  login: boolean = false;

  constructor(private fileService : FileService, private  folderService: FolderService) {
  }

  ngOnInit() : void {
    //this.testRequest();
  }


}
