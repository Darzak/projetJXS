import { Component, OnInit } from '@angular/core';
//import { FileUploader } from 'ng2-file-upload';

// const URL = '/api/';
const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';

@Component({
  selector: 'app-draganddrop',
  templateUrl: './draganddrop.component.html',
  styleUrls: ['./draganddrop.component.css']
})
export class DraganddropComponent implements OnInit {

    constructor() { }

    ngOnInit() {
    }
  //public uploader:FileUploader = new FileUploader({url: URL});

}
