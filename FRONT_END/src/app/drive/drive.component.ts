import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-drive',
  templateUrl: './drive.component.html',
  styleUrls: ['./drive.component.css']
})
export class DriveComponent implements OnInit {
  @Output() connect: EventEmitter<string> = new EventEmitter<string>();
  @Input() imageSource: string;

  constructor() { }

  ngOnInit() {
  }


  synchro(drive: string) {
    this.connect.emit(drive);
  }
}
