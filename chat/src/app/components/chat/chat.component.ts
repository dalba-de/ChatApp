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

  selectedRoom: string = '';

  users: string[] = [];
  allUsers: any = [];
  allMessages: any = [];
  allRooms: any = [];
  username: string = "";
  id: number = 0;
  messages: any = {};
  text: string = '';
  rooms: Room[] = [];

  testRooms: any = [];
  testMessages: any = [];

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

    // Comprobación de las salas a las que pertenecemos
    // cuando volvemos de otra pagina de la SPA
    this.rooms = [];
    this.apiService.getRoomsbyUser(this.username).subscribe((result) =>{
      this.testRooms = result
      console.log(this.testRooms);
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
          // Le unimos a la sala general
          this.socket.emit('join-room', {room: 'General', nickname: this.username})
        }
        else {
          // Si no es la primera vez actualizamos el socket
          this.socket.emit('update-user', {nickname: this.username, id: this.id});
        }
      })
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

    // Salta cada vez que nos unimos a una nueva sala,
    // actualizando la lista de salas.
    this.socket.on('joined-room', () => {
      this.apiService.getRoomsbyUser(this.username).subscribe((result) =>{
        this.testRooms = result
        console.log(this.testRooms);
      })
    })

    // Salta cuando se recibe un nuevo mensaje del servidor
    this.socket.on('chatToClient', (msg) => {
      this.receiveChatMessage(msg);
    })

    //Comprobación de grupos y añadimos los objetos a this.messages
    this.apiService.getGroups().subscribe((result) => {
        this.allRooms = result;
        for (let i = 0; i < this.allRooms.length; i++) {
            this.rooms.push(this.allRooms[i]);
            let value: string[] = [];
            Object.assign(this.messages, {[this.allRooms[i].name]: value});
        }
        console.log(this.rooms)
    })

    // Comprobación de las salas a las que pertenecemos
    this.apiService.getRoomsbyUser(this.username).subscribe((result) =>{
      this.testRooms = result
      console.log(this.testRooms);
    })

    // Comprobación de mensajes
    this.apiService.getMessages().subscribe((result) => {
      this.allMessages = result;
      for (let i = 0; i < this.allMessages.length; i++) {
        this.messages[this.allMessages[i].room.name].push(this.allMessages[i])
      }
      console.log(this.messages);
    })
  }

  // Manda un mensaje al servidor
  sendChatMessage() {
    this.socket.emit('chatToServer', { sender: this.username, room: this.selectedRoom, message: this.text });
    this.text = "";
  }

  // Lee el mensaje del servidor y actualiza los mensajes de la sala
  async receiveChatMessage(msg) {
    console.log(msg)
    this.messages[msg.room] = []
    await this.apiService.getMessagesByRoom(msg.room).subscribe((result) => {
      console.log(result)
      this.allMessages = result;
      for (let i = 0; i < this.allMessages.length; i++) {
        this.messages[this.allMessages[i].room.name].push(this.allMessages[i])
      }
    })
  }

  updateSelectedRoom(name: string) {
    this.selectedRoom = name;
  }
}

// PROXIMO A HACER: ELEGIR LAS SALAS EN LAS QUE ESTA EL USUARIO Y MOSTRARLAS EN EL NAVEGADOR LATERAL

