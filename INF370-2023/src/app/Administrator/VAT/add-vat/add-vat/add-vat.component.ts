import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { VERSION, ViewChild, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VAT } from 'src/app/Models/vat.model';
import { VATService } from 'src/app/Services/vat.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-vat',
  templateUrl: './add-vat.component.html',
  styleUrls: ['./add-vat.component.scss']
})
export class AddVatComponent implements OnInit {

  
vatFormControl = new FormControl('', [Validators.required,Validators.min(0),Validators.max(100)]);
vat!:VAT;
currentDate!: Date;
isLoading:boolean=false;
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
  this.refreshForm();
 
}


setDateLogged(){
  this.currentDate = new Date();
  this.vat.VatDate = this.currentDate;
}

refreshForm() {
  this.vat = {
   VatID:0,
   VatDate: new Date,
   VatAmount:0
  };
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
    const title = 'Confirm New VAT';
    const message = 'Are you sure you want to add the new VAT Amount?';
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
    }, //^captured vat info here for validation
    height: '30vh',
    width: '50vw',
  });

  dialogReference.afterClosed().subscribe((result) => {
    if (result == true) {
      this.isLoading=true
      this.service.AddVAT(this.vat).subscribe(
        (result:any) => {
          console.log(result);
          if(result.Status===200)
          {
            this._snack.open(
              'VAT added successfully!',
                    'OK',
                    {
                      horizontalPosition: 'center',
                      verticalPosition: 'bottom',
                      duration: 3000,
                    }
            );
            this.router.navigate(['admin/read-vat']);
            this.isLoading=false;
          }

          else if(result.Status===404)
          {
            this.isLoading=false;
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

          else if(result.Status===500)
          {
            this.isLoading=false;
            const dialogReference = this.dialog.open(
              ExistsDialogComponent,
              {
                data: {
                  dialogTitle: 'Input error',
                  dialogMessage: 'VAT Amount cannot be the same as current amount, please enter a different %.',
                  operation: 'ok',
                },
                width: '50vw',
                height:'30vh'
              }
            );
          }

          else if(result.Status===501)
          {
            this.isLoading=false;
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

          else
          {
            this.isLoading=false;
            console.log(result);
            const dialogReference = this.dialog.open(
              ExistsDialogComponent,
              {
                data: {
                  dialogTitle: 'Error',
                  dialogMessage: 'Can not establish connection. Please try again',
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
