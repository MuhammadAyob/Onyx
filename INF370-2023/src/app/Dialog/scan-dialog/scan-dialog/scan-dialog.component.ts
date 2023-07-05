import { Component,Inject,OnInit, ViewChild } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BarcodeFormat } from '@zxing/library';

@Component({
  selector: 'app-scan-dialog',
  templateUrl: './scan-dialog.component.html',
  styleUrls: ['./scan-dialog.component.scss']
})
export class ScanDialogComponent implements OnInit {
allowedFormats = [ BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13, BarcodeFormat.CODE_128, BarcodeFormat.DATA_MATRIX /*, ...*/ ];
@ViewChild('scanner')
scanner!: ZXingScannerComponent;
code!:string;

constructor(public dialogRef:MatDialogRef<ScanDialogComponent>,
@Inject(MAT_DIALOG_DATA) public data:any,private snack:MatSnackBar) 
{ }

ngOnInit(): void {
this.code = JSON.parse( sessionStorage['Code'] );
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
              duration: 8000,
            });
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
