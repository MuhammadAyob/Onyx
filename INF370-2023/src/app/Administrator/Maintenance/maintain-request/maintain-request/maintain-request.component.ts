import { SecurityService } from 'src/app/Services/security.service';
import { MaintenancePriority } from 'src/app/Models/maintenance-priority.model';
import { MaintenanceTypeService } from 'src/app/Services/maintenance-type.service';
import { MaintenanceType } from 'src/app/Models/maintenance-type.model';
import { MaintenanceService } from 'src/app/Services/maintenance.service';
import { Maintenance } from 'src/app/Models/maintenance.model';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component'; 
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup } from '@angular/forms';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { VERSION, ViewChild, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MaintenancePriorityService } from 'src/app/Services/maintenance-priority.service';
import { AuditLog } from 'src/app/Models/audit.model';
import { AuditLogService } from 'src/app/Services/audit-log.service';

@Component({
  selector: 'app-maintain-request',
  templateUrl: './maintain-request.component.html',
  styleUrls: ['./maintain-request.component.scss']
})
export class MaintainRequestComponent implements OnInit {

descFormControl = new FormControl('', []);
priorityFormControl = new FormControl('', [Validators.required]);
typeFormControl = new FormControl('', [Validators.required]);
locationFormControl = new FormControl('', []);

maintenance: any;
maintenanceList!: Maintenance[];
isLoading!:boolean;
maintenanceTypeList!: MaintenanceType[];

maintenancePriorityList!: MaintenancePriority[];
 // newMaintenance: any;

constructor(
  public router: Router,
  public formbuilder: FormBuilder,
  private location: Location,
  public toastr: ToastrService,
  private snack: MatSnackBar,
  private dialog: MatDialog,
  private service: MaintenanceService,
  private serviced: MaintenanceTypeService,
  private serviceP: MaintenancePriorityService,
  private security: SecurityService,
  private titleservice: Title,
  private aService:AuditLogService
) { this.titleservice.setTitle('Maintenance'); }

  ngOnInit(): void {
    this.maintenance = JSON.parse( sessionStorage['MaintenanceRequest'] );
    this.getMaintenanceTypeList();
    this.getMaintenancePriorityList();
  }

  GetHelp(){
    localStorage.removeItem('pageNumber');
    localStorage.setItem('pageNumber', '152');
  }

  getMaintenanceTypeList() {
    this.serviced.GetTypes().subscribe((result:any) => {
      this.maintenanceTypeList = result as MaintenanceType[];
    });
  }

  getMaintenancePriorityList(){
    this.serviceP.GetPriorities().subscribe((result:any) => {
      this.maintenancePriorityList = result as MaintenancePriority[];
    })
  }

  selectMaintenanceType($event:any) {
    this.maintenance.MaintainTypeID = $event;
  }

  selectMaintenancePriority($event:any){
    this.maintenance.MaintainPriorityID = $event;
  }

  onBack() {
    sessionStorage.removeItem('MaintenanceRequest');
    this.location.back();
  }

 


  onSubmit() {
    //console.log(this.maintenance);
    const isInvalid = this.validateFormControls();
    if (isInvalid == true) {
      this.dialog.open(InputDialogComponent, {
        data: {
          dialogTitle: "Error",
          dialogMessage: "Correct input errors on highlighted fields"
        },
        width: '25vw',
        height: '27vh',
      });
    } else {
      const title = 'Confirm Edit maintenance request';
      const message = 'Are you sure you want to save changes to the maintenance request?';
      const popupMessage = 'Maintenance request changes successful!';
      this.showDialog(title, message, popupMessage);
    }
  }

  validateFormControls(): boolean {

    if (
      
      this.typeFormControl.hasError('required') == false &&
      this.priorityFormControl.hasError('required')== false 

    )
    {return false}
    else
    {return true}
  }

  showDialog(title: string, message: string, popupMessage: string): void {
    const dialogReference = this.dialog.open(ConfirmDialogComponent, {
      data: {
        dialogTitle: title,
        dialogMessage: message,
        dialogPopupMessage: popupMessage,
        operation: 'add',
      }, //^captured department info here for validation
      height: '30vh',
      width: '50vw',
    });

   

    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        let newMaintenance = new Maintenance();
        newMaintenance.MaintenanceID = this.maintenance.MaintenanceID;
        newMaintenance.UserID=this.maintenance.UserID;
        newMaintenance.MaintenanceTypeID=this.maintenance.MaintenanceTypeID;
        newMaintenance.MaintenanceStatusID=this.maintenance.MaintenanceStatusID;
        newMaintenance.MaintenancePriorityID=this.maintenance.MaintenancePriorityID;
        newMaintenance.Description=this.maintenance.Description;
        newMaintenance.Location=this.maintenance.Location;
        newMaintenance.DateLogged=this.maintenance.DateLogged;
        newMaintenance.DateResolved=this.maintenance.DateResolved;
        newMaintenance.Image=this.maintenance.Image;

        this.isLoading=true;
        this.service
          .UpdateMaintenanceRequest(newMaintenance.MaintenanceID, newMaintenance)
          .subscribe(
            (result:any) => {
              console.log(result);
              if(result.Status === 200)
              {
                this.snack.open(
                  'Request updated!',
                        'OK',
                        {
                          horizontalPosition: 'center',
                          verticalPosition: 'bottom',
                          duration: 3000,
                        }
                );
                this.isLoading=false;
                sessionStorage.removeItem('MaintenanceRequest');
                this.router.navigate(['admin/read-maintenance-requests']);

                let audit = new AuditLog();
                audit.AuditLogID = 0;
                audit.UserID = this.security.User.UserID;
                audit.AuditName = 'Maintain Maintenance Query';
                audit.Description = 'Employee, ' + this.security.User.Username + ', maintained Maintenance Request: ' + newMaintenance.Description
                audit.Date = '';
    
                this.aService.AddAudit(audit).subscribe((data) => {
                  //console.log(data);
                  //this.refreshForm();
                })
              }

              else if(result.Status === 404)
              {

                this.isLoading=false;
                const dialogReference = this.dialog.open(
                  ExistsDialogComponent,
                  {
                    data: {
                      dialogTitle: 'Error',
                      dialogMessage: 'Invalid data, please ensure data is in the correct format',
                      operation: 'ok',
                    },
                    height: '30vh',
                    width: '50vw',
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
                      dialogMessage: 'Internal server error, please try again',
                      operation: 'ok',
                    },
                    height: '30vh',
                    width: '50vw',
                  }
                );
              }
            },
           
          );
      }
    });
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

      // Reset if duplicate image uploaded again
      this.fileInput.nativeElement.value = '';
    } else {
      this.fileAttr = 'Choose File';
    }
  }

}
