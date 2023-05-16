import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { MaintenancePriority } from 'src/app/Models/maintenance-priority.model';
import { MaintenancePriorityService } from 'src/app/Services/maintenance-priority.service';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-maintain-priority',
  templateUrl: './maintain-priority.component.html',
  styleUrls: ['./maintain-priority.component.scss']
})
export class MaintainPriorityComponent implements OnInit {
nameFormControl = new FormControl('',[Validators.required]);

priority!:MaintenancePriority;
prioritylist!:MaintenancePriority[];
  
public dataSource = new MatTableDataSource<MaintenancePriority>();

constructor(
  public router:Router,
  private location:Location,
  private dialog:MatDialog,
  private service:MaintenancePriorityService,
  private titleservice:Title,
  public toastr: ToastrService,
  private snack:MatSnackBar
) {this.titleservice.setTitle('Maintenance Priority'); }

ngOnInit(): void {
    this.priority=JSON.parse(sessionStorage['MaintenancePriority'])
}

onBack(): void {
    this.location.back();
}

refreshList() {
  this.service.GetPriorities().subscribe((result) => {
    this.dataSource.data = result as MaintenancePriority[];
  });
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
    const title = 'Confirm Edit Priority';
    const message = 'Are you sure you want to save changes to the Priority?';
    const popupMessage = 'Department changes successful!';
    this.showDialog(title, message, popupMessage);
  }
}

showDialog(title: string, message: string, popupMessage: string): void {
  const dialogReference = this.dialog.open(ConfirmDialogComponent, {
    data: {
      dialogTitle: title,
      dialogMessage: message,
      dialogPopupMessage: popupMessage,
      operation: 'add',
      departmentData: this.priority,
    }, //^captured department info here for validation
    height: '30vh',
    width: '50vw',
  });

  dialogReference.afterClosed().subscribe((result) => {
    if (result == true) {
      this.service
        .UpdatePriority(this.priority.MaintenancePriorityID, this.priority)
        .subscribe((result:any) => {
          if (result.Status === 200) 
          {
            this.snack.open(
              'Maintenance Priority updated successfully!',
                    'OK',
                    {
                      horizontalPosition: 'center',
                      verticalPosition: 'bottom',
                      duration: 3000,
                    }
            );
            this.router.navigate(['admin/read-maintenance-priorities']);

          } 
          else if(result.Status===400)
          {
            const dialogReference = this.dialog.open(
              ExistsDialogComponent,
              {
                data: {
                  dialogTitle: 'Error',
                  dialogMessage: 'Invalid data posted, please ensure correct data format',
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
                  dialogTitle: 'Error',
                  dialogMessage: 'Maintenance Priority exists, please enter a different name',
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
                  dialogMessage: 'Can not establish connection to database. Please try again',
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
