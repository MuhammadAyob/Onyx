import { Component, OnInit } from '@angular/core';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Qualification } from 'src/app/Models/qualification.model';
import { QualificationService } from 'src/app/Services/qualification.service';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-maintain-qualification',
  templateUrl: './maintain-qualification.component.html',
  styleUrls: ['./maintain-qualification.component.scss']
})
export class MaintainQualificationComponent implements OnInit {
  nameFormControl = new FormControl('', [Validators.required]);
  descFormControl = new FormControl('', [Validators.required]);

  qualification!: Qualification;
  qualificationList!: Qualification[];

  public dataSource = new MatTableDataSource<Qualification>();
  constructor(
    public router: Router,
    private location: Location,
    private dialog: MatDialog,
    private service: QualificationService,
    private titleservice: Title,
    public toastr: ToastrService,
    private snack: MatSnackBar
  ) { this.titleservice.setTitle('Qualifications');}

  ngOnInit(): void {
    this.qualification = JSON.parse( sessionStorage['qualification'] );
 }

 onBack(): void {
  this.location.back();
}

refreshList() {
  this.service.GetQualifications().subscribe((result) => {
    this.dataSource.data = result as Qualification[];
  });
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
    const title = 'Confirm Edit Qualification';
    const message =
      'Are you sure you want to save changes to the Qualification?';
    this.showDialog(title, message);
  }
}

showDialog(title: string, message: string): void {
  const dialogReference = this.dialog.open(ConfirmDialogComponent, {
    data: {
      dialogTitle: title,
      dialogMessage: message,
    },
    height: '30vh',
    width: '50vw',
  });

  dialogReference.afterClosed().subscribe((result) => {
    if (result == true) {
      this.service
        .UpdateQualification(
          this.qualification.QualificationID,
          this.qualification
        )
        .subscribe((result:any) => {
          if (result.Status == 200) 
          {
            this.snack.open(
              'Qualification updated successfully!',
              'OK',
              {
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                duration: 3000,
              }
            );
            this.router.navigate([
              'admin/read-qualification',
            ]);
          } 

          else if(result.Status===404)
          {
            const dialogReference = this.dialog.open(
              ExistsDialogComponent,
              {
                data: {
                  dialogTitle: 'Error',
                  dialogMessage: 'Invalid data post, please ensure data is in correct format.',
                  operation: 'ok',
                },
                width: '50vw',
                height:'30vh'
              }
            );
          }

          else if(result.Status===403)
          {
            const dialogReference = this.dialog.open(
              ExistsDialogComponent,
              {
                data: {
                  dialogTitle: 'Error',
                  dialogMessage: 'Qualification exists, please enter a different qualification',
                  operation: 'ok',
                },
                width: '50vw',
                height:'30vh'
              }
            );
          }

          else
          {
            const dialogReference = this.dialog.open(
              ExistsDialogComponent,
              {
                data: {
                  dialogTitle: 'Error',
                  dialogMessage: 'Internal server error, please try again.',
                  operation: 'ok',
                },
                width: '50vw',
                height:'30vh'
              }
            );
          }
        });
    }
  });
}

validateFormControls(): boolean {
  if (
    this.descFormControl.hasError('required') == false &&
    this.nameFormControl.hasError('required') == false
  )
  {return false}
  else
  {return true}
}

onArrowBack(): void {
  this.location.back();
}


}
