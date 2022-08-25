import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Logger } from "@nestjs/common";
import { Socket, Server } from "socket.io";
import { UsersService } from "./users/users.service";
import { MessagesService } from "./messages/messages.service";
import { RoomsService } from "./rooms/rooms.service";
import { CreateUserDto } from "./users/dto/create-user.dto";
import { UpdateUserDto } from "./users/dto/update-user.dto";
import { CreateMessageDto } from "./messages/dto/create-message.dto";
import { CreateRoomDto } from "./rooms/dto/create-room.dto";
import { UpdateRoomDto } from "./rooms/dto/update-room.dto";
import { UpdateStatusDto } from "./users/dto/update-status.dto";
import { UpdateMutesDto } from "./users/dto/update-mutes.dto";
import { UpdateMutesToMeDto } from "./users/dto/update-mutes-to-me.dto";
import { MakePublicRoomDto } from "./rooms/dto/make-public-room.dto";
import { UpdatePasswordDto } from "./rooms/dto/update-password.dto";
import { User } from "./users/entities/user.entity";

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {

  @WebSocketServer() wss: Server;

  constructor (private usersService : UsersService,
               private messagesService: MessagesService,
               private roomService: RoomsService) {}

  private logger: Logger = new Logger('ChatGateway');

  /**
   * Tras arrancar el servidor se crea la sala 'General'
   */
  async afterInit(server: any) {
    this.logger.log("Initialized!")

    let room : any = await this.roomService.findByName('General');
    if (!room) {
        let newRoom : CreateRoomDto = {
            name: 'General',
            private: false,
            isGroup: true,
            password: null,
            users: null,
            admin: null
        }
        this.roomService.create(newRoom);
    }    
  }

  /**
   * Salta cuando se conecta un usuario
   */
  handleConnection(client: any, ...args: any[]) {
    this.logger.log("User Connected!");
  }

  /**
   * Gestiona la desconexión del usuario, actualizando su status a 
   * offline y mandando el aviso al resto de usuarios
   */
  async handleDisconnect(client: any) {
    let user: any = await this.usersService.findBySocket(client.id);
    
    let updateStatus: UpdateStatusDto;
    updateStatus = {
      id: user.id,
      online: false
    }
    this.usersService.updateStatus(updateStatus);
    this.wss.emit('users');
    this.logger.log("User Disconnected!")
  }

  /**
   * Cuando entra un nuevo cliente, crea el usuario, lo añade a 
   * la base de datos y avisa al resto de usuarios.
   */
  @SubscribeMessage('set-user')
  async setUser(client: Socket, data : {nickname: string}) {

    let newUser : CreateUserDto;
    newUser = {
      socket : client.id,
      name : data.nickname,
      online : true
    }

    await this.usersService.create(newUser);
    this.wss.emit('users');
    this.wss.emit('new-user', {name: data.nickname});
    this.logger.log("User created!");
  }

  /**
   * Función utilizada para actualizar el socket y el status de un
   * cliente ya conocido que vuelve a entrar en el chat
   */
  @SubscribeMessage('update-user')
  updateUser(client: Socket, data : {nickname : string, id : number}) {
    let updateUser : UpdateUserDto;
    updateUser = {
      id: data.id,
      socket : client.id,
      online: true
    }
    this.usersService.updateUser(updateUser);
    this.wss.emit('users');
  }

  /**
   * Función utilizada para crear un Json a partir de un array
   */
  async createJson(data: any[]): Promise<any[]> {
    let users: any[] = [];

    for (let i in data) {
        let item = data[i];

        users.push({
            "id": item.id
        })
    }
    return users;
  }

  /**
   * Función utilizada cuando el cliente entra en una nueva sala, actualizando
   * los usuarios de la sala y añadiendo el socket a la misma
   */
  @SubscribeMessage('join-room')
  async joinRoom(client: Socket, data : {room: string, nickname: string}) {
    let room: any = await this.roomService.findByName(data.room);
    let users: any[] = await this.createJson(room.users);
    let user: any = await this.usersService.findByName(data.nickname);

    users.push({
        "id": user.id
    })

    let updateRoom: UpdateRoomDto;
    updateRoom = {
      id: room.id,
      users: users
    }
    await this.roomService.updateRoom(updateRoom);
    client.join(data.room);
    this.wss.emit('joined-room');
  }

  /**
   * Función utilizada para gestionar la salida de los usuarios de una sala
   */
  @SubscribeMessage('leave-room')
  async leaveRoom(client: Socket, data : {room: string, nickname: string}) {

  }

  /**
   * Función utilizada para crear un array a partir de otro
   */
  async createArray(data: any[]): Promise<any[]> {
    let users: any[] = [];

    if (!data)
      for (let i in data) {
        users.push(data[i].name);
      }
    else
      users = data;
    
    return users;
  }

  /**
   * Función utilizada cuando un cliente decide silenciar a otro
   * usuario. Actualiza tanto la lista de silenciados por el cliente,
   * como la lista de gente que me a silenciado a mi.
   */
  @SubscribeMessage('mute-user')
  async muteUser(client: Socket, data : {myUser: string, mutedUser: string}) {
    let user: any = await this.usersService.findByName(data.myUser);
    let otherUser: any = await this.usersService.findByName(data.mutedUser);

    let useroption1: string = data.myUser + data.mutedUser;
    let useroption2: string = data.mutedUser + data.myUser;

    let users: any[] = await this.createArray(user.mutes);
    if (users.indexOf(otherUser.name) > -1)
      return ;
    users.push(otherUser.name);

    let updateMutes: UpdateMutesDto;
    updateMutes = {
      id: user.id,
      mutes: users
    }
    await this.usersService.updateMutes(updateMutes);

    let usersMuteMe: any [] = await this.createArray(otherUser.usersMuteMe);
    usersMuteMe.push(user.name);

    let updateMutesToMe: UpdateMutesToMeDto;
    updateMutesToMe = {
      id: otherUser.id,
      usersMuteMe: usersMuteMe
    }
    await this.usersService.updateMutesToMe(updateMutesToMe);

    let userRooms: any = await this.roomService.findUsersInRoom(data.myUser);
    let id : number;

    for (let i = 0; i < userRooms.length; i++) {
      if (userRooms[i].name === useroption1 || userRooms[i].name === useroption2) {
        id = userRooms[i].id;
        await this.roomService.remove(id);
        
      }
    }      

    this.wss.emit('muted-user');
    this.wss.emit('users');
    client.broadcast.to(otherUser.socket).emit('user-mute-you');
  }

  /**
   * Función utilizada para desilenciar a un usuario. Actualiza tanto 
   * la lista de silenciados por el cliente, como la lista de gente 
   * que me a silenciado a mi.
   */
  @SubscribeMessage('unmute-user')
  async unmuteUser(client: Socket, data :  {myUser: string, unmutedUser: string}) {
    let user: any = await this.usersService.findByName(data.myUser);
    let otherUser: any = await this.usersService.findByName(data.unmutedUser);
    
    let users: string[] = user.mutes;
    const index = users.indexOf(data.unmutedUser, 0);
    if (index > -1) {
      users.splice(index, 1);
    }

    let updateMutes: UpdateMutesDto;
    updateMutes = {
      id: user.id,
      mutes: users
    }
    await this.usersService.updateMutes(updateMutes);

    let usersMuteMe: string[] = otherUser.usersMuteMe;
    const otherIndex = usersMuteMe.indexOf(data.myUser, 0);
    if (index > -1) {
      usersMuteMe.splice(index, 1);
    }

    let updateMutesToMe: UpdateMutesToMeDto;
    updateMutesToMe = {
      id: otherUser.id,
      usersMuteMe: usersMuteMe
    }
    await this.usersService.updateMutesToMe(updateMutesToMe);

    this.wss.emit('muted-user');
    this.wss.emit('users');
    client.broadcast.to(otherUser.socket).emit('user-mute-you');
  }

  /**
   * Función utilizada para volver a unirnos a una sala en la que ya
   * estabamos, despues de actualizar el socket.
   */
  @SubscribeMessage('rejoin-room')
  async rejoinRoom(client: Socket, data : {nickname: string}) {
      let rooms: any = await this.roomService.findUsersInRoom(data.nickname);
      for (let i = 0; i < rooms.length; i++) {
          client.join(rooms[i].name);
      }
      this.wss.emit('joined-room');
  }

  /**
   * Función que recibe los mensajes que se mandan al servidor y que
   * reenvia al resto de clientes.
   */
  @SubscribeMessage('chatToServer')
  async handleMessage(client: Socket, message: {sender: string, room: string, message: string}) {
    let user : any = await this.usersService.findByName(message.sender);
    let room : any = await this.roomService.findByName(message.room);

    let newMsg: any = {
      user: user.id,
      room: room.id,
      message: message.message
    }
    await this.messagesService.create(newMsg);

    //this.wss.emit('chatToClient', {text: message.message, room: message.room, from: message.sender, created: new Date()});
    this.wss.to(message.room).emit('chatToClient', {text: message.message, room: message.room, from: message.sender, created: new Date()})
  }

  /**
   * Función utilizada para gestionar los chats privados entre dos
   * clientes.
   */
  @SubscribeMessage('user-to-user')
  async handleUserToUser(client: Socket, data: {myUser: string, otherUser: string}) {
    let other_user : any = await this.usersService.findByName(data.otherUser);
    let my_user : any = await this.usersService.findByName(data.myUser);
    let socketId: Socket = this.wss.sockets.sockets.get(other_user.socket);
    let roomName: string = data.myUser + data.otherUser;
    let users : any[] = [];

    users.push({"id": my_user.id});
    users.push({"id": other_user.id});

    client.join(roomName);
    socketId.join(roomName);
    let newRoom : CreateRoomDto = {
        name: roomName,
        private: false,
        isGroup: false,
        password: null,
        users: users,
        admin: null
    }
    this.roomService.create(newRoom);
    //client.emit('joined-room');
    this.wss.emit('joined-room');
    // client.broadcast.to(other_user.socket).emit('joined-room');
  }

  /**
   * Función utilizada para gestionar el baneo de usuarios
   */
  @SubscribeMessage('ban-user')
  async handleBanUser(client: Socket, data: {user: string, room: string}) {
    let banUser : any = await this.usersService.findByName(data.user);
    let banRoom : any = await this.roomService.findByName(data.room);
    let socketId: Socket = this.wss.sockets.sockets.get(banUser.socket);

    let users: any[] = banRoom.users;
    const index = users.map(function(e) {return e.name;}).indexOf(data.user);
    if (index > -1) {
      users.splice(index, 1)
    }

    let updateRoom: UpdateRoomDto;
    updateRoom = {
      id: banRoom.id,
      users: users
    }
    socketId.leave(banRoom);
    await this.roomService.updateRoom(updateRoom);
    this.wss.emit('ban-user-room', {room: data.room, user: data.user});
  }

  /**
   * Función utilizada para crear una nueva sala.
   */
  @SubscribeMessage('create-room')
  async createRoom(client: Socket, data : {room: string, myUser: string, password: string}) {
    let user: any = await this.usersService.findByName(data.myUser);
    let users: any[] = [];
    let pass: string;
    let priv: boolean;

    if (!data.password) {
        pass = null;
        priv = false;
    }       
    else {
        pass = data.password;
        priv = true;
    }

    users.push({"id": user.id});

    let newRoom : CreateRoomDto = {
        name: data.room,
        private: priv,
        isGroup: true,
        password: pass,
        users: users,
        admin: user.id
    }

    await this.roomService.create(newRoom);
    client.join(data.room);
    this.wss.emit('joined-room');
  }

  /**
   * Función utilizada para hacer púbica una sala que era privada
   */
  @SubscribeMessage('make-public')
  async makePublic(client: Socket, data : {room: string}) {
    let room: any = await this.roomService.findByName(data.room);

    let makePublicRoom : MakePublicRoomDto;
    makePublicRoom = {
      id: room.id,
      private: false,
      password: null
    }
    await this.roomService.makePublic(makePublicRoom);
    this.wss.emit('joined-room');
  }

  /**
   * Función utilizada para actualizar la contraseña de una sala
   */
  @SubscribeMessage('change-password')
  async changePassword(client: Socket, data : {room: string, password: string}) {
    let room : any = await this.roomService.findByName(data.room);

    let updatePassword: UpdatePasswordDto;
    updatePassword = {
      id: room.id,
      password: data.password
    }

    await this.roomService.updatePassword(updatePassword);
    this.wss.emit('joined-room');
  }
}
