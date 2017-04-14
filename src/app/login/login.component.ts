import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Id } from '../../model/id'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  id: string;
  mdp: string;
  @Input() imageSource: string;
  @Output() log: EventEmitter<Id> = new EventEmitter<Id>();
  constructor() { }

  ngOnInit() {
  }

  connect(): void{
    let x:Id = {identifiant: this.id,mdp: this.mdp};
    this.log.emit(x);
  }

}
