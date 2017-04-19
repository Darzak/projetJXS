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
  @Input() imageSource: string;
  @Output() log: EventEmitter<any> = new EventEmitter<any>();
  selectedDrives: string[] = new Array<string>();

  urlToAllow: string = "a";
  errorMessage: string;
  mode = 'Observable';

  constructor(private loginService : LoginService) { }

  ngOnInit() {
    console.log(this.urlToAllow);
    console.log(this.urlToAllow);
  }

  connect(): void{
	  console.log(this.urlToAllow);
    window.location.href = this.urlToAllow;
  }

  synchro(drive : string) {
	if (this.selectedDrives.indexOf(drive) != -1) {
      this.selectedDrives.splice(this.selectedDrives.indexOf(drive), 1);
    } else {
      this.selectedDrives.push(drive);
    }
	  this.getUrl();
  }

  getUrl() {
    this.loginService.connectToDrive().subscribe(
                                      url => this.urlToAllow = url,
                                      error => this.errorMessage = <any>error)
  }

}
