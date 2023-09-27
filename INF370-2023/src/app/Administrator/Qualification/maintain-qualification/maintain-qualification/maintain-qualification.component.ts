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
import { AuditLogService } from 'src/app/Services/audit-log.service';
import { AuditLog } from 'src/app/Models/audit.model';
import { SecurityService } from 'src/app/Services/security.service';

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
  
  isLoading:boolean=false;

  public dataSource = new MatTableDataSource<Qualification>();
  constructor(
    public router: Router,
    private location: Location,
    private dialog: MatDialog,
    private service: QualificationService,
    private titleservice: Title,
    public toastr: ToastrService,
    private snack: MatSnackBar,
    private aService:AuditLogService,
    private security:SecurityService
  ) { this.titleservice.setTitle('Qualifications');}

  ngOnInit(): void {
    this.qualification = JSON.parse( sessionStorage['qualification'] );
  }

 GetHelp(){
  localStorage.removeItem('pageNumber');
  localStorage.setItem('pageNumber', '53');
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
        dialogMessage: "Correct errors on highlighted fields"
      },
      width: '25vw',
      height: '27vh',
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
      this.isLoading=true;
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
            this.isLoading=false;
            this.router.navigate([
              'admin/read-qualification',
            ]);

            let audit = new AuditLog();
            audit.AuditLogID = 0;
            audit.UserID = this.security.User.UserID;
            audit.AuditName = 'Update Qualification';
            audit.Description = 'Employee, ' + this.security.User.Username + ', updated the Qualification: ' + this.qualification.QualificationName
            audit.Date = '';

        this.aService.AddAudit(audit).subscribe((data) => {
        })
          } 

          else if(result.Status===404)
          {
            this.isLoading=false;
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
            this.isLoading=false;
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
            this.isLoading=false;
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
