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
  username: string = "";
  id: number = 0;
  messages: any = [];
  text: string = '';
  rooms: any = [];
  

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
    })

    // Comprobación de las salas a las que pertenecemos
    // cuando volvemos de otra pagina de la SPA
    // this.apiService.getRoomsbyUser(this.username).subscribe((result) =>{
    //   this.rooms = result
    // })

    // CUIDADO AQUI, ESTO ESTA REPETIDO

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
          //Tenemos que volver a unirnos a todas las salas en las que estuviesemos
          this.socket.emit('rejoin-room', {nickname: this.username});
        }
      })
    })

    // Funcion externa para unirle a la sala general una vez que se crea el usuario.
    this.socket.on('new-user', (data) => {
      if (data.name == this.username)
        this.socket.emit('join-room', {room: 'General', nickname: this.username})
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
      })
    })

    // Salta cada vez que nos unimos a una nueva sala,
    // actualizando la lista de salas.
    this.socket.on('joined-room', () => {
      this.apiService.getRoomsbyUser(this.username).subscribe((result) =>{
        this.rooms = result
      })
    })

    // Salta cuando se recibe un nuevo mensaje del servidor
    this.socket.on('chatToClient', (msg) => {
      this.receiveChatMessage(msg);
    })

    // Comprobación de las salas a las que pertenecemos
    this.apiService.getRoomsbyUser(this.username).subscribe((result) =>{
      this.rooms = result
    })
  }

  // Manda un mensaje al servidor
  sendChatMessage() {
    this.socket.emit('chatToServer', { sender: this.username, room: this.selectedRoom, message: this.text });
    this.text = "";
  }

  // Lee el mensaje del servidor y actualiza los mensajes de la sala
  async receiveChatMessage(msg) {
    await this.apiService.getMessagesByRoom(msg.room).subscribe((result) => {
        this.messages = [];
        this.messages = result;
    })
  }

  updateSelectedRoom(name: string) {
    this.selectedRoom = name;
    this.apiService.getMessagesByRoom(this.selectedRoom).subscribe((result) => {
        this.messages = [];
        this.messages = result;
    })
  }
}

// PROXIMO A HACER: ELEGIR LAS SALAS EN LAS QUE ESTA EL USUARIO Y MOSTRARLAS EN EL NAVEGADOR LATERAL

