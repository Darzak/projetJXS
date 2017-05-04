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
    constructor() { }

    ngOnInit() {
    }

    getPath (){
      let res:string = "";
      for(let p of this.paths){
        res+=p;
      }
      res+=this.name;
      console.log(res);
      return res;
    }
  //public uploader:FileUploader = new FileUploader({url: URL});

}
