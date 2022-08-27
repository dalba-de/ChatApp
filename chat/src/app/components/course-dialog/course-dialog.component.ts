import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ApiService } from "../../services/api.service";
import { NgToastService } from "ng-angular-popup";

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
              private toast: NgToastService,
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

    if (this.password === '') {
      this.apiService.getRoomByName(name).subscribe((result) => {
          room = result;
          console.log(room)
          for (let i = 0; i < room.users.length; i++) {
            if (room.users[i].name === this.username) {
              this.toast.warning({detail:'You are already in the room', summary: 'Select a different channel', duration: 5000})
              this.dialogRef.close();
              return ;
            }
          }
          this.dialogRef.close(name);
        });
    }
    else {
      this.apiService.getAuthenticatedRooom(name, this.password)
      .subscribe(
        (result) => {
          room = result;
          console.log(result);
          this.dialogRef.close(name);
        },
        (error) => {
          console.error(error);
          this.toast.error({detail: 'Incorrect Password', summary: 'Try again', duration: 5000});
          this.dialogRef.close();
        }
      );
    }
      
  }

  close() {
    this.dialogRef.close();
  }

}
