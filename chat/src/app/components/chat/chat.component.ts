import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Socket } from "ngx-socket-io";
import { IUser } from "./user";
import { MatSidenav } from "@angular/material/sidenav";
import { ApiService } from "../../services/api.service";
import { IonContent } from "@ionic/angular";
import { Room } from "./room";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { CourseDialogComponent } from '../course-dialog/course-dialog.component';
import { PasswordDialogComponent } from "../password-dialog/password-dialog.component";
import { AdminDialogComponent } from "../admin-dialog/admin-dialog.component";
import { MatTabGroup } from "@angular/material/tabs";
import { NgToastService } from "ng-angular-popup";

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
  adminRoom: string = '';
  notificationRoom: string[] = [];
  showPass: boolean = false;
  privateGroup: boolean = false;
  password: string = '';
  mutedUsers: string[] = [];
  usersMuteMe: string[] = [];

  //users: string[] = [];
  myuser: any = [];
  users: any = [];
  allUsers: any = [];
  realUsers: number = 0;
  usersInRoom: number = 0;
  usersInRoomArr: any = [];
  room: any = [];
  username: string = "";
  id: number = 0;
  messages: any = [];
  text: string = '';
  rooms: any = [];

  newRoom: string = '';
  

  constructor(private socket : Socket, private apiService : ApiService,
              private dialog: MatDialog, private toast: NgToastService) { }

  ngOnInit(): void {

    // Añadimos username desde la sesion
    this.username = sessionStorage.getItem('username')!;
    
    console.log("User " + this.username + " has arrived!")

    // Comprobación de usuarios cuando volvemos de otra
    // página de la SPA
    this.users = [];
    this.apiService.getUsers().subscribe((result) =>{
      this.allUsers = result;
      this.realUsers = 0;
      for (let i = 0; i < this.allUsers.length; i++) {
        if (this.allUsers[i].name !== this.username)
          //this.users.push(this.allUsers[i].name);
          this.users.push(this.allUsers[i]);
        if (this.allUsers[i].online)
          this.realUsers++;
      }
    })

    // Obtenemos los usuarios a los que tenemos silenciados
    this.myuser = [];
    this.mutedUsers = [];
    this.apiService.getUserByName(this.username).subscribe((result) => {
      this.myuser = result;
      this.mutedUsers = this.myuser.mutes;
      if (this.mutedUsers === null)
        this.mutedUsers = [];
    })

    // Obtenemos los usuarios que nos tienen silenciados
    this.myuser = [];
    this.usersMuteMe = [];
    this.apiService.getUserByName(this.username).subscribe((result) => {
      this.myuser = result;
      this.usersMuteMe = this.myuser.usersMuteMe;
      if (this.usersMuteMe === null)
        this.usersMuteMe = [];
    })

    // Cuando se conecta el socket
    this.socket.on('connect', () => {
      let flag : number = 0;

      // Comprobamos los usuarios cuando conectamos
      // el socket por primera vez
      this.users = [];
      this.apiService.getUsers().subscribe((result) => {
        this.allUsers = result;
        this.realUsers = 1;
        for (let i = 0; i < this.allUsers.length; i++) {
          if (this.allUsers[i].name !== this.username)
            //this.users.push(this.allUsers[i].name);
            this.users.push(this.allUsers[i]);
          if (this.allUsers[i].name === this.username) {
            this.id = this.allUsers[i].id;
            flag = 1;
          }
          if (this.allUsers[i].online)
            this.realUsers++;
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

      // Obtenemos los usuarios a los que tenemos silenciados
      this.myuser = [];
      this.mutedUsers = [];
      this.apiService.getUserByName(this.username).subscribe((result) => {
        this.myuser = result;
        this.mutedUsers = this.myuser.mutes;
        if (this.mutedUsers === null)
          this.mutedUsers = [];
      })

      // Obtenemos los usuarios que nos tienen silenciados
      this.myuser = [];
      this.usersMuteMe = [];
      this.apiService.getUserByName(this.username).subscribe((result) => {
        this.myuser = result;
        this.usersMuteMe = this.myuser.usersMuteMe;
        if (this.usersMuteMe === null)
          this.usersMuteMe = [];
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
        this.realUsers = 0;
        for (let i = 0; i < this.allUsers.length; i++) {
          if (this.allUsers[i].name !== this.username)
            //this.users.push(this.allUsers[i].name);
            this.users.push(this.allUsers[i]);
          if (this.allUsers[i].online)
            this.realUsers++;
        }
      })
    })

    // Salta cada vez que silenciamos a un usuario,
    // obteniendo la lista de usuarios.
    this.socket.on('muted-user', () => {
      this.myuser = [];
      this.mutedUsers = [];
      this.apiService.getUserByName(this.username).subscribe((result) => {
        this.myuser = result;
        this.mutedUsers = this.myuser.mutes;
        if (this.mutedUsers === null)
          this.mutedUsers = [];
        console.log(this.mutedUsers)
      })
    })

    // Salta cuando un usuario nos silencia,
    // actualizando la lista.
    this.socket.on('user-mute-you', () => {
      this.myuser = [];
      this.usersMuteMe = [];
      this.apiService.getUserByName(this.username).subscribe((result) => {
        this.myuser = result;
        this.usersMuteMe = this.myuser.usersMuteMe;
        if (this.usersMuteMe === null)
          this.usersMuteMe = [];
      })
    })

    // Salta cada vez que nos unimos a una nueva sala,
    // actualizando la lista de salas.
    this.socket.on('joined-room', () => {
      this.apiService.getRoomsbyUser(this.username).subscribe((result) =>{
        this.rooms = result
        if (this.selectedRoom !== '')
          this.updateSelectedRoom(this.selectedRoom);
      })
    })

    // Salta cuando un usuario ha sido baneado de una sala,
    // actualizando la sala en la que estamos
    this.socket.on('ban-user-room', (data) => {
      this.apiService.getRoomsbyUser(this.username).subscribe((result) =>{
        this.rooms = result
      })
      if (this.selectedRoom === data.room && data.user !== this.username)
        this.updateSelectedRoom(data.room)
      else if (this.selectedRoom === data.room && data.user === this.username) {
        this.updateSelectedRoom('General');
        this.toast.info({detail: 'Alert!', summary: 'You have been banned from ' + data.room, sticky: true})
      }
        
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
			//this.playAudio();
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
    // let room: any;
    this.apiService.getRoomByName(name).subscribe((result) => {
        this.room = result;
        this.usersInRoom = this.room.users.length;
				this.usersInRoomArr = this.room.users;
				if (this.room.isGroup)
					this.showRoom = name;
				else
					this.showRoom = this.splitName(name);
        
        if (this.room.admin !== null)
          this.adminRoom = this.room.admin.name;
        else
          this.adminRoom = '';
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
    userToUser(user: string, tabGroup: MatTabGroup) {
      if (confirm("Do you want to start a chat with " + user + "?")) {
        this.goToNextTabIndex(tabGroup);
        this.socket.emit('user-to-user', {myUser: this.username, otherUser: user});
      }
    }

	/**
	 * Crea una nueva sala
	 */
	public createNewRoom() {
        this.socket.emit('create-room', {room: this.newRoom, myUser: this.username, password: this.password});
        this.newRoom = '';
        this.password = '';
        this.privateGroup = false;
	}

	/**
	 * Función utilizada para mostrar correctamente el nombre de los chats privados
  name: string	: string */
	public splitName(name: string): string {
		let roomname: string = name.replace(this.username, '');
		return(roomname);
	}

	/**
	 * Reproduce un fichero de audio (DEPRECATED)
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
   * Cambiar password a una sala
   */
  public openPasswordDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      username: this.username
    }

    const dialogRef = this.dialog.open(PasswordDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (data) => {
        if (data != undefined)
          this.socket.emit('change-password', {room: this.showRoom, password: data})
      }
    )
  }

  /**
   * Cambiar de administrador a una sala
   */
  public openAdminDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      username: this.username
    }

    const dialogRef = this.dialog.open(AdminDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (data) => {
        console.log(data);
      }
    )
  }
  
  /**
   * Función para mostrar contraseña al crear salas
   */
  public togglePass() {
    this.showPass = !this.showPass;
  }

  /**
   * Función utilizada para silenciar a otros usuarios
   */
  public muteUser(name: string) {
    if (confirm("Do you want to mute " + name + "?" + "\n" + "All chats and private messages will be permanently deleted")) {
      this.socket.emit('mute-user', {myUser: this.username, mutedUser: name});
    }
  }

  /**
   * Función utilizada para desilenciar a un usuario silenciado
   */
  public unmuteUser(name: string) {
    if (confirm("Do you want to unmute " + name + "?")) {
      this.socket.emit('unmute-user', {myUser: this.username, unmutedUser: name});
    }
  }

  /**
   *  Función utilizada para cambiar de pestaña
   */
  private goToNextTabIndex(tabGroup: MatTabGroup) {
    if (!tabGroup || !(tabGroup instanceof MatTabGroup)) return;

    const tabCount = tabGroup._tabs.length;
    tabGroup.selectedIndex = (tabGroup.selectedIndex! + 1) % tabCount;
  }

  public test1() {
    console.log("test1");
  }

  /**
   * Función utilizada para banear usuarios
   */
  public banUser(user: string, room: string) {
    if (confirm("Do you want to ban " + user + "?"))
      this.socket.emit('ban-user', {user: user, room: room})
  }

  /**
   * Función utilizada para hacer pública una sala privada
   */
  public makePublic(room: string) {
    if (confirm("Are you sure you want to make the " + room + " room public?"))
      this.socket.emit('make-public', {room: room});
  }
}

// TODO: 
// CUANDO SE MUTEA A UN USUARIO, DESAPARECE LA SALA PRIVADA Y NO PUEDO LEER SUS MENSAJES ---> HECHO!
// AÑADIR BANEOS ---> HECHO!
// ACTUALIZAR USUARIOS EN UNA SALA CUANDO ENTRAN OTROS USUARIOS ---> HECHO!
// HABRIA QUE ENCRIPTAR LAS CONTRASEÑAS ---> HECHO!
// CAMBIAR O ELIMINAR LA CONTRASEÑA DE ACCESO AL CANAL ---> HECHO!
// GESTIONAR QUE LOS USUARIOS QUIERAN ABANDONAR UNA SALA
// GESTIONAR LOS USUARIOS QUE ME BLOQUEAN A MI ---> HECHO!
// GESTIONAR CUANDO OTRO USUARIO REFRESCA LA PAGINA. DESAPARECEN LOS USUARIOS DE LA LISTA ---> HECHO!
// SILENCIAR A USUARIOS
// CAMBIAR ADMINISTRADOR DEL CANAL