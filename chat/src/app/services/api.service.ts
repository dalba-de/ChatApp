import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { IUser } from "../components/chat/user";
import { updateRoom } from "../components/chat/updateRoom";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient : HttpClient) { }

  API_SERVER = "http://localhost:3000";

  /**
   * Crea un nuevo usuario.
   */
  public createUser(user: IUser) {
    return this.httpClient.post(`${this.API_SERVER}/users/create`, user);
  }
  
  /**
   * Devuelve todos los clientes de la base de datos.
   */
  public getUsers() {
    return this.httpClient.get(`${this.API_SERVER}/users/`);
  }

  /**
   * Devuelve todas las salas de la base de datos.
   */
  public getGroups() {
    return this.httpClient.get(`${this.API_SERVER}/rooms/`);
  }

  /**
   * Devuelve todos los mensajes de la base de datos.
   */
  public getMessages() {
    return this.httpClient.get(`${this.API_SERVER}/messages`);
  }

  /**
   * Devuelve todos los mensajes de una sala, pasando como parametro
   * el nombre de la sala.
   */
  public getMessagesByRoom(name: string) {
    return this.httpClient.get(`${this.API_SERVER}/messages/${name}/room`, {
      params: {
          name: name
      }
  })
  }

  /**
   * Devuelve un usuario completo, pasando como parametro su
   * nombre de usuario.
   */
  public getUserByName(name: string) {
    return this.httpClient.get(`${this.API_SERVER}/users/${name}/name`, {
      params: {
          name: name
      }
  })
  }

  /**
   * Actualiza a los usuarios de una sala (Usado desde backend)
   */
  public updateRoomUsers(room: updateRoom) {
    return this.httpClient.post(`${this.API_SERVER}/rooms/update`, room);
  }

  /**
   * Devuelve las salas de un usuario concreto, se envia
   * parametro con el nombre de usuario.
   */
  public getRoomsbyUser(name: string) {
    return this.httpClient.get(`${this.API_SERVER}/rooms/${name}/users`, {
      params: {
        name: name
      }
    })
  }

  /**
   * Devuelve una sala pasando como parámetro el nombre de la sala
name: string   */
  public getRoomByName(name: string) {
      return this.httpClient.get(`${this.API_SERVER}/rooms/${name}/name`, {
          params: {
              name: name
          }
      })
  }

  /**
   * Devuelve una sala privada si el password es correcto
   */
  public getAuthenticatedRooom(name: string, password: string) {
    return this.httpClient.get(`${this.API_SERVER}/rooms/${name}/name/${password}/password`, {
      params: {
          name: name,
          password: password
      }
  })
  }
}
