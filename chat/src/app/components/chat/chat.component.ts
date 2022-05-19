import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Socket } from "ngx-socket-io";
import { IUser } from "./user";
import { MatSidenav } from "@angular/material/sidenav";
import { ApiService } from "../../services/api.service";
import { IonContent } from "@ionic/angular";
import { Room } from "./room";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { CourseDialogComponent } from '../course-dialog/course-dialog.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  @ViewChild(IonContent, {static: false}) content!: IonContent;

  selectedRoom: string = '';
  showRoom: string = '';
  notificationRoom: string[] = [];
  showPass: boolean = false;
  privateGroup: boolean = false;
  password: string = '';

  //users: string[] = [];
  users: any = [];
  allUsers: any = [];
  usersInRoom: number = 0;
  usersInRoomArr: any = [];
  username: string = "";
  id: number = 0;
  messages: any = [];
  text: string = '';
  rooms: any = [];

  newRoom: string = '';
  

  constructor(private socket : Socket, private apiService : ApiService,
              private dialog: MatDialog) { }

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
          //this.users.push(this.allUsers[i].name);
          this.users.push(this.allUsers[i]);
      }
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
            //this.users.push(this.allUsers[i].name);
            this.users.push(this.allUsers[i]);
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
            //this.users.push(this.allUsers[i].name);
            this.users.push(this.allUsers[i]);
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

	/**
	 * Manda un mensaje al servidor
	 */
  sendChatMessage() {
    this.socket.emit('chatToServer', { sender: this.username, room: this.selectedRoom, message: this.text });
    this.text = "";
  }

	/**
	 * Lee el mensaje del servidor y actualiza los mensajes de la sala
	 */
  async receiveChatMessage(msg) {
		if (msg.room === this.selectedRoom) {
			await this.apiService.getMessagesByRoom(msg.room).subscribe((result) => {
        this.messages = [];
        this.messages = result;
    	})
		}
		else if (msg.sender !== this.username) {
			this.notificationRoom.push(msg.room);
			this.playAudio();
		}
  }

	/**
	 * Actualiza la sala en la que nos encontramos actualmente, asi como el valor
	 * que se muestra en la cabecera
	 */
  updateSelectedRoom(name: string) {

    //Obtiene los mensajes de la sala seleccionada
    this.selectedRoom = name;
    this.apiService.getMessagesByRoom(name).subscribe((result) => {
        this.messages = [];
        this.messages = result;
    })

		// Calcula el numero de usuarios presentes y el nombre en la sala seleccionada
    let room: any;
    this.apiService.getRoomByName(name).subscribe((result) => {
        room = result;
        this.usersInRoom = room.users.length;
				this.usersInRoomArr = room.users;
				if (room.isGroup)
					this.showRoom = name;
				else
					this.showRoom = this.splitName(name);
    })

		// Si existe notificacion en la sala, la elimina
		const index = this.notificationRoom.indexOf(name);
		if (index > -1) {
			this.notificationRoom.splice(index, 1);
		}
  }

	/**
	 * Emite un aviso al gateway cuando se intenta un chat privado
	 */
    userToUser(user: string) {
        if (confirm("Do you want to start a chat with " + user + "?")) {
            this.socket.emit('user-to-user', {myUser: this.username, otherUser: user});
        }
    }

	/**
	 * Crea una nueva sala
	 */
	public createNewRoom() {
		console.log(this.newRoom);

        // this.socket.emit('create-room', {room: this.newRoom, myUser: this.username});
        this.socket.emit('create-room', {room: this.newRoom, myUser: this.username, password: this.password});
	}

	/**
	 * Función utilizada para mostrar correctamente el nombre de los chats privados
name: string	: string */
	public splitName(name: string): string {
		let roomname: string = name.replace(this.username, '');
		return(roomname);
	}

	/**
	 * Reproduce un fichero de audio
	 */
	public playAudio() {
    let audio = new Audio();
    audio.src = "../../assets/audio/notification.mp3";
    audio.load();
    audio.play();
  }

	/**
	 * Compruebas las notificaciones de cada sala
	 */
	public isInArray(name: string): boolean {
		let val: number = this.notificationRoom.indexOf(name);
		if (val !== -1)
			return true;
		return false;
	}

  /**
   * Listar todas las salas
   */
  public openDialog() {
      let rooms : any = [];
      this.apiService.getGroups().subscribe((result) => {
          rooms = result;

          const dialogConfig = new MatDialogConfig();

          dialogConfig.disableClose = true;
          dialogConfig.autoFocus = true;

          dialogConfig.data = {
              title: 'List of Rooms',
              list: rooms,
              username: this.username
          }

          const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);

          dialogRef.afterClosed().subscribe(
              (data) => {
                  console.log("Dialog output:", data);
                  if (data !== undefined) {
                      this.socket.emit('join-room', {room: data, nickname: this.username})
                  }
              }
          );
      })
  }
  
  /**
   * Función para mostrar contraseña al crear salas
   */
  public togglePass() {
    this.showPass = !this.showPass;
  }
}

// PROXIMO A HACER: CREAR NUEVAS SALAS. GESTIONAR SALAS PRIVADAS

