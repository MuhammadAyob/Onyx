import { Component, ViewChild, ElementRef, OnInit} from '@angular/core';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BarcodeFormat } from '@zxing/library';

@Component({
  selector: 'app-scan-code',
  templateUrl: './scan-code.component.html',
  styleUrls: ['./scan-code.component.scss']
})
export class ScanCodeComponent implements OnInit {
allowedFormats = [ BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13, BarcodeFormat.CODE_128, BarcodeFormat.DATA_MATRIX /*, ...*/ ];
@ViewChild('scanner')
scanner!: ZXingScannerComponent;
code = "817033"
constructor(private snackBar: MatSnackBar) { }

ngOnInit(): void {
}

onScanSuccess(result: string): void {
  if (result === this.code) {
    this.snackBar.open('QR code matches your object value.', 'Close');
  } else {
    this.snackBar.open('Invalid QR code.', 'Close');
  }
}


}
