import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Logger } from "@nestjs/common";
import { Socket, Server } from "socket.io";
import { UsersService } from "./users/users.service";
import { CreateUserDto } from "./users/dto/create-user.dto";
import { UpdateUserDto } from "./users/dto/update-user.dto";

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {

  @WebSocketServer() wss: Server;

  constructor (private usersService : UsersService) {}

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

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
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
      socket : client.id,
      // name : data.nickname
    }
    this.usersService.updateUser(updateUser);
  }
}
