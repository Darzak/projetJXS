import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Log } from '../../model/log'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Input() imageSource: string;
  connection: Log = {identifiant: '',mdp: ''};
  @Output() log: EventEmitter<Log> = new EventEmitter<Log>();
  constructor() { }

  ngOnInit() {
  }

  connect(): void{
    this.log.emit(this.connection);
  }

}
