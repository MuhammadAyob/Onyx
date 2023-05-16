import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { VAT } from 'src/app/Models/vat.model';
import { VATService } from 'src/app/Services/vat.service';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-maintain-vat',
  templateUrl: './maintain-vat.component.html',
  styleUrls: ['./maintain-vat.component.scss']
})
export class MaintainVATComponent implements OnInit {

vatFormControl = new FormControl('', [Validators.required,Validators.min(0),Validators.max(100)]);
vat!:VAT;

constructor( 
  public router: Router,
  private location: Location,
  private dialog: MatDialog,
  private service: VATService,
  public toastr: ToastrService,
  private _snack:MatSnackBar,
  private titleservice: Title
) { this.titleservice.setTitle('VAT');}

ngOnInit(): void {
  this.vat=JSON.parse(sessionStorage['VAT']);
}

onBack() {
  this.router.navigate(['admin/read-vat']);
}

onArrowBack() {
  this.location.back();
}


onSubmit() {
  const isInvalid = this.validateFormControls();
  if (isInvalid == true) {
    this.dialog.open(InputDialogComponent, {
      data: {
        dialogTitle: "Input Error",
        dialogMessage: "Correct Errors"
      },
      width: '50vw',
      height: '30vh',
    });
  } else {
    const title = 'Confirm Edit VAT';
    const message = 'Are you sure you want to edit the VAT Amount?';
    this.showDialog(title, message);
  }
}

validateFormControls(): boolean {
  if (
    this.vatFormControl.hasError('required') == false &&
    this.vatFormControl.hasError('min') == false &&
    this.vatFormControl.hasError('max') == false
  )
  {return false}
  else
  {return true}
}

showDialog(title: string, message: string): void {
  const dialogReference = this.dialog.open(ConfirmDialogComponent, {
    data: {
      dialogTitle: title,
      dialogMessage: message,
      operation: 'add',
      departmentData: this.vat,
    }, //^captured department info here for validation
    height: '30vh',
    width: '50vw',
  });

  dialogReference.afterClosed().subscribe((result) => {
    if (result == true) {
      this.service.UpdateVAT(this.vat.VatID, this.vat).subscribe(
        (result:any) => {
          console.log(result);
          if(result.Status===200)
          {
            this._snack.open(
              'VAT updated successfully!',
                    'OK',
                    {
                      horizontalPosition: 'center',
                      verticalPosition: 'bottom',
                      duration: 3000,
                    }
            );
            this.router.navigate(['admin/read-vat']);
          }

          else if(result.Status===404)
          {
            const dialogReference = this.dialog.open(
              ExistsDialogComponent,
              {
                data: {
                  dialogTitle: 'Error',
                  dialogMessage: 'Invalid data request, please ensure data body is valid',
                  operation: 'ok',
                },
                width: '50vw',
                height:'30vh'
              }
            );
          }

          else if(result.Status===50)
          {
            const dialogReference = this.dialog.open(
              ExistsDialogComponent,
              {
                data: {
                  dialogTitle: 'Error',
                  dialogMessage: 'VAT Amount cannot be the same as the previous and next immediate date record.',
                  operation: 'ok',
                },
                width: '50vw',
                height:'30vh'
              }
            );
          }

          else if(result.Status===150)
          {
            const dialogReference = this.dialog.open(
              ExistsDialogComponent,
              {
                data: {
                  dialogTitle: 'Error',
                  dialogMessage: 'VAT Value cannot be the same as previous date record, please enter a different amount',
                  operation: 'ok',
                },
                width: '50vw',
                height:'30vh'
              }
            );
          }
          else if(result.Status===250)
          {
            const dialogReference = this.dialog.open(
              ExistsDialogComponent,
              {
                data: {
                  dialogTitle: 'Error',
                  dialogMessage: 'VAT Value cannot be the same as the next immeediate date record, please enter a different amount',
                  operation: 'ok',
                },
                width: '50vw',
                height:'30vh'
              }
            );
          }
          else
          {
            console.log(result);
            const dialogReference = this.dialog.open(
              ExistsDialogComponent,
              {
                data: {
                  dialogTitle: 'Error',
                  dialogMessage: 'Internal server error. Please try again',
                  operation: 'ok',
                },
                width: '50vw',
                height:'30vh'
              }
            );
          }

          
        }
      );
    }
  });
}

}
