import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Log } from '../../model/log'
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
  connection: Log = {identifiant: '',mdp: ''};
  @Output() log: EventEmitter<Log[]> = new EventEmitter<Log[]>();
  drives: string[] = ["google", "dropbox"];
  ids: Log[] = new Array();
  selectedDrives: string[] = new Array<string>();

  urlToAllow: string = 'aaa';
  errorMessage: string;
  mode = 'Observable';

  constructor(private loginService : LoginService) { }

  ngOnInit() {
    console.log(this.urlToAllow);
    console.log(this.urlToAllow);
  }

  connect(): void{
    //this.log.emit();
	this.getUrl();
  }

  selectDrive(drive : string) {
    if (this.selectedDrives.indexOf(drive) != -1) {
      this.selectedDrives.splice(this.selectedDrives.indexOf(drive), 1);
    } else {
      this.selectedDrives.push(drive);
    }
  }

  getUrl() {
    this.loginService.connectToDrive().subscribe(
                                      url => this.urlToAllow = url,
                                      error => this.errorMessage = <any>error)
  }

}
