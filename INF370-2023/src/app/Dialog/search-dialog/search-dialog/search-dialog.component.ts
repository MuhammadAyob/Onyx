import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.scss']
})
export class SearchDialogComponent implements OnInit {

  constructor(public dialogRef:MatDialogRef<SearchDialogComponent>) { }

  ngOnInit(): void {
  }
  
  Ok(){
    this.dialogRef.close(true);
  }
}
