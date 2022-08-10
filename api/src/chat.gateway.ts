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
import { User } from "./users/entities/user.entity";

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {

  @WebSocketServer() wss: Server;

  constructor (private usersService : UsersService,
               private messagesService: MessagesService,
               private roomService: RoomsService) {}

  private logger: Logger = new Logger('ChatGateway');

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

  handleConnection(client: any, ...args: any[]) {
    this.logger.log("User Connected!");
  }

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

  @SubscribeMessage('mute-user')
  async muteUser(client: Socket, data : {myUser: string, mutedUser: string}) {
    let user: any = await this.usersService.findByName(data.myUser);
    let otherUser: any = await this.usersService.findByName(data.mutedUser);

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

    this.wss.emit('muted-user');
    this.wss.emit('users');
    client.broadcast.to(otherUser.socket).emit('user-mute-you');
  }

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

  @SubscribeMessage('rejoin-room')
  async rejoinRoom(client: Socket, data : {nickname: string}) {
      let rooms: any = await this.roomService.findUsersInRoom(data.nickname);
      for (let i = 0; i < rooms.length; i++) {
          client.join(rooms[i].name);
      }
      this.wss.emit('joined-room');
  }

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
    client.emit('joined-room');
    client.broadcast.to(other_user.socket).emit('joined-room');
  }

//   @SubscribeMessage('create-room')
//   async createRoom(client: Socket, data : {room: string, myUser: string, password: string}) {
//     let user: any = await this.usersService.findByName(data.myUser);
//     let users: any[] = [];

//     users.push({"id": user.id});

//     let newRoom : CreateRoomDto = {
//         name: data.room,
//         private: false,
//         isGroup: true,
//         password: null,
//         users: users,
//         admin: user.id
//     }

//     await this.roomService.create(newRoom);
//     client.join(data.room);
//     this.wss.emit('joined-room');
//   }

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
}
