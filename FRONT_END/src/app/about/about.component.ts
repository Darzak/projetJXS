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
  errorMessage: any;
  constructor(private aboutService: AboutService) { }

  ngOnInit() {
    this.getStorageGoogle();
  }

  getStorageGoogle(){
     this.aboutService.getStorageGoogle()
     .subscribe(
     elements => {this.usedStorageGoogle = elements[0]; this.totalStorageGoogle = elements[1]},
     error => this.errorMessage = <any>error);
  }
}
