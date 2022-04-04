import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { IUser } from "../components/chat/user";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient : HttpClient) { }

  API_SERVER = "http://localhost:3000";

  public createUser(user: IUser) {
    return this.httpClient.post(`${this.API_SERVER}/users/create`, user);
  }
  
  public getUsers() {
    return this.httpClient.get(`${this.API_SERVER}/users/`);
  }

  public getGroups() {
    return this.httpClient.get(`${this.API_SERVER}/groups/`);
  }

  public getMessages() {
    return this.httpClient.get(`${this.API_SERVER}/messages`);
  }

  public getUserByName(name: string) {
    return this.httpClient.get(`${this.API_SERVER}/users/${name}/name`, {
      params: {
          name: name
      }
  })
  }
}
