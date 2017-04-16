import {Component, OnInit} from '@angular/core';
import { File } from '../model/file';
import { Folder } from '../model/folder';
import {FileService} from "../service/file.service";
import {FolderService} from "../service/folder.service";
import { Element } from './element';
import { Log } from '../model/log';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [FileService, FolderService]
})

export class AppComponent implements OnInit{

  constructor(private fileService : FileService, private  folderService: FolderService) {
    /*this.paths.push("root");
    this.concatPath();*/
  }

  ngOnInit() : void {
    //this.testRequest();
    this.login = false;
  }


  drives: [string,string] = ["google", "dropbox"];
  login: boolean;
  ids: Log[] = new Array();


  getImageSource(drive: string): string{
    switch(drive) {
      case "google": {
        return "src/app/image/google_drive.jpg";
      }
      case "dropbox": {
        return "src/app/image/dropbox.png";
      }
      default: {
        break;
      }
    }
  }

  getId(log: Log){
    this.ids.push(log);
    //a modifier
    if(this.ids.length==this.drives.length){
      this.login=true;
    }
  }

}
