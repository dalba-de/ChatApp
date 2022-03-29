import { Component, OnInit, ViewChild } from '@angular/core';
import { Socket } from "ngx-socket-io";
import { IUser } from "./user";
import { MatSidenav } from "@angular/material/sidenav";
import { ApiService } from "../../services/api.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  users: any = [];
  allUsers: any = [];
  username: string = "";

  constructor(private socket : Socket, private apiService : ApiService) { }

  ngOnInit(): void {

    this.username = sessionStorage.getItem('username')!;
    console.log("User " + this.username + " has arrived!")

    this.apiService.getUsers().subscribe((result) =>{
      this.allUsers = result;
      for (let i = 0; i < this.allUsers.length; i++) {
        if (this.allUsers[i].name !== this.username)
          this.users.push(this.users[i].name);
      }
      console.log(this.users);
    })

    this.socket.on('connect', () => {
      
    })
  }

}
