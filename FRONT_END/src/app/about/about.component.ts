import { Component, OnInit } from '@angular/core';
import {AboutService} from "../../service/about.service";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  providers: [AboutService],
})
export class AboutComponent implements OnInit {
  usedStorageGoogle: number;
  totalStorageGoogle: number;
  usedStorageDropbox: number;
  totalStorageDropbox: number;
  errorMessage: any;
  constructor(private aboutService: AboutService) { }

  ngOnInit() {
    this.getStorageGoogle();
    this.getStorageDropbox();
  }

  getStorageGoogle(){
     this.aboutService.getStorageGoogle()
     .subscribe(
     elements => {this.usedStorageGoogle = elements[0]; this.totalStorageGoogle = elements[1]},
     error => this.errorMessage = <any>error);
  }

  getStorageDropbox(){
    this.aboutService.getStorageDropbox()
      .subscribe(
        elements => {this.usedStorageDropbox = elements[0]; this.totalStorageDropbox = elements[1]},
        error => this.errorMessage = <any>error);
  }
  //this.usedStorageDropbox = elements[0]; this.totalStorageDropbox = elements[1]
}
