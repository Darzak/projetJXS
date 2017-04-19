import {Component, OnInit, SimpleChanges} from '@angular/core';
import { File } from '../model/file';
import { Folder } from '../model/folder';
import {FileService} from "../service/file.service";
import {FolderService} from "../service/folder.service";
import { Element } from '../model/element';
import { Log } from '../model/log';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [FileService, FolderService]
})

export class AppComponent implements OnInit{
  drives: string[] = ["google", "dropbox"];
  login: boolean = false;

  constructor(private fileService : FileService, private  folderService: FolderService) {
  }

  ngOnInit() : void {
    //this.testRequest();
  }

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

}
