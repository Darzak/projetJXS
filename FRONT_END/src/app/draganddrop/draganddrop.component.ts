import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {UploadService} from "../../service/upload.service";

@Component({
  selector: 'app-draganddrop',
  templateUrl: './draganddrop.component.html',
  styleUrls: ['./draganddrop.component.css'],
  providers: [UploadService]
})
export class DraganddropComponent implements OnInit {
    @Input() paths: string[];
    @Input() name: string;
    @ViewChild("fileInput") fileInput;
    errorMessage: any;
    constructor(private uploadService: UploadService) { }

    ngOnInit() {
    }

    getPath (){
      let res:string = "/";
      for(let p of this.paths){
        if(p!="root"){
          res+=p+"/";
        }
      }
      res+=this.name;
      return res;
    }

    postDropbox(){
      let fi = this.fileInput.nativeElement;
      if (fi.files && fi.files[0]) {
        this.uploadService.uploadDropbox(this.getPath(),fi.files[0]).subscribe(
          element => {alert("Fichier upload avec succés");},
          error => this.errorMessage = <any>error);
      }
    }

  postGoogle(){
    let fi = this.fileInput.nativeElement;
    if (fi.files && fi.files[0]) {
      this.uploadService.uploadGoogle(this.getPath(),fi.files[0]).subscribe(
        element => alert("Fichier upload avec succés"),
        error => this.errorMessage = <any>error);
    }
  }

    fileEvent(fileInput: any){
      let file = fileInput.target.files[0];
      this.name = file.name;
    }

}
