import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes, RouteReuseStrategy, Router } from "@angular/router";
import { SocketIoConfig, SocketIoModule } from "ngx-socket-io";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppComponent } from './app.component';
import { ShellComponent } from "../app/components/shell/shell.component";
import { ChatComponent } from './components/chat/chat.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { environment } from "../environments/environment";

import { MatSidenavModule } from "@angular/material/sidenav";
import { MatCardModule } from "@angular/material/card";
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTooltipModule } from "@angular/material/tooltip";
import { NgToastModule } from "ng-angular-popup";

import { CourseDialogComponent } from './components/course-dialog/course-dialog.component';
import { PasswordDialogComponent } from './components/password-dialog/password-dialog.component';
import { AdminDialogComponent } from './components/admin-dialog/admin-dialog.component';

import { AuthService } from "../app/services/auth.service";


const config: SocketIoConfig = { url: environment.url, options: {} };

const routes : Routes = [
  { path: '', redirectTo: 'shell', pathMatch: 'full' },
  { path: '', component: ShellComponent },
  { path: 'chat', component: ChatComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    ShellComponent,
    ChatComponent,
    CourseDialogComponent,
    PasswordDialogComponent,
    AdminDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicModule.forRoot(),
    RouterModule.forRoot(routes),
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule,
    NgbModule,
    MatSidenavModule,
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatTooltipModule,
    NgToastModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
