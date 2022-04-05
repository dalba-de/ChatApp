import { Component, OnInit, ViewChild } from '@angular/core';
import { Socket } from "ngx-socket-io";
import { IUser } from "./user";
import { MatSidenav } from "@angular/material/sidenav";
import { ApiService } from "../../services/api.service";
import { IonContent } from "@ionic/angular";
import { Room } from "./room";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  @ViewChild(IonContent, {static: false}) content!: IonContent;

  users: string[] = [];
  allUsers: any = [];
  allMessages: any = [];
  username: string = "";
  id: number = 0;
  messages: any = {};
  text: string = '';
  rooms: Room[] = [];

  constructor(private socket : Socket, private apiService : ApiService) { }

  ngOnInit(): void {

    // Añadimos username desde la sesion
    this.username = sessionStorage.getItem('username')!;
    
    console.log("User " + this.username + " has arrived!")

    // Comprobación de usuarios cuando volvemos de otra
    // página de la SPA
    this.users = [];
    this.apiService.getUsers().subscribe((result) =>{
      this.allUsers = result;
      for (let i = 0; i < this.allUsers.length; i++) {
        if (this.allUsers[i].name !== this.username)
          this.users.push(this.allUsers[i].name);
      }
      console.log(this.users);
    })

    // Cuando se conecta el socket
    this.socket.on('connect', () => {
      let flag : number = 0;

      // Comprobamos los usuarios cuando conectamos
      // el socket por primera vez
      this.users = [];
      this.apiService.getUsers().subscribe((result) => {
        this.allUsers = result;
        for (let i = 0; i < this.allUsers.length; i++) {
          if (this.allUsers[i].name !== this.username)
            this.users.push(this.allUsers[i].name);
          if (this.allUsers[i].name === this.username) {
            this.id = this.allUsers[i].id;
            flag = 1;
          }
        }
        if (!flag) {
          // Si es la primera vez, creamos el usuario
          this.socket.emit('set-user', {nickname: this.username});
        }
        else {
          // Si no es la primera vez actualizamos el socket
          this.socket.emit('update-user', {nickname: this.username, id: this.id});
        }
      })
      // Comprobamos los mensajes que hay ... IMPLEMENTAR
      let value: string[] = [];
      Object.assign(this.messages, {General: value});
      let value1: string[] = [];
      Object.assign(this.messages, {Tardis: value1});
    })

    // Salta cada vez que entra un nuevo usuario al chat
    // y actualiza la lista de contactos
    this.socket.on('users', () => {
      this.users = [];
      this.apiService.getUsers().subscribe((result) => {
        this.allUsers = result;
        for (let i = 0; i < this.allUsers.length; i++) {
          if (this.allUsers[i].name !== this.username)
            this.users.push(this.allUsers[i].name);
        }
        console.log(this.users);
      })
    })

    // Salta cuando se recibe un nuevo mensaje del servidor
    this.socket.on('chatToClient', (msg) => {
      this.receiveChatMessage(msg);
    })

    // Comprobación de mensajes
    this.apiService.getMessages().subscribe((result) => {
      this.allMessages = result;
      for (let i = 0; i < this.allMessages.length; i++) {
        this.messages[this.allMessages[i].room].push(this.allMessages[i])
      }
      console.log(this.messages);
    })
  }

  // Manda un mensaje al servidor
  sendChatMessage() {
    this.socket.emit('chatToServer', { sender: this.username, room: 'General', message: this.text });
    this.text = "";
  }

  async receiveChatMessage(msg) {
    // const arr = msg.room;
    // this.messages[arr].push(msg);
    //ARREGLARLO! MIRAR DE QUE ROOM VIENE Y BORRAR SOLO ESA EN LINEA 116
    console.log(msg)
    this.messages[msg.room] = []
    await this.apiService.getMessages().subscribe((result) => {
      console.log(result)
      this.allMessages = result;
      for (let i = 0; i < this.allMessages.length; i++) {
        this.messages[this.allMessages[i].room].push(this.allMessages[i])
      }
    })
  }
}

