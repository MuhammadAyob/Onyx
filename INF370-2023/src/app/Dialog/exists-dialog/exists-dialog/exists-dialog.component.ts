import { Component,Inject,OnInit } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-exists-dialog',
  templateUrl: './exists-dialog.component.html',
  styleUrls: ['./exists-dialog.component.scss']
})
export class ExistsDialogComponent implements OnInit {

  constructor(
    public dialogRef:MatDialogRef<ExistsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
  ) { }

  ngOnInit(): void {
  }
  
  Ok(): void {
    this.dialogRef.close();
  }
}
