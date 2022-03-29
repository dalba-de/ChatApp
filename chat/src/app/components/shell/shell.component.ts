import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ApiService } from "../../services/api.service";
import { IUser } from "../chat/user";

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.css']
})
export class ShellComponent implements OnInit {

  username: string = '';
  errorMsg: string = '';

  constructor(private router : Router, private apiService : ApiService) { }

  ngOnInit() {
    if (sessionStorage.getItem('username')) {
      this.username = sessionStorage.getItem('username')!;
    }
  }

  onClickSubmit() {
    let newUser : IUser = {
      name : this.username
    };

    this.apiService.createUser(newUser).subscribe(
      res => {
        console.log('HTTP response', res);
        sessionStorage.setItem('username', this.username);
        this.router.navigate(['chat']);
      },
      err => {
        this.errorMsg = err.error.message;
        window.alert("Nombre en uso, elija uno diferente");
      },
    )
  }

  toChat() {
    sessionStorage.setItem('username', this.username);
    this.router.navigate(['chat']);
  }

}
