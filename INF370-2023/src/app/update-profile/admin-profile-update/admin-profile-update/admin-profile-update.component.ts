import { ToastrService } from 'ngx-toastr';
import { UpdateProfileService } from 'src/app/Services/update-profile.service';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { Location } from '@angular/common';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from 'src/app/Services/employee.service';
import { TitleService } from 'src/app/Services/title.service';
import { Titles } from 'src/app/Models/title.model';
import { AuditLog } from 'src/app/Models/audit.model';
import { AuditLogService } from 'src/app/Services/audit-log.service';
import { SecurityService } from 'src/app/Services/security.service';

@Component({
  selector: 'app-admin-profile-update',
  templateUrl: './admin-profile-update.component.html',
  styleUrls: ['./admin-profile-update.component.scss']
})
export class AdminProfileUpdateComponent implements OnInit {
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
  
  employee: any;
  titleList!:Titles[];
  dataImage:any;
  
  hide: boolean = true;
  employeeID!:any;
  isLoading:boolean=false;
  change!:boolean;
  invalidFormat!:boolean;

  constructor(
    public router: Router,
    private dialog: MatDialog,
    public formbuilder: FormBuilder,
    private location: Location,
    private titleservice: Title,
    private snack: MatSnackBar,
    private serviceUpdate: UpdateProfileService,
    private toastr: ToastrService,
    private serviceE:EmployeeService,
    private serviceT:TitleService,
    private aService:AuditLogService,
    private security:SecurityService
  ) { this.titleservice.setTitle('Your Profile'); }

  ngOnInit(): void {
    this.onEmployeeProfile();
    this.getTitleList();
    this.change=false;
    
  }

  GetHelp(){
    localStorage.removeItem('pageNumber');
    localStorage.setItem('pageNumber', '4');
  }

  onEmployeeProfile() {
    this.serviceE.GetEmployeeName(sessionStorage.getItem('EmployeeID')).subscribe((result:any) => {
      this.employee = result as any;
      this.dataImage = this.employee.Image;
    });
  }
  getTitleList(){
    this.serviceT.GetTitles().subscribe((result)=>{
      this.titleList=result as Titles[];
     });
   }

  validateFormControls(): boolean {
    const isValidName = this.nameFormControl.hasError('required') && this.nameFormControl.hasError('pattern');
    const isValidSurname = this.surnameFormControl.hasError('required') && this.surnameFormControl.hasError('pattern');
    const isValidEmail =
      this.emailFormControl.hasError('required') ||
      this.emailFormControl.hasError('email');
    const isValidPhone =
      this.phoneFormControl.hasError('required') ||
      this.phoneFormControl.hasError('pattern');
    const isValidId =
      this.idFormControl.hasError('required') ||
      this.idFormControl.hasError('pattern');
    const isValidBiography =
      this.biographyFormControl.hasError('required')  
  
    if (
      isValidName == false &&
      isValidSurname == false &&
      isValidEmail == false &&
      isValidPhone == false &&
      isValidId == false &&
      isValidBiography==false
    ) {
      return false;
    } else {
      return true;
    }
  }

  onArrowBack(): void {
    this.location.back();
  }

  onBack() {
   this.router.navigate(['home/admin-home'])
  }

  onSubmit() {
    //console.log(this.employee);
    const isInvalid = this.validateFormControls();
    if(this.invalidFormat == true){
      this.dialog.open(InputDialogComponent, {
        data: {
          dialogTitle: "File Error",
          dialogMessage: "Please upload Image Files only"
        },
        width: '27vw',
        height: '29vh',
      });
     }

    else if (isInvalid == true) {
      this.dialog.open(InputDialogComponent, {
        data: {
          dialogTitle: 'Inout Error',
          dialogMessage: 'Correct errors on highlighted fields',
          operation: 'ok',
        },
        width: '25vw',
        height: '27vh',
      });
    } else 
    {
        const dialogReference = this.dialog.open(ConfirmDialogComponent, {
          data: {
            dialogTitle: 'Update Profile',
            dialogMessage: 'Are you sure you want to update your details?',
          },
          width: '50vw',
          height:'30vh'
        });

        dialogReference.afterClosed().subscribe((result) => {
          if (result == true) {
            this.isLoading=true;
            this.serviceUpdate.UpdateEmployeeProfile(this.employee.EmployeeID, this.employee).subscribe((result:any) => {
              //console.log(result);
              if(result.Status === 200)
              {
                this.snack.open(
                  'Profile updated successfully!',
                        'OK',
                        {
                          horizontalPosition: 'center',
                          verticalPosition: 'bottom',
                          duration: 3000,
                        }
                );
                this.isLoading=false;
                this.router.navigate(['home/admin-home']);

                 // Audit Log 

             let audit = new AuditLog();
             audit.AuditLogID = 0;
             audit.UserID = this.security.User.UserID;
             audit.AuditName = 'Update Profile';
             audit.Description = 'Employee, ' + this.employee.Email + ', updated their user profile.'
             audit.Date = '';
 
             this.aService.AddAudit(audit).subscribe((data) => {
               //console.log(data);
             })
              }

              else if(result.Status === 400)
              {
                this.isLoading=false;
                const dialogReference = this.dialog.open(ExistsDialogComponent, {
                  data: {
                    dialogTitle: 'Error',
                    dialogMessage: 'Invalid data, please ensure data is correctly formatted',
                    operation: 'ok',
                  },
                  width: '50vw',
                  height:'30vh'
                });
              }

              else if(result.Status === 404)
              {
                this.isLoading=false;
                const dialogReference = this.dialog.open(ExistsDialogComponent, {
                  data: {
                    dialogTitle: 'Email in use!',
                    dialogMessage: 'Email is in use, please enter a different email',
                    operation: 'ok',
                  },
                  width: '50vw',
                  height:'30vh'
                });
              }
              else if(result.Status === 405)
              {
                this.isLoading=false;
                const dialogReference = this.dialog.open(ExistsDialogComponent, {
                  data: {
                    dialogTitle: 'ID Number in use!',
                    dialogMessage: 'ID number in use, please enter a different ID Number',
                    operation: 'ok',
                  },
                  width: '50vw',
                  height:'30vh'
                });
              }

              else if(result.Status === 406)
              {
                this.isLoading=false;
                const dialogReference = this.dialog.open(ExistsDialogComponent, {
                  data: {
                    dialogTitle: 'Phone number in use!',
                    dialogMessage: 'Phone number is in use, please enter a different phone number',
                    operation: 'ok',
                  },
                  width: '50vw',
                  height:'30vh'
                });
              }
              else
              {
                this.isLoading=false;
                const dialogReference = this.dialog.open(ExistsDialogComponent, {
                  data: {
                    dialogTitle: 'Error',
                    dialogMessage: 'Internal server error, please try again',
                    operation: 'ok',
                  },
                  width: '50vw',
                  height:'30vh'
                });
              }
            }
            );
          }
        });
      
    }
  }

@ViewChild('fileInput') fileInput!: ElementRef;
fileAttr = ' ';

uploadFileEvt(imgFile: any) {
  this.invalidFormat = false;
  if (imgFile.target.files && imgFile.target.files[0]) {
    this.fileAttr = '';
    Array.from(imgFile.target.files as FileList).forEach((file: File) => {
      this.fileAttr += file.name + ' - ';
       // Check the file type (MIME type)
    if (!file.type.startsWith('image/')) {
      this.invalidFormat = true;
    }

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
