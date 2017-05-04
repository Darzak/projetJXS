import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {UploadService} from "../../service/upload.service";
//import { FileUploader } from 'ng2-file-upload';

// const URL = '/api/';
const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';

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
    url: string;
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
      this.url="http://localhost:8080/ServerREST/myWebService/Dropbox/uploadFiles?path=";
      this.url= this.url +res;
      console.log(this.url);
      return this.url;
    }

    post(){
      let fi = this.fileInput.nativeElement;
      if (fi.files && fi.files[0]) {
        this.uploadService.uploadDropbox(this.getPath()).subscribe(
          element => {alert("Fichier upload avec succés"); console.log(element)},
          error => this.errorMessage = <any>error);
      }
    }

    fileEvent(fileInput: any){
      let file = fileInput.target.files[0];
      this.name = file.name;
    }
  //public uploader:FileUploader = new FileUploader({url: URL});

}
