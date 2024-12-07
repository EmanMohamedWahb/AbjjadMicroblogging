import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { CreatePostComponent} from './components/create-post/create-post.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {CheckboxModule} from 'primeng/checkbox';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import { AuthService } from './services/auth.service';
import { JwtInterceptor } from './core/jwt.interceptor';
import { AuthGuard } from './core/auth.guard';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextareaModule } from 'primeng/inputtextarea';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    CreatePostComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CheckboxModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    HttpClientModule,
    DialogModule,
    FileUploadModule,
    InputTextareaModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
