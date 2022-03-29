import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.css']
})
export class ShellComponent implements OnInit {

  username: string = '';

  constructor(private router : Router) { }

  ngOnInit() {
    if (sessionStorage.getItem('username'))
      this.router.navigate(['chat']);
  }

  onClickSubmit() {
    sessionStorage.setItem('username', this.username);
    this.router.navigate(['chat']);
  }

}
