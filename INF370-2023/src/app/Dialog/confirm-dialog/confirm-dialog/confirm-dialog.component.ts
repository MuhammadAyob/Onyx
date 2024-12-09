import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
 
  alertClasses = {
    add: 'success-snackbar',
    edit: 'success-snackbar',
    delete: 'error-snackbar',
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    private alert:MatSnackBar,
    public dialogRef:MatDialogRef<ConfirmDialogComponent>,
  ) { }

  ngOnInit(): void {}

  Confirm()
  {
    this.dialogRef.close(true);
  }

  Cancel()
  {
    this.dialogRef.close(false);
  }


}
