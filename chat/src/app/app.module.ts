import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes, RouteReuseStrategy, Router } from "@angular/router";
import { SocketIoConfig, SocketIoModule } from "ngx-socket-io";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from './app.component';
import { ShellComponent } from "../app/components/shell/shell.component";
import { ChatComponent } from './components/chat/chat.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

const routes : Routes = [
  { path: '', redirectTo: 'shell', pathMatch: 'full' },
  { path: '', component: ShellComponent },
  { path: 'chat', component: ChatComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    ShellComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    IonicModule.forRoot(),
    RouterModule.forRoot(routes),
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule,
    NgbModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
