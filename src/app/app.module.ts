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


@NgModule({
  declarations: [
    AppComponent,
    FileDetailsComponent,
    LoginComponent,
    ClickOutsideDirective,
    FilesComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
      {
        path: 'auth',
        component: LoginComponent
      }
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
