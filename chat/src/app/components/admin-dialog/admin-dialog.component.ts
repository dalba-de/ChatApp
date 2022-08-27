import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {  FormBuilder,
          FormGroup,
          FormArray,
          FormControl,
          ValidatorFn } from '@angular/forms';
import { ApiService } from "../../services/api.service";

@Component({
  selector: 'app-admin-dialog',
  templateUrl: './admin-dialog.component.html',
  styleUrls: ['./admin-dialog.component.css']
})
export class AdminDialogComponent implements OnInit {

  username: string = '';
  room: string = '';
  adminsRoom: string[] = [];
  form: FormGroup;
  users: any[] = [];
  adminersData: any = [];

  constructor(private apiService: ApiService,
    private formBuilder : FormBuilder,
    private dialogRef: MatDialogRef<AdminDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
      this.username = data.username;
      this.room = data.room;
      this.form = this.formBuilder.group({
        adminers: new FormArray([])
      });
     }

  ngOnInit(): void {
    this.apiService.getRoomByName(this.room).subscribe((result) => {
      let temp: any = result;

      for (let i = 0; i < temp.admins.length; i++) {
        this.adminsRoom.push(temp.admins[i].name);
      }
      console.log(this.adminsRoom);
    });
    
    this.apiService.getUsers().subscribe((result) => {
      this.adminersData = result;
      this.addCheckboxes();
    });
  }

  close() {
    this.dialogRef.close();
  }

  get ordersFormArray() {
    return this.form.controls.adminers as FormArray;
  }

  private addCheckboxes() {
    this.adminersData.forEach(() => this.ordersFormArray.push(new FormControl(false)));
  }

  submit() {
    const selectedOrderIds = this.form.value.adminers
      .map((checked, i) => checked ? this.adminersData[i].name : null)
      .filter(v => v !== null);
    this.dialogRef.close(selectedOrderIds);
  }

}
