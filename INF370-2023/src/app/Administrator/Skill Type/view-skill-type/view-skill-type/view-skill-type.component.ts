import { SkillType } from 'src/app/Models/skill-type.model';
import { SkillTypeService } from 'src/app/Services/skill-type.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-skill-type',
  templateUrl: './view-skill-type.component.html',
  styleUrls: ['./view-skill-type.component.scss']
})
export class ViewSkillTypeComponent implements OnInit {
  test!: SkillType;
  skillTypeList!: SkillType[];
  id: any;
  
  constructor( 
    public router: Router,
    private location: Location,
    private service: SkillTypeService,
    private dialog: MatDialog,
    private titleservice: Title,
    private snack:MatSnackBar) 
    { this.titleservice.setTitle('Skill Type');}

  ngOnInit(): void {
    this.test = JSON.parse(sessionStorage['skillType']);
  }

  refreshList() {
    this.service.GetSkillTypes().subscribe((result) => {
    this.skillTypeList = result as SkillType[];
  });
}

onBack() {
  this.location.back();
}

onEdit() {
  this.router.navigate(['admin/maintain-skill-type']);
  this.refreshList();
}

onArrowBack() {
  this.location.back();
}

onDelete() {
  const title = 'Confirm Delete Skill Type';
  const message = 'Are you sure you want to delete the Skill Type?';

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
          this.service.DeleteSkillType(this.test.SkillTypeID).subscribe((res:any) => 
          {
            if(res.Status===200)
            {
              this.snack.open(
                'Skill Type deleted successfully!',
                      'OK',
                      {
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        duration: 3000,
                      });
              this.router.navigate(['admin/read-skill-type']);        
            }

            else if(res.Status===500)
            {
              this.dialog.open(
                InputDialogComponent,
                {
                  height: '30vh',
                  width: '50vw',
                  data: {
                    dialogTitle: "Delete Skill Type",
                    dialogMessage: "Skill Type cannot be deleted as it is in use in other parts of the system."
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
