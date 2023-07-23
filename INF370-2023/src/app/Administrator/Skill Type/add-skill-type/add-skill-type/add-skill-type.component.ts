import { Component, OnInit } from '@angular/core';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { SkillTypeService } from 'src/app/Services/skill-type.service';
import { SkillType } from 'src/app/Models/skill-type.model';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-add-skill-type',
  templateUrl: './add-skill-type.component.html',
  styleUrls: ['./add-skill-type.component.scss']
})
export class AddSkillTypeComponent implements OnInit {
  nameFormControl = new FormControl('', [Validators.required]);
  descFormControl = new FormControl('', [Validators.required]);

  skillType!: SkillType;

  isLoading!:boolean;

  constructor(
    public router: Router,
    private location: Location,
    private dialog: MatDialog,
    private service: SkillTypeService,
    public toastr: ToastrService,
    private snack: MatSnackBar,
    private titleservice: Title
  ) { this.titleservice.setTitle('Skill Type');}

  ngOnInit(): void {
    this.refreshForm();
  }

  refreshForm() {
    this.skillType = {
      SkillTypeID: 0,
      SkillTypeName: '',
      TypeDescription: '',
    };
  }

  onSubmit() {
    const isInvalid = this.validateFormControls();
    if (isInvalid == true) {
      this.dialog.open(InputDialogComponent, {
        data: {
          dialogTitle: "Input Error",
          dialogMessage: "Correct Errors on highlighted fields"
        },
        width: '25vw',
        height: '27vh',
      });
    } else {
      const title = 'Confirm New Skill Type';
      const message = 'Are you sure you want to add the new skill Type?';
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
        skillTypeData: this.skillType,
      }, //^captured department info here for validation
      height: '30vh',
      width: '50vw',
    });

    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        this.isLoading=true;
        this.service.AddSkillType(this.skillType).subscribe(
          (result:any) => {
            if(result.Status===200)
            {
              this.snack.open(
                'Skill Type added successfully!',
                      'OK',
                      {
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        duration: 3000,
                      });
                      this.isLoading=false;
                      this.refreshForm();
                      this.router.navigate(['admin/read-skill-type']);
            }

            else if(result.Status===404)
            {
              this.isLoading=false;
              const dialogReference = this.dialog.open(
                ExistsDialogComponent,
                {
                  data: {
                    dialogTitle: 'Error',
                    dialogMessage: 'Invalid data post, please ensure data is in correct format',
                    operation: 'ok',
                  },
                  height: '30vh',
                  width: '50vw',
                }
              );
            }

            else if(result.Status===400)
            {
              this.isLoading=false;
              const dialogReference = this.dialog.open(
                ExistsDialogComponent,
                {
                  data: {
                    dialogTitle: 'Error',
                    dialogMessage: 'Skill Type exists, please enter a different skill type.',
                    operation: 'ok',
                  },
                  height: '30vh',
                  width: '50vw',
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
                  height: '30vh',
                  width: '50vw',
                }
              );
            }
          }
        );
      }
    });
  }



}
