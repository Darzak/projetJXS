import { Component, OnInit, Input } from '@angular/core';
//import { FileUploader } from 'ng2-file-upload';

// const URL = '/api/';
const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';

@Component({
  selector: 'app-draganddrop',
  templateUrl: './draganddrop.component.html',
  styleUrls: ['./draganddrop.component.css']
})
export class DraganddropComponent implements OnInit {
    @Input() paths: string[];
    @Input() name: string;
    url: string;
    constructor() { }

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

    fileEvent(fileInput: any){
      let file = fileInput.target.files[0];
      this.name = file.name;
    }
  //public uploader:FileUploader = new FileUploader({url: URL});

}
