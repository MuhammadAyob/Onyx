import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { MaintenancePriority } from 'src/app/Models/maintenance-priority.model';
import { MaintenancePriorityService } from 'src/app/Services/maintenance-priority.service';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface DialogData {
  dialogMessage: string;
}

@Component({
  selector: 'app-add-priority',
  templateUrl: './add-priority.component.html',
  styleUrls: ['./add-priority.component.scss']
})
export class AddPriorityComponent implements OnInit {
nameFormControl = new FormControl('', [Validators.required]);
priority!:MaintenancePriority;

constructor(
  public router: Router,
  private location: Location,
  private dialog: MatDialog,
  private service: MaintenancePriorityService,
  public toastr: ToastrService,
  private _snack:MatSnackBar,
  private titleservice: Title
) { this.titleservice.setTitle('Maintenance Priority');}

ngOnInit(): void {
  this.refreshForm();
}

refreshForm() {
  this.priority = {
    MaintenancePriorityID: 0,
    Priority: ''
  };
}

onSubmit() {
  const isInvalid = this.validateFormControls();
  console.log(this.priority)
  if (isInvalid == true) {
    this.dialog.open(InputDialogComponent, {
      data: {
        dialogTitle: "Input Error",
        dialogMessage: "Correct Errors"
      },
      width: '25vw',
      height: '27vh',
    });
  } else {
    const title = 'Confirm New Priority';
    const message = 'Are you sure you want to add the new Priority?';
    this.showDialog(title, message);
  }
}

validateFormControls(): boolean {
  if (
    this.nameFormControl.hasError('required') == false
  )
  {return false}
  else
  {return true}
}

onArrowBack(): void {
  this.location.back();
}

onBack() {
  this.location.back();
}

showDialog(title: string, message: string): void {
  const dialogReference = this.dialog.open(ConfirmDialogComponent, {
    data: {
      dialogTitle: title,
      dialogMessage: message,
      operation: 'add',
      departmentData: this.priority,
    }, //^captured department info here for validation
    height: '30vh',
    width: '50vw',
  });

  dialogReference.afterClosed().subscribe((result) => {
    if (result == true) {
      this.service.AddPriority(this.priority).subscribe(
        (result:any) => {
          console.log(result);
          if(result.Status===200)
          {
            this._snack.open(
              'Maintenance Priority added successfully!',
                    'OK',
                    {
                      horizontalPosition: 'center',
                      verticalPosition: 'bottom',
                      duration: 3000,
                    }
            );
            this.router.navigate(['admin/read-maintenance-priorities']);
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
                width: '25vw',
              }
            );
          }

          else if(result.Status===400)
          {
            const dialogReference = this.dialog.open(
              ExistsDialogComponent,
              {
                data: {
                  dialogTitle: 'Error',
                  dialogMessage: 'Maintenance Priority exists, please enter a different name.',
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
