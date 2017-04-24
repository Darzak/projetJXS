import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule }   from '@angular/router';

import { AppComponent } from './app.component';
import { FileDetailsComponent } from './file-details/file-details.component';
import { LoginComponent } from './login/login.component';
import { ClickOutsideDirective } from './click-outside.directive';
import { FilesComponent } from './files/files.component';
import { DriveComponent } from './drive/drive.component';


@NgModule({
  declarations: [
    AppComponent,
    FileDetailsComponent,
    LoginComponent,
    ClickOutsideDirective,
    FilesComponent,
    DriveComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
        {
          path: 'files',
          component: FilesComponent,
        },
      {
        path: 'login',
        component: LoginComponent
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
