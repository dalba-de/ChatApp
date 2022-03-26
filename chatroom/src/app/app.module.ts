import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes, RouteReuseStrategy } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SocketIoModule, SocketIoConfig } from "ngx-socket-io";
import { FormsModule } from "@angular/forms";

import { AppComponent } from './app.component';
import { ChatComponent } from "./components/chat/chat.component";
import { ShellComponent } from "./components/shell/shell.component";

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

const routes: Routes = [
  { path: '', redirectTo: 'shell', pathMatch: 'full' },
  { 
    path: '', component: ShellComponent,
    children: [
      { path: 'chat', component: ChatComponent }
    ]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    ShellComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    IonicModule.forRoot(),
    RouterModule.forRoot(routes),
    SocketIoModule.forRoot(config)
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
