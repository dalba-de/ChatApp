import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ApiService } from "../../services/api.service";

@Component({
  selector: 'app-course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: [
      '../../../assets/css/bootstrap.min.css',
      './course-dialog.component.css'
    ]
})
export class CourseDialogComponent implements OnInit {

  description: string = '';
  allRooms: any = [];
  rooms: any = [];
  username: string = '';
  password: string = '';

  hiddenItems:any={};

  constructor(private apiService: ApiService,
              private dialogRef: MatDialogRef<CourseDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data) {
                this.description = data.title;
                this.allRooms = data.list;
                this.username = data.username;
              }

  ngOnInit(): void {
      for (let i = 0; i < this.allRooms.length; i++) {
          if (this.allRooms[i].isGroup)
            this.rooms.push(this.allRooms[i]);
      }
  }

  joinRoom(name: string) {
    let room: any;

    this.apiService.getRoomByName(name).subscribe((result) => {
        room = result;
        console.log(room)
        for (let i = 0; i < room.users.length; i++) {
          if (room.users[i].name === this.username) {
            window.alert("You are already in the room");
            this.dialogRef.close();
            return ;
          }
        }
        if (room.private) {
          if (this.password === room.password) {
            this.dialogRef.close(name);
            return ;
          }
          else {
            window.alert("Incorrect password, try again!");
            this.dialogRef.close();
            return ;
          }
        }
        else
          this.dialogRef.close(name);
      });
  }

  close() {
    this.dialogRef.close();
  }

}
