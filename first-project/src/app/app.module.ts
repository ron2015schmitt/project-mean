import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatDesignModule } from './mat-design.module';


import { AppComponent } from './app.component';
import { ErrorComponent } from './error/error/error.component';
import { HeaderComponent } from './header/header.component';

import { AppRoutingModule } from './app-routing.module';
import { PostsModule } from './posts/posts.module';

import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './posts/error-interceptor';


@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    HeaderComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    
    FormsModule,
    HttpClientModule,
    MatDesignModule,

    PostsModule,
  ],
  providers: [ 
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [ AppComponent ],
  entryComponents: [ ErrorComponent ],
})
export class AppModule { }
