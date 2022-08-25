import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-password-dialog',
  templateUrl: './password-dialog.component.html',
  styleUrls: ['./password-dialog.component.css']
})
export class PasswordDialogComponent implements OnInit {

  username: string = '';
  showPass: boolean = false;
  newPass: string = '';

  constructor(private dialogRef: MatDialogRef<PasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
      this.username = data.username;
    }

  ngOnInit(): void {
  }

  save() {
    this.dialogRef.close(this.newPass);
  }

  close() {
    this.dialogRef.close();
  }

  public togglePass() {
    this.showPass = !this.showPass;
  }

}
