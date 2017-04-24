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
  @Output() connect: EventEmitter<any> = new EventEmitter<any>();

  connected: boolean = false;
  urlToAllow: string = "a";
  errorMessage: string;
  code: string;
  mode = 'Observable';

  constructor(private loginService : LoginService) { }

  ngOnInit() {
    let l = window.location.href;
    this.parse(l);
  }

  parse(urlToParse: string){
    let i: number = urlToParse.indexOf("=");
    this.code = urlToParse.substr(i+1,urlToParse.length-i);
    console.log(this.code);
  }

  synchro(drive: string) {
	  this.getUrl(drive);
    this.connect.emit();
  }

  getUrl(drive: string) {
    this.loginService.connectToDrive().subscribe(
                                      url => this.urlToAllow = url,
                                      error => this.errorMessage = <any>error)
  }

}
