import { Component, OnInit } from '@angular/core';
import {ElementService} from "../../service/element.service";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  providers: [ElementService],
})
export class AboutComponent implements OnInit {
  storage: string[];
  errorMessage: any;
  constructor(private elementService: ElementService) { }

  ngOnInit() {
  }

  getStorageGoogle(){
     this.elementService.getStorageGoogle()
     .subscribe(
     elements => console.log(elements),
     error => this.errorMessage = <any>error);
  }
}
