import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import {LoginService} from "../../service/login.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})

export class LoginComponent implements OnInit {
  drives: string[] = ["google", "dropbox"];
  connected: boolean = false;
  urlToAllow: string = "a";
  errorMessage: string;
  code: string;
  mode = 'Observable';

  constructor(private loginService : LoginService) { }

  ngOnInit() {
    let l = window.location.href;
    if(l!="http://localhost:4200/login"){
      this.parse(l);
    }
  }

  parse(urlToParse: string){
    let i: number = urlToParse.indexOf("=");
    this.code = urlToParse.substr(i+1,urlToParse.length-i);
    console.log(this.code);
  }

  onConnect(drive: string){
    /*if (this.selectedDrives.indexOf(drive) != -1) {
     this.selectedDrives.splice(this.selectedDrives.indexOf(drive), 1);
     } else {
     this.selectedDrives.push(drive);
     }*/
    this.getUrl(drive);
  }

  getUrl(drive: string) {
    this.loginService.connectToDrive(drive).subscribe(
                                      url => this.urlToAllow = url,
                                      error => this.errorMessage = <any>error)
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
