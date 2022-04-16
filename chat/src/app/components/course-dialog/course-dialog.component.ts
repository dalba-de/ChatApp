import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

  description: string = '';
	seekRoom: string = '';
	Rooms: string[] = [
		"General",
		"Tardis",
		"42Madrid"
	]

  constructor(private dialogRef: MatDialogRef<CourseDialogComponent>,
							@Inject(MAT_DIALOG_DATA) data) {
								this.description = data.title;
							 }

  ngOnInit(): void {
  }

}
