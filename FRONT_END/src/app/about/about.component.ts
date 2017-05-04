import { Component, OnInit } from '@angular/core';
import {AboutService} from "../../service/about.service";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  providers: [AboutService],
})
export class AboutComponent implements OnInit {
  storage: string[];
  usedStorageGoogle: number;
  totalStorageGoogle: number;
  errorMessage: any;
  constructor(private aboutService: AboutService) { }

  ngOnInit() {
  }

  getStorageGoogle(){
     this.aboutService.getStorageGoogle()
     .subscribe(
     elements => {console.log(elements)},
     error => this.errorMessage = <any>error);
  }
}
