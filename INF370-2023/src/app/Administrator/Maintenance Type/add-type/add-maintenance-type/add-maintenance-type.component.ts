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
import { MaintenanceType } from 'src/app/Models/maintenance-type.model';
import { MaintenanceTypeService } from 'src/app/Services/maintenance-type.service';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface DialogData {
  dialogMessage: string;
}

@Component({
  selector: 'app-add-maintenance-type',
  templateUrl: './add-maintenance-type.component.html',
  styleUrls: ['./add-maintenance-type.component.scss']
})
export class AddMaintenanceTypeComponent implements OnInit {
nameFormControl = new FormControl('', [Validators.required]);
type!:MaintenanceType;

constructor(
  public router: Router,
    private location: Location,
    private dialog: MatDialog,
    private service: MaintenanceTypeService,
    public toastr: ToastrService,
    private _snack:MatSnackBar,
    private titleservice: Title
) { this.titleservice.setTitle('Maintenance Type');}


/////
  ngOnInit(): void {
    this.refreshForm();
  }

  refreshForm() {
    this.type = {
      MaintenanceTypeID: 0,
      Type: ''
    };
  }

  onSubmit() {
    const isInvalid = this.validateFormControls();
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
      const title = 'Confirm New Type';
      const message = 'Are you sure you want to add the new Type?';
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
        departmentData: this.type,
      }, //^captured department info here for validation
      height: '30vh',
      width: '50vw',
    });

    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        this.service.AddType(this.type).subscribe(
          (result:any) => {
            console.log(result);
            if(result.Status===200)
            {
              this._snack.open(
                'Maintenance Type added successfully!',
                      'OK',
                      {
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        duration: 3000,
                      }
              );
              this.router.navigate(['admin/read-maintenance-types']);
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

            else if(result.Status===400)
            {
              const dialogReference = this.dialog.open(
                ExistsDialogComponent,
                {
                  data: {
                    dialogTitle: 'Error',
                    dialogMessage: 'Maintenance Type exists in database, please enter a different name.',
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
                  width: '25vw',
                }
              );
            }

            
          }
        );
      }
    });
  }

}
