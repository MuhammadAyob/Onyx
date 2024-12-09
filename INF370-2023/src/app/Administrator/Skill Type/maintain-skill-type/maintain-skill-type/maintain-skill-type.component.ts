import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { SkillTypeService } from 'src/app/Services/skill-type.service';
import { SkillType } from 'src/app/Models/skill-type.model';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuditLogService } from 'src/app/Services/audit-log.service';
import { AuditLog } from 'src/app/Models/audit.model';
import { SecurityService } from 'src/app/Services/security.service';

@Component({
  selector: 'app-maintain-skill-type',
  templateUrl: './maintain-skill-type.component.html',
  styleUrls: ['./maintain-skill-type.component.scss']
})
export class MaintainSkillTypeComponent implements OnInit {

  nameFormControl = new FormControl('', [Validators.required]);
  descFormControl = new FormControl('', [Validators.required]);

  skillType!: SkillType;
  skillTypeList!: SkillType[];
  isLoading!:boolean;

  public dataSource = new MatTableDataSource<SkillType>();
  
  constructor(
    public router: Router,
    private location: Location,
    private dialog: MatDialog,
    private service: SkillTypeService,
    private titleservice: Title,
    public toastr: ToastrService,
    private snack: MatSnackBar ,
    private aService:AuditLogService,
    private security:SecurityService
  ) { this.titleservice.setTitle('Skill Type');}

  ngOnInit(): void {
    this.skillType = JSON.parse(sessionStorage['skillType']);
  }

  GetHelp(){
    localStorage.removeItem('pageNumber');
    localStorage.setItem('pageNumber', '49');
  }

  onBack(): void {
    this.location.back();
  }

  refreshList() {
    this.service.GetSkillTypes().subscribe((result) => {
      this.dataSource.data = result as SkillType[];
    });
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
      const title = 'Confirm Edit skill type';
      const message = 'Are you sure you want to save changes the skill type?';
      this.showDialog(title, message);
    }
  }

  showDialog(title: string, message: string): void {
    const dialogReference = this.dialog.open(ConfirmDialogComponent, {
      data: {
        dialogTitle: title,
        dialogMessage: message
      },
      height: '30vh',
      width: '50vw',
    });

    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        this.isLoading=true;
        this.service
          .UpdateSkillType(this.skillType.SkillTypeID, this.skillType)
          .subscribe((result:any) => {
            if (result.Status===200) 
            {
                this.snack.open('Skill type updated successfully.', 'OK', {
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom',
                  duration: 3000,
                });
                this.isLoading=false;
                this.router.navigate(['admin/read-skill-type']);
                let audit = new AuditLog();
                audit.AuditLogID = 0;
                audit.UserID = this.security.User.UserID;
                audit.AuditName = 'Update Skill Type';
                audit.Description = 'Employee, ' + this.security.User.Username + ', updated the Skill Type: ' + this.skillType.SkillTypeName
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
                    dialogTitle: 'Skill type Exists',
                    dialogMessage: 'Enter a new skill type name',
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
