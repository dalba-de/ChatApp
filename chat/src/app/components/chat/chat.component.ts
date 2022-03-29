import { Component, OnInit } from '@angular/core';
import { Socket } from "ngx-socket-io";
import { IUser } from "./user";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  users: IUser[] = [];
  username: string = "";

  constructor(private socket : Socket) { }

  ngOnInit(): void {

    this.username = sessionStorage.getItem('username')!;
    console.log("User " + this.username + " has arrived!")

    this.socket.on('connect', () => {
      window.alert("socket connected");
    })
  }

}
