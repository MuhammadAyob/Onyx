import { Component,Inject,OnInit } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-slot-info-dialog',
  templateUrl: './slot-info-dialog.component.html',
  styleUrls: ['./slot-info-dialog.component.scss'],
  providers: [DatePipe],
})
export class SlotInfoDialogComponent implements OnInit {

  constructor(public dialogRef:MatDialogRef<SlotInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,) { }

  ngOnInit(): void {
  }

  Ok(): void {
    this.dialogRef.close();
  }

}
