import { SecurityService } from 'src/app/Services/security.service';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { VERSION, ViewChild, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Maintenance } from 'src/app/Models/maintenance.model';
import { MaintenanceService } from 'src/app/Services/maintenance.service';
import { MaintenanceType } from 'src/app/Models/maintenance-type.model';
import { MaintenanceTypeService } from 'src/app/Services/maintenance-type.service';
import { MaintenancePriority } from 'src/app/Models/maintenance-priority.model';
import { MaintenancePriorityService } from 'src/app/Services/maintenance-priority.service';
import { MatDialog } from '@angular/material/dialog';
import { AuditLog } from 'src/app/Models/audit.model';
import { AuditLogService } from 'src/app/Services/audit-log.service';

@Component({
  selector: 'app-log-maintenance-request',
  templateUrl: './log-maintenance-request.component.html',
  styleUrls: ['./log-maintenance-request.component.scss']
})
export class LogMaintenanceRequestComponent implements OnInit {
locationFormControl = new FormControl('', [Validators.required]);
descFormControl = new FormControl('', [Validators.required]);
priorityFormControl = new FormControl('', [Validators.required]);
typeFormControl = new FormControl('', [Validators.required]);
imgFormControl = new FormControl('', [Validators.required]);

maintenance!: Maintenance;
maintenanceTypeList!: MaintenanceType[];
maintenancePriorityList!: MaintenancePriority[];
currentDate!: Date;
isLoading!:boolean;

constructor( 
  public router: Router,
  public formbuilder: FormBuilder,
  private location: Location,
  private dialog: MatDialog,
  public toastr: ToastrService,
  private snack: MatSnackBar,
  private titleservice: Title,
  private service: MaintenanceService,
  private serviced: MaintenanceTypeService,
  private serviceP: MaintenancePriorityService,
  private security: SecurityService,
  private aService:AuditLogService
  ) {this.titleservice.setTitle('Maintenance'); }

ngOnInit(): void {
  this.refreshForm();
  this.getMaintenanceTypeList();
  this.getMaintenancePriorityList();
}

GetHelp(){
  localStorage.removeItem('pageNumber');
  localStorage.setItem('pageNumber', '30');
}

getMaintenanceTypeList() {
  this.serviced.GetTypes().subscribe((result) => {
    this.maintenanceTypeList = result as MaintenanceType[];
  });
}

getMaintenancePriorityList() {
  this.serviceP.GetPriorities().subscribe((result) => {
    this.maintenancePriorityList = result as MaintenancePriority[];
  });
}

setDateLogged(){
  this.currentDate = new Date();
  this.maintenance.DateLogged = this.currentDate;
}

selectType($event:any) {
  this.maintenance.MaintenanceTypeID = $event;
}

selectPriority($event:any) {
  this.maintenance.MaintenancePriorityID = $event;
}

refreshForm() {
  this.maintenance = {
    MaintenanceID: 0,
    Location: '',
    DateLogged: new Date,
    Image: '',
    UserID: 0,
    Description: '',
    MaintenanceTypeID: 0,
    MaintenancePriorityID: 0,
    MaintenanceStatusID: 0,
    DateResolved: null
  };
}

onBack() {
  this.location.back();
}

onArrowBack() {
  this.location.back();
}

validateFormControls(): boolean {
  return (
    this.descFormControl.hasError('required') ||
    this.locationFormControl.hasError('required') ||
    this.priorityFormControl.hasError('required') ||
    this.typeFormControl.hasError('required') ||
    this.imgFormControl.hasError('required')
  );
}

showDialog(title: string, message: string): void {
  const dialogReference = this.dialog.open(ConfirmDialogComponent, {
    data: {
      dialogTitle: title,
      dialogMessage: message,
      operation: 'add',
      skillData: this.maintenance,
    },
    width: '50vw',
    height:'30vh'
  });

  dialogReference.afterClosed().subscribe((result) => {
    if (result == true) {
      this.isLoading=true;
      this.service.AddMaintenance(this.maintenance).subscribe(
        (result:any) => {
          console.log(result);
          if(result.Status === 200) {
            this.snack.open(
              'Maintenance request posted successfully!',
                    'OK',
                    {
                      horizontalPosition: 'center',
                      verticalPosition: 'bottom',
                      duration: 5000,
                    });
                    if(this.security.User.UserRoleID == 1)
                    {
                      this.router.navigate(['home/admin-home']);
                    }
                    else if(this.security.User.UserRoleID == 2)
                    {
                    //  console.log('2')
                      this.router.navigate(['home/employee-home']);
                    }
                    else if(this.security.User.UserRoleID == 3)
                    {
                     // console.log('3')
                      this.router.navigate(['home/student-home']);
                    }
                   this.isLoading=false;
                  //this.refreshForm();   
                  
                  let audit = new AuditLog();
              audit.AuditLogID = 0;
              audit.UserID = this.security.User.UserID;
              audit.AuditName = 'Log Maintenance Query';
              audit.Description = 'User, ' + this.security.User.Username + ', logged new Maintenance: ' + this.maintenance.Description
              audit.Date = '';
  
              this.aService.AddAudit(audit).subscribe((data) => {
                //console.log(data);
                this.refreshForm();
              })
          }
          else if(result.Status === 404)
          {
            this.isLoading=false;
            const dialogReference = this.dialog.open(
              ExistsDialogComponent,
              {
                data: {
                  dialogTitle: 'Invalid data',
                  dialogMessage: 'Data is invalid, please ensure data is in the correct format',
                  operation: 'ok',
                },
                width: '50vw',
                height:'30vh'
              }
            );
          }
          else if(result.Status === 600)
          {
            this.isLoading=false;
            const dialogReference = this.dialog.open(
              ExistsDialogComponent,
              {
                data: {
                  dialogTitle: 'Error',
                  dialogMessage: 'Please ensure all dropdowns are selected',
                  operation: 'ok',
                },
                width: '50vw',
                height:'30vh'
              }
            );
          }
          else{
            this.isLoading=false;
            const dialogReference = this.dialog.open(
              ExistsDialogComponent,
              {
                data: {
                  dialogTitle: 'Error',
                  dialogMessage: 'Internal server error. Please try again',
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

onSubmit() {
  this.setDateLogged();
  this.maintenance.MaintenanceID = 0;
  this.maintenance.MaintenanceStatusID = 1;
  this.maintenance.UserID = this.security.User.UserID;
  this.maintenance.DateResolved=null;

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
    const title = 'Confirm New Maintenance Issue';
    const message = 'Are you sure you want to log the new maintenance issue?';
    this.showDialog(title, message);
  }
}

name = 'Angular ' + VERSION.major;

dataimage: any;

@ViewChild('fileInput') fileInput!: ElementRef;
fileAttr = ' ';

uploadFileEvt(imgFile: any) {
  if (imgFile.target.files && imgFile.target.files[0]) {
    this.fileAttr = '';
    Array.from(imgFile.target.files as FileList).forEach((file: File) => {
      this.fileAttr += file.name + ' - ';
    });

    // HTML5 FileReader API
    let reader = new FileReader();
    reader.onload = (e: any) => {
      let image = new Image();
      image.src = e.target.result;
      image.onload = (rs) => {
        let imgBase64Path = e.target.result;
        console.log(imgBase64Path);
        this.dataimage = imgBase64Path;
      };
    };
    reader.readAsDataURL(imgFile.target.files[0]);

  } else {
    this.fileAttr = 'Choose File';
  }

  let imagesave = new FileReader();
  imagesave.readAsDataURL(imgFile.target.files[0]);
  imagesave.onload = () =>
    {
      let invalid:number = ((imagesave.result)!.toString()).indexOf(",");
      this.maintenance.Image = (imagesave.result)!.slice(invalid+1);
    }
}

}
