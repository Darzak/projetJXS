import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-drive',
  templateUrl: './drive.component.html',
  styleUrls: ['./drive.component.css']
})
export class DriveComponent implements OnInit {
  @Output() connect: EventEmitter<string> = new EventEmitter<string>();
  @Input() imageSource: string;
  button: string = "Connecter";

  constructor() { }

  ngOnInit() {
  }

  synchro(drive: string) {
    this.connect.emit(drive);
    if(this.button=="Connecter"){
      this.button = "Déconnecter";
    }else{
      this.button = "Connecter";
    }
  }
}
