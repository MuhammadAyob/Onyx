import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { Skill } from 'src/app/Models/skill.model';
import { SkillService } from 'src/app/Services/skill.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuditLogService } from 'src/app/Services/audit-log.service';
import { AuditLog } from 'src/app/Models/audit.model';
import { SecurityService } from 'src/app/Services/security.service';

@Component({
  selector: 'app-view-skill',
  templateUrl: './view-skill.component.html',
  styleUrls: ['./view-skill.component.scss']
})
export class ViewSkillComponent implements OnInit {
  test: any;
  id: any;
  skillTypeName:any;

  constructor(
    public router: Router,
    private location: Location,
    private service: SkillService,
    private dialog: MatDialog,
    private titleservice: Title,
    private snack:MatSnackBar,
    private toastr: ToastrService,
    private aService:AuditLogService,
    private security:SecurityService
  ) { this.titleservice.setTitle('Skill');}

  ngOnInit(): void {
    this.test = JSON.parse( sessionStorage['skill'] );
    this.skillTypeName = this.test.skillTypeName;
  }

  onBack() {
    this.location.back();
  }

  onEdit() {
    this.router.navigate(['admin/maintain-skill']);
  }

  onDelete() {
    const title = 'Confirm Delete Skill';
    const message = 'Are you sure you want to delete the Skill?';

    const dialogReference = this.dialog.open(
          ConfirmDialogComponent,
          {
            height: '30vh',
            width: '50vw',
            data: {
              dialogTitle: title,
              operation: 'delete',
              dialogMessage: message,
            },
          }
        );
        dialogReference.afterClosed().subscribe((result) => {
          if (result == true) {
            this.service.DeleteSkill(this.test.SkillID).subscribe((res:any) => 
            {
              if(res.Status===200)
              {
                this.snack.open(
                  'Skill deleted successfully!',
                        'OK',
                        {
                          horizontalPosition: 'center',
                          verticalPosition: 'bottom',
                          duration: 3000,
                        });
                this.router.navigate(['admin/read-skill']);   
                let audit = new AuditLog();
                audit.AuditLogID = 0;
                audit.UserID = this.security.User.UserID;
                audit.AuditName = 'Delete Skill';
                audit.Description = 'Employee, ' + this.security.User.Username + ', deleted the Skill: ' + this.test.SkillName + ' - ' + this.test.skillTypeName
                audit.Date = '';
  
            this.aService.AddAudit(audit).subscribe((data) => {
            })            
              }

              else if(res.Status===501)
              {
                this.dialog.open(
                  InputDialogComponent,
                  {
                    height: '30vh',
                    width: '50vw',
                    data: {
                      dialogTitle: "Delete Skill",
                      dialogMessage: "Skill cannot be deleted as it is in use in other parts of the system."
                    },
                  }
                );
              }

              else
              {
                this.dialog.open(
                  InputDialogComponent,
                  {
                    height: '30vh',
                    width: '50vw',
                    data: {
                      dialogTitle: "Error",
                      dialogMessage: "Internal server error, please try again."
                    },
                  }
                );
              }
            
            });
          }
        });
      }

}
