import { Component,Inject,OnInit, ViewChild } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BarcodeFormat } from '@zxing/library';
import { Location, Time } from '@angular/common';
import { InterviewService } from 'src/app/Services/interview.service';
import { ReadInterviewSlotsComponent } from 'src/app/Administrator/Interview-Slots/read-interview-slots/read-interview-slots/read-interview-slots.component';
import { ExistsDialogComponent } from '../../exists-dialog/exists-dialog/exists-dialog.component';

@Component({
  selector: 'app-scan-dialog',
  templateUrl: './scan-dialog.component.html',
  styleUrls: ['./scan-dialog.component.scss']
})
export class ScanDialogComponent implements OnInit {
allowedFormats = [ BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13, BarcodeFormat.CODE_128, BarcodeFormat.DATA_MATRIX /*, ...*/ ];
@ViewChild('scanner')
scanner!: ZXingScannerComponent;
slot:any;
code!:string;
isLoading!:boolean;

constructor(public dialogRef:MatDialogRef<ScanDialogComponent>,
@Inject(MAT_DIALOG_DATA) public data:any,private snack:MatSnackBar,private service:InterviewService,private dialog:MatDialog) 
{ }

ngOnInit(): void {
this.slot = JSON.parse( sessionStorage['slot'] );
this.code = this.slot.Code;
}

Ok(): void {
this.dialogRef.close();
}

onScanSuccess(result: string): void {
if (result === this.code) {
  this.snack.open(
  'QR Code is valid and matches the interview code!',
        'OK',
        {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 5000,
        });

  this.isLoading=true;
  this.service.ScanQRCode(this.slot.InterviewSlotID).subscribe((res:any)=>{
  if(res.Status === 200)
  {
    this.Ok();
    this.isLoading=false;
    
    this.snack.open(
      'Attendance email to interviewee has been sent!',
            'OK',
            {
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              duration: 8000,
            });
            location.reload();
           // this.data.refreshList();
  }
  else{
    this.isLoading=false;
    const dialogReference = this.dialog.open(ExistsDialogComponent, {
      data: {
        dialogTitle: 'Error',
        dialogMessage: 'Failed to send attendance email. Please try again.',
        operation: 'ok',
      },
      width: '50vw',
      height:'30vh'
    });
  }
})

  } else {
    
    this.snack.open(
      'QR Code invalid or does not match interview code!',
            'OK',
            {
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              duration: 8000,
            });
  }
}



}
