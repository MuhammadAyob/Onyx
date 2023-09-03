import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UpdateRequestService } from 'src/app/Services/update-request.service';
import { AlertController } from '@ionic/angular';
import { Title } from '@angular/platform-browser';
import { AuditLog } from 'src/app/Models/audit.model';
import { AuditLogService } from 'src/app/Services/audit-log.service';
import { SecurityService } from 'src/app/Services/security.service';

@Component({
  selector: 'app-request-update',
  templateUrl: './request-update.component.html',
  styleUrls: ['./request-update.component.scss'],
})
export class RequestUpdateComponent  implements OnInit {
  nameFormControl = new FormControl('', [Validators.required]);
  descFormControl = new FormControl('', [Validators.required]);
  imgFormControl = new FormControl('', [Validators.required]);

  updateRequest: any;
  updateFile: string = '';
  fileAttr = ' ';
  isLoading:boolean=false;

  constructor(
    public router: Router,
    private service: UpdateRequestService,
    private alertController: AlertController,
    private titleservice: Title,
    private aService:AuditLogService,
    private security:SecurityService) 
    { this.titleservice.setTitle('Skill/Qualification Update');}

    ngOnInit(): void {
      this.refreshObject();
    }
  
    refreshObject() {
      this.updateRequest = {
        UpdateDescription: '',
        UpdateSubject: '',
        UpdateRequestStatusID: 1,
        EmployeeID: 0,
        UpdateRequestID: 0,
        Proof: '',
      };
    }

    uploadFileEvt(dataFile:any) {
      this.fileAttr = '';
      Array.from(dataFile.target.files as FileList).forEach((file: File) => {
        this.fileAttr += file.name + ' - ';
      });
  
      var fileUpload = dataFile.target.files[0];
      var fileReader = new FileReader();
      fileReader.readAsDataURL(fileUpload);
      fileReader.onloadend = () => {
        this.updateFile = fileReader.result!.toString();
      };
    }
  
    validateFormControls(): boolean {
      if (
        this.descFormControl.hasError('required') == false &&
        this.nameFormControl.hasError('required') == false &&
        this.imgFormControl.hasError('required') == false
      ) {
        return false;
      } else {
        return true;
      }
    }
  
    async onSubmit() {
      const isInvalid = this.validateFormControls();
      if (isInvalid == true) {
        const alert = await this.alertController.create({
          header: 'Input Error',
          message: 'Correct the highlighted errors on the fields!',
          buttons: ['OK'],
        });
    
        await alert.present();
       
      } else {
      
        const alert = await this.alertController.create({
          header: "Confirm Update Request",
          message: "Are you sure you want to request an Update?",
          buttons: [
            {
              text: "Cancel",
              role: "cancel"
            },
            {
              text: "OK",
              handler: () => {
                this.isLoading = true;
                this.updateFile = this.updateFile.slice(28);
                this.updateRequest.EmployeeID = sessionStorage.getItem('EmployeeID');
                this.updateRequest.UpdateRequestID = 0;
                this.updateRequest.Proof = this.updateFile;
                this.updateRequest.UpdateRequestStatusID = 1;
        
                this.service.AddUpdateRequest(this.updateRequest).subscribe(async (result:any) => {
                   console.log(result);
                   if(result.Status === 200)
                   {
                     // Audit Log 

             let audit = new AuditLog();
             audit.AuditLogID = 0;
             audit.UserID = this.security.User.UserID;
             audit.AuditName = 'Request Technical Competency Update';
             audit.Description = 'Employee, ' + this.security.User.Username + ', requested a technical update: ' + this.updateRequest.UpdateSubject
             audit.Date = '';
 
             this.aService.AddAudit(audit).subscribe((data) => {
               //console.log(data);
             })
             
                    const alert = await this.alertController.create({
                      header: 'Success!',
                      message: 'Your Update Request was captured',
                      buttons: [
                       
                        {
                          text: "OK",
                          handler: async () => {
                            this.fileAttr = '';
                           
                            this.isLoading = false;
                            this.refreshObject();
                            window.location.reload();
                            //this.router.navigate(['/view-requests'])

                          }
                        }
                      ]
                    });
                
                    alert.present();
                   }
                   else if(result.Status === 404)
                   { 
                    this.isLoading = false;
                    const alert = await this.alertController.create({
                      header: 'Invalid PDF',
                      message: 'The PDF could not be read. Please upload a different file.',
                      buttons: ['OK'],
                    });
                
                    await alert.present();
                   
                   }
                   else{
                    this.isLoading = false;
                    const alert = await this.alertController.create({
                      header: 'Error',
                      message: 'Internal server error. Please try again',
                      buttons: ['OK'],
                    });
                
                    await alert.present();
                   
                   }
                  }
                );
              }
            }
          ]
        });
        alert.present();
      
      }
    }

}
