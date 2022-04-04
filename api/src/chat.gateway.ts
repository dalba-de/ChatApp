import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Logger } from "@nestjs/common";
import { Socket, Server } from "socket.io";
import { UsersService } from "./users/users.service";
import { MessagesService } from "./messages/messages.service";
import { CreateUserDto } from "./users/dto/create-user.dto";
import { UpdateUserDto } from "./users/dto/update-user.dto";
import { CreateMessageDto } from "./messages/dto/create-message.dto";
import { User } from "./users/entities/user.entity";

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {

  @WebSocketServer() wss: Server;

  constructor (private usersService : UsersService,
               private messagesService: MessagesService) {}

  private logger: Logger = new Logger('ChatGateway');

  afterInit(server: any) {
    this.logger.log("Initialized!")
  }

  handleConnection(client: any, ...args: any[]) {
    this.logger.log("User Connected!");
  }

  handleDisconnect(client: any) {
    this.logger.log("User Disconnected!")
  }

  @SubscribeMessage('set-user')
  setUser(client: Socket, data : {nickname: string}) {

    let newUser : CreateUserDto;
    newUser = {
      socket : client.id,
      name : data.nickname
    }

    this.usersService.create(newUser);
    this.wss.emit('users');
    this.logger.log("User created!")
  }

  @SubscribeMessage('update-user')
  updateUser(client: Socket, data : {nickname : string, id : number}) {
    let updateUser : UpdateUserDto;
    updateUser = {
      id: data.id,
      socket : client.id
    }
    this.usersService.updateUser(updateUser);
  }

  @SubscribeMessage('chatToServer')
  async handleMessage(client: Socket, message: {sender: string, room: string, message: string}) {
    // let users : any = await this.usersService.findAll();
    // let id : number;  
    // for (let i = 0; i < users.length; i++) {
    //   if (users[i].name === message.sender)
    //     id = users[i].id;
    // }
    let user : any = await this.usersService.findByName(message.sender);

    let newMsg: any = {
      user: user.id,
      room: 'General',
      message: message.message
    }
    await this.messagesService.create(newMsg);

    this.wss.emit('chatToClient', {text: message.message, room: message.room, from: message.sender, created: new Date()});
  }
}
