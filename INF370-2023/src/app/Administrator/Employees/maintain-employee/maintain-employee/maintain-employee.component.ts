import { EmployeeDetails } from 'src/app/Models/employee-details.model';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { Location } from '@angular/common';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { EmployeeService } from 'src/app/Services/employee.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QualificationService } from 'src/app/Services/qualification.service';
import { SkillService } from 'src/app/Services/skill.service';
import { DepartmentService } from 'src/app/Services/department.service';
import { Department } from 'src/app/Models/department.model';
import { Qualification } from 'src/app/Models/qualification.model';
import { Skill, SkillSelectList } from 'src/app/Models/skill.model';
import { UserRole } from 'src/app/Models/UserRole.model';
import { UserRoleService } from 'src/app/Services/user-role.service';
import { Titles } from 'src/app/Models/title.model';
import { TitleService } from 'src/app/Services/title.service';
import { AuditLogService } from 'src/app/Services/audit-log.service';
import { AuditLog } from 'src/app/Models/audit.model';
import { SecurityService } from 'src/app/Services/security.service';


@Component({
  selector: 'app-maintain-employee',
  templateUrl: './maintain-employee.component.html',
  styleUrls: ['./maintain-employee.component.scss']
})
export class MaintainEmployeeComponent implements OnInit {
  nameFormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]);
  surnameFormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]);
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
  
  deptFormControl = new FormControl('', [Validators.required]);
  titleFormControl = new FormControl('', [Validators.required]);
  userroleFormControl = new FormControl('', [Validators.required]);
  skillFormControl = new FormControl('', [Validators.required]);
  qualificationFormControl = new FormControl('', [Validators.required]);
  biographyFormControl = new FormControl('', [Validators.required]);
  imageFormControl = new FormControl('', [Validators.required]);

  employee!: EmployeeDetails;
  qualificationList!: Qualification[];
  skillList!: SkillSelectList[];
  departmentList!: Department[];
  userRoleList!: UserRole[];
  titleList!:Titles[];
  dataImage:any;
  isLoading!:boolean;
  change!:boolean;

  constructor(
    public router: Router,
    private dialog: MatDialog,
    public formbuilder: FormBuilder,
    private location: Location,
    private titleservice: Title,
    private service: EmployeeService,
    private serviced: DepartmentService,
    private serviceS: SkillService,
    private serviceQ: QualificationService,
    private serviceU: UserRoleService,
    private toastr: ToastrService,
    private serviceT:TitleService,
    private snack:MatSnackBar,
    private aService:AuditLogService,
    private security:SecurityService
  ) { this.titleservice.setTitle('Employees');}

  ngOnInit(): void {
    this.employee = JSON.parse( sessionStorage['employee'] );
    this.getDepartmentList();
    this.getQualificationList();
    this.getSkillList();
    this.getUserRoleList();
    this.getTitleList();
    this.change=false;
    this.dataImage=this.employee.Employee.Image;

  }

  getDepartmentList() {
    this.serviced.GetDepartments().subscribe((result) => {
      this.departmentList = result as Department[];
    });
  }

  getUserRoleList() {
    this.serviceU.GetEmployeeUserRoles().subscribe((result) => {
      this.userRoleList = result as UserRole[];
    });
  }

  getSkillList() {
    this.serviceS.GetSkillList().subscribe((result) => {
      this.skillList = result as SkillSelectList[];
    });
  }

  getQualificationList() {
    this.serviceQ.GetQualifications().subscribe((result) => {
      this.qualificationList = result as Qualification[];
    });
  }

  getTitleList(){
    this.serviceT.GetTitles().subscribe((result)=>{
      this.titleList=result as Titles[];
     });
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
    this.deptFormControl.hasError('required') == false &&
    this.userroleFormControl.hasError('required') == false &&
    this.skillFormControl.hasError('required') == false &&
    this.qualificationFormControl.hasError('required') == false &&
    this.titleFormControl.hasError('required')==false &&
    this.biographyFormControl.hasError('required')==false

    ) {
      return false;
    } else {
      return true;
    }
  }

  refreshForm() {
    this.employee = {
      Employee: {
        EmployeeID: 0,
        UserRoleID: 0,
        TitleID:0,
        UserID: 0,
        DepartmentID: 0,
        Biography:'',
        Name: '',
        Surname: '',
        Email: '',
        RSAIDNumber: '',
        Phone: '',
        Deleted: '',
        Image:'',
      },
      Skills: null,
      Qualifications: null,
    };
  }

  onSubmit() {
    const isInvalid = this.validateFormControls();
    if (isInvalid == true) {
      this.dialog.open(InputDialogComponent, {
        data: {
          dialogTitle: 'Input error',
          dialogMessage: 'Correct errors on highlighted fields',
          operation: 'ok',
        },
        width: '25vw',
        height: '27vh',
      });
    } else {
    const dialogReference = this.dialog.open(ConfirmDialogComponent, {
      data: {
        dialogTitle: 'Confirm Edit employee',
        dialogMessage: 'Are you sure you want to save changes to the employee?',
        dialogPopupMessage: 'Employee changes successful!',
        operation: 'add'
      }, //^captured department info here for validation
      height: '30vh',
      width: '50vw',
    });

    dialogReference.afterClosed().subscribe((result) => {

      if (result == true) {
        this.isLoading=true;
        this.service
          .UpdateEmployee(this.employee.Employee.EmployeeID, this.employee)
          .subscribe(
            (result:any) => {
              console.log(result);
              if(result.Status===200)
              {
                this.snack.open(
                  'Employee updated successfully!',
                        'OK',
                        {
                          horizontalPosition: 'center',
                          verticalPosition: 'bottom',
                          duration: 3000,
                        }
                );
                this.isLoading=false;
                this.router.navigate(['admin/read-employees']);
                let audit = new AuditLog();
                audit.AuditLogID = 0;
                audit.UserID = this.security.User.UserID;
                audit.AuditName = 'Update Employee';
                audit.Description = 'Employee, ' + this.security.User.Username + ', updated the employee: ' + this.employee.Employee.Name + ' ' + this.employee.Employee.Surname + ' - ' + this.employee.Employee.RSAIDNumber
                audit.Date = '';
      
                this.aService.AddAudit(audit).subscribe((data) => {
                  //console.log(data);
                  //this.refreshForm();
                })
              }
              else if(result.Status === 330)
              {
                this.isLoading=false;
                const dialogReference = this.dialog.open(
                  ExistsDialogComponent,
                  {
                    data: {
                      dialogTitle: 'Error',
                      dialogMessage: 'You cannot change the user role of the last active admin. Please ensure there is more than one admin active.',
                      operation: 'ok',
                    },
                    height: '30vh',
                    width: '50vw',
                  }
                );
              }
              else if(result.Status===400)
              {
                this.isLoading=false;
                const dialogReference = this.dialog.open(
                  ExistsDialogComponent,
                  {
                    data: {
                      dialogTitle: 'Error',
                      dialogMessage: 'Invalid data',
                      operation: 'ok',
                    },
                    height: '30vh',
                    width: '50vw',
                  }
                );
              }
             else if(result.Status===401)
             {
              this.isLoading=false;
              const dialogReference = this.dialog.open(
                ExistsDialogComponent,
                {
                  data: {
                    dialogTitle: 'RSA ID Number Exists',
                    dialogMessage: 'ID Number is attached to another user of the system, enter a unique RSA ID Number',
                    operation: 'ok',
                  },
                  height: '30vh',
                  width: '50vw',
                }
              );
             }
             else if(result.Status===402)
             {
              this.isLoading=false;
              const dialogReference = this.dialog.open(
                ExistsDialogComponent,
                {
                  data: {
                    dialogTitle: 'Phone number Exists',
                    dialogMessage: 'Phone number is attached to another user of the system, enter a different number',
                    operation: 'ok',
                  },
                  height: '30vh',
                  width: '50vw',
                }
              );
             }
             else if(result.Status===403)
             {
              this.isLoading=false;
              const dialogReference = this.dialog.open(
                ExistsDialogComponent,
                {
                  data: {
                    dialogTitle: 'Email Exists',
                    dialogMessage: 'Email is attached to another user of the system, enter a different email',
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
            }
            
            
          );
      }
    });
  }
}

onArrowBack(): void {
  this.location.back();
}

onBack() {
  this.location.back();
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
      this.employee.Employee.Image = (imagesave.result)!.slice(invalid+1);
    }
}

}
