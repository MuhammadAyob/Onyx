import { SkillType } from 'src/app/Models/skill-type.model';
import { SkillTypeService } from 'src/app/Services/skill-type.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { SkillService } from 'src/app/Services/skill.service';
import { Skill } from 'src/app/Models/skill.model';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component'; 
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-skill',
  templateUrl: './add-skill.component.html',
  styleUrls: ['./add-skill.component.scss']
})
export class AddSkillComponent implements OnInit {
  nameFormControl = new FormControl('', [Validators.required]);
  descFormControl = new FormControl('', [Validators.required]);

  skill! : Skill;

  skillTypeList!: SkillType[];

  constructor(
    public router: Router,
    private location: Location,
    private titleservice: Title,
    private serviceT: SkillTypeService,
    private service: SkillService,
    private dialog: MatDialog,
    public toastr: ToastrService,
    private snack: MatSnackBar,
  ) { this.titleservice.setTitle('Skills');}

  ngOnInit(): void {
    this.refreshForm();
    this.getTypeList();
  }

  getTypeList() {
    this.serviceT.GetSkillTypes().subscribe((result) => {
      this.skillTypeList = result as SkillType[];
    });
  }

  selectType($event:any) {
    this.skill.SkillTypeID = $event;
  }

  refreshForm() {
    this.skill = {
      SkillID: 0,
      SkillTypeID: 0,
      SkillName: '',
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
    const dialogReference = this.dialog.open(ConfirmDialogComponent, {
      data: {
        dialogTitle: 'Confirm New Skill',
        dialogMessage: 'Are you sure you want to add the new skill?',
        operation: 'add',
        skillData: this.skill,
      }, //^captured department info here for validation
      height: '30vh',
      width: '50vw',
    });

    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        this.service.AddSkill(this.skill).subscribe(
          (result:any) => {
            if(result.Status === 200)
            {
              this.snack.open(
                'Skill added successfully!',
                      'OK',
                      {
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        duration: 3000,
                      });
              this.skill = result as Skill;
              this.refreshForm();
              this.router.navigate(['admin/read-skill']);
            }
            else if(result.Status===404)
            {
              const dialogReference = this.dialog.open(
                ExistsDialogComponent,
                {
                  data: {
                    dialogTitle: 'Error',
                    dialogMessage: 'Invalid data',
                    operation: 'ok',
                  },
                  width: '25vw',
                }
              );
            }

            else if(result.Status===405)
            {
              const dialogReference = this.dialog.open(
                ExistsDialogComponent,
                {
                  data: {
                    dialogTitle: 'Skill Exists',
                    dialogMessage: 'Enter a new skill name',
                    operation: 'ok',
                  },
                  width: '25vw',
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
                    dialogMessage: 'Internal server error, please try again',
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

  validateFormControls(): boolean {
    if (
      this.descFormControl.hasError('required') == false &&
      this.nameFormControl.hasError('required') == false
    )
    {return(false)}
    else
    {return(true)}
  }

  onArrowBack(): void {
    this.location.back();
  }
  onBack() {
    this.location.back();
  }

}
