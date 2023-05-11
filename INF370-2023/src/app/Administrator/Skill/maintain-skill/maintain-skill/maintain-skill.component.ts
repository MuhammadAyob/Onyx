import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { SkillTypeService } from 'src/app/Services/skill-type.service';
import { SkillType } from 'src/app/Models/skill-type.model';
import { Skill } from 'src/app/Models/skill.model';
import { SkillService } from 'src/app/Services/skill.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-maintain-skill',
  templateUrl: './maintain-skill.component.html',
  styleUrls: ['./maintain-skill.component.scss']
})
export class MaintainSkillComponent implements OnInit {
  nameFormControl = new FormControl('', [Validators.required]);
  descFormControl = new FormControl('', [Validators.required]);

  skill: any;
  skillList!: Skill[];
  skillTypeList!: SkillType[];
  constructor(
    public router: Router,
    private location: Location,
    private titleservice: Title,
    private serviceT: SkillTypeService,
    private service: SkillService,
    private dialog: MatDialog,
    public toastr: ToastrService,
    private snack: MatSnackBar
  ) { this.titleservice.setTitle('Skills');}

  ngOnInit(): void {
    this.skill = JSON.parse( sessionStorage['skill'] );
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

  onBack(): void {
    this.location.back();
  }

  onSubmit() {
    const isInvalid = this.validateFormControls();
    var NewSkill = new Skill()
    NewSkill.SkillID = this.skill.SkillID,
    NewSkill.SkillName= this.skill.SkillName,
    NewSkill.Description = this.skill.Description,
    NewSkill.SkillTypeID= this.skill.SkillTypeID;

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

    const dialogReference = this.dialog.open(ConfirmDialogComponent, {
      data: {
        dialogTitle: 'Confirm Edit skill',
        dialogMessage: 'Are you sure you want to save changes the skill?',
        operation: 'add',
      },
      height: '27vh',
      width: '25vw',
    });

    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        this.service.UpdateSkill(this.skill.SkillID, NewSkill).subscribe((res:any) =>{
          if(res.Status===200)
          {
            this.snack.open(
              'Skill updated successfully!',
                    'OK',
                    {
                      horizontalPosition: 'center',
                      verticalPosition: 'bottom',
                      duration: 3000,
                    });
                    this.router.navigate(['admin/read-skill']);
          }
          else if(res.Status===400)
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
  {return false}
  else
  {return true}
}

onArrowBack(): void {
  this.location.back();
}

}
