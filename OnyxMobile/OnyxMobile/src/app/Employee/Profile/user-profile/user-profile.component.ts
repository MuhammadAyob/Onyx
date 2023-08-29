import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { SideMenuService } from 'src/app/Services/side-menu.service';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { FormControl, Validators } from '@angular/forms';
import { AlertController,ToastController } from '@ionic/angular';
import { FormBuilder } from '@angular/forms';
import { UpdateProfileService } from 'src/app/Services/update-profile.service';
import { EmployeeService } from 'src/app/Services/employee.service';
import { TitleService } from 'src/app/Services/title.service';
import { Location } from '@angular/common';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { OnDestroy } from '@angular/core';
import { AuditLog } from 'src/app/Models/audit.model';
import { AuditLogService } from 'src/app/Services/audit-log.service';
import { SecurityService } from 'src/app/Services/security.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  nameFormControl = new FormControl('', [Validators.required,Validators.pattern('^[a-zA-Z ]*$')]);
  surnameFormControl = new FormControl('', [Validators.required,Validators.pattern('^[a-zA-Z ]*$')]);
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  phoneFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^0[1-9]\\d{8}$'),
  ]);
  idFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9]{13}'),
  ]);
  biographyFormControl = new FormControl('', [Validators.required]);
  titleFormControl = new FormControl('', [Validators.required]);
  ImageFormControl = new FormControl('', [Validators.required]);
  
  employee!: any;
  titleList!:any[];
  dataImage:any;
  
  hide: boolean = true;
  employeeID!:any;

  change!:boolean;
  isLoading:boolean = false;
  constructor(
    public router: Router,
    private alertController: AlertController,
    public formbuilder: FormBuilder,
    private titleservice: Title,
    private toastController: ToastController,
    private navCtrl: NavController,
    private serviceUpdate: UpdateProfileService,
    private serviceE:EmployeeService,
    private serviceT:TitleService,
    private aService:AuditLogService,
    private security:SecurityService) 
  {this.titleservice.setTitle('Your Profile'); }

ngOnInit(): void {
  this.change=false;
  this.employee = JSON.parse(sessionStorage['employee']);
  this.titleList = JSON.parse(sessionStorage['titleList']);
}








validateFormControls(): boolean {
  if (
    this.nameFormControl.hasError('required') == false &&
    this.nameFormControl.hasError('pattern') == false &&
    this.surnameFormControl.hasError('required') == false &&
    this.surnameFormControl.hasError('pattern') == false &&
    this.emailFormControl.hasError('required') == false &&
    this.emailFormControl.hasError('email') == false &&
    this.phoneFormControl.hasError('required') == false &&
    this.phoneFormControl.hasError('pattern') == false &&
    this.idFormControl.hasError('required') == false &&
    this.idFormControl.hasError('pattern') == false &&
    this.biographyFormControl.hasError('required')==false
   

  ) {
    return false;
  } else {
    return true;
  }
}

onBack() {
  sessionStorage.removeItem('employee');
  this.router.navigate(['employee-home'])
} 

async onSubmit() {
  console.log(this.employee);
  const isInvalid = this.validateFormControls();
  if (isInvalid == true) {

    const alert = await this.alertController.create({
      header: 'Input Error',
      message: 'Correct the highlighted errors on the fields!',
      buttons: ['OK'],
    });

    await alert.present();
  
  } else 
  {
    const alert = await this.alertController.create({
      header: "Update Profile",
      message: "Are you sure you want to update your details?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel"
        },
        {
          text: "OK",
          handler: () => {
            this.isLoading = true;
            this.serviceUpdate.UpdateEmployeeProfile(this.employee.EmployeeID, this.employee).subscribe(async (result:any) => {
              console.log(result);
              if(result.Status === 200)
              {
                let audit = new AuditLog();
                        audit.AuditLogID = 0;
                        audit.UserID = this.security.User.UserID;
                        audit.AuditName = 'Update user Profile';
                        audit.Description = 'Employee, ' + this.security.User.Username + ', updated their user profile'
                        audit.Date = '';
            
                        this.aService.AddAudit(audit).subscribe((data) => {
                          //console.log(data);
                          //this.refreshForm();
                        })
                        
                const alert = await this.alertController.create({
                  header: 'Success!',
                  message: 'Your Profile was updated',
                  buttons: [
                   
                    {
                      text: "OK",
                      handler: async () => {
                        sessionStorage.removeItem('employee');
                        sessionStorage['employee'] = JSON.stringify(this.employee);
                        this.fileAttr = '';
                        this.isLoading = false;

                        
                        window.location.reload();
                      }
                    }
                  ]
                });
            
                alert.present();
                
               
               
               
              }
  
              else if(result.Status === 400)
              {
                this.isLoading = false;
                const alert = await this.alertController.create({
                  header: 'Error',
                  message: 'Invalid data, please ensure data is correctly formatted',
                  buttons: ['OK'],
                });
            
                await alert.present();
          
              }
  
              else if(result.Status === 404)
              {
                this.isLoading = false;
                const alert = await this.alertController.create({
                  header: 'Email in use!',
                  message: 'Email is in use, please enter a different email',
                  buttons: ['OK'],
                });
            
                await alert.present();
               
              }
              else if(result.Status === 405)
              {
                this.isLoading = false;
                const alert = await this.alertController.create({
                  header: 'ID Number in use!',
                  message: 'ID number in use, please enter a different ID Number',
                  buttons: ['OK'],
                });
            
                await alert.present();

              }
  
              else if(result.Status === 406)
              {
                this.isLoading = false;
                const alert = await this.alertController.create({
                  header: 'Phone number in use!',
                  message: 'Phone number is in use, please enter a different phone number',
                  buttons: ['OK'],
                });
            
                await alert.present();
            
              }
              else
              {
                this.isLoading = false;
                const alert = await this.alertController.create({
                  header: 'Error',
                  message: 'Internal server error, please try again',
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
        this.dataImage = imgBase64Path;
        this.change=true;
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
      this.employee.Image = (imagesave.result)!.slice(invalid+1);
    }
}

}
