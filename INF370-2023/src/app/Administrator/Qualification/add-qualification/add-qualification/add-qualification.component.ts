import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Qualification } from 'src/app/Models/qualification.model';
import { QualificationService } from 'src/app/Services/qualification.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-qualification',
  templateUrl: './add-qualification.component.html',
  styleUrls: ['./add-qualification.component.scss']
})
export class AddQualificationComponent implements OnInit {
  nameFormControl = new FormControl('', [Validators.required]);
  descFormControl = new FormControl('', [Validators.required]);

  qualification!:Qualification;
  
  constructor(
    public router: Router,
    private location: Location,
    private dialog: MatDialog,
    private service: QualificationService,
    public toastr: ToastrService,
    private snack: MatSnackBar,
    private titleservice: Title
  ) { this.titleservice.setTitle('Qualification'); }

  ngOnInit(): void {
    this.refreshForm();
  }

  refreshForm() {
    this.qualification = {
      QualificationID: 0,
      QualificationName: '',
      Description: ''
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
        width: '50vw',
        height: '30vh',
      });
    } else {
      const title = 'Confirm New qualification';
      const message = 'Are you sure you want to add the new qualification?';
      this.showDialog(title, message);
    }
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


  onBack() {
    this.location.back();
  }

  showDialog(title: string, message: string): void {
    const dialogReference = this.dialog.open(ConfirmDialogComponent, {
      data: {
        dialogTitle: title,
        dialogMessage: message,
        operation: 'add',
        qualificationData: this.qualification,
      }, //^captured department info here for validation
      height: '30vh',
      width: '50vw',
    });

    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        this.service.AddQualification(this.qualification).subscribe(
          (result:any) => {
            if(result.Status===200)
            {
              this.snack.open(
                'Qualification added successfully!',
                      'OK',
                      {
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        duration: 3000,
                      }
              );
              this.qualification = result as Qualification;
              this.refreshForm();
              this.router.navigate(['admin/read-qualification']);
            }

            else if(result.Status===403)
            {
              const dialogReference = this.dialog.open(
                ExistsDialogComponent,
                {
                  data: {
                    dialogTitle: 'Error',
                    dialogMessage: 'Invalid data post, please ensure data is in correct format',
                    operation: 'ok',
                  },
                  width: '50vw',
                  height:'30vh'
                }
              );
            }

            else if(result.Status===404)
            {
              const dialogReference = this.dialog.open(
                ExistsDialogComponent,
                {
                  data: {
                    dialogTitle: 'Qualification Exists',
                    dialogMessage: 'Enter a different qualification name',
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
           
          }
        );
      }
    });
  }

}
