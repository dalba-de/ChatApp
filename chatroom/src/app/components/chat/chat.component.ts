import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {

  constructor(private socket : Socket) { }

  ngOnInit() {
    this.socket.on('connect', () => {
      window.alert("socket connected");
    })
  }

}
