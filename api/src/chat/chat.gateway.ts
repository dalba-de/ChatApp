import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayDisconnect, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Socket, Server } from "socket.io";
import { Logger } from "@nestjs/common";

@WebSocketGateway({cors: true})
export class ChatGateway implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection {
      
  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('ChatGateway');

  afterInit(server: any) {
    this.logger.log("Initialized!")
  }

  handleConnection(client: any, ...args: any[]) {
    this.logger.log("User Connected!")
  }

  handleDisconnect(client: any) {
    this.logger.log("User Disonnected!")
  }

}
