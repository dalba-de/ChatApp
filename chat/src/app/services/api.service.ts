import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { IUser } from "../components/chat/user";
import { updateRoom } from "../components/chat/updateRoom";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  token: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NjE5NjEzNzksImV4cCI6MTY2MjU2NjE3OX0.WACiEZjA1iq1YhB0VthuL92O_Er2lEXg_B27LnPxo3Y';

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.token}`
  })

  constructor(private httpClient : HttpClient) { }

  API_SERVER = environment.url;

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
   * Devuelve las salas de las que el usuario es administrador
   */
  public getAdminRooms(name: string) {
    return this.httpClient.get(`${this.API_SERVER}/rooms/${name}/admins`, {
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
   * Elimina una sala pasando como parámetro su id
   */
  public deleteRoom(id: number) {
    return this.httpClient.delete(`${this.API_SERVER}/rooms/${id}`, {
      params: {
          id: id
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

  /**
   * Devuelve el token necesario para hacer las llamadas a la api
   */
  public getToken(name: string) {
    return this.httpClient.post(`${this.API_SERVER}/auth/login`, {
      params: {
          name: name
      }
  }) 
  }
}
