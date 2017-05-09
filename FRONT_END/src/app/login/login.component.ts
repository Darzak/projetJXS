import { Component, OnInit } from '@angular/core';
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
  urlToAllow: string = "a";
  errorMessage: string;
  mode = 'Observable';

  constructor(private loginService : LoginService) { }

  ngOnInit() {
  }

  onConnect(drive: string){
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
