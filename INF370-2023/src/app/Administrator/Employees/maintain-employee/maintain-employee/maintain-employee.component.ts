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
    Validators.pattern('[0-9]{10}'),
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
    private snack:MatSnackBar
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
      this.deptFormControl.hasError('required') == false &&
      this.userroleFormControl.hasError('required') == false &&
      this.idFormControl.hasError('required') == false &&
      this.skillFormControl.hasError('required') == false &&
      this.qualificationFormControl.hasError('required') == false &&
      this.idFormControl.hasError('pattern') == false &&
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
          dialogTitle: 'Maintain error',
          dialogMessage: 'Correct errors',
          operation: 'ok',
        },
        width: '25vw',
        height: '27vh',
      });
    } else {
    const dialogReference = this.dialog.open(ConfirmDialogComponent, {
      data: {
        dialogTitle: 'Confirm Edit employee',
        dialogMessage: 'Are you sure you want to save changes the employee?',
        dialogPopupMessage: 'Employee changes successful!',
        operation: 'add'
      }, //^captured department info here for validation
      height: '27vh',
      width: '25vw',
    });

    dialogReference.afterClosed().subscribe((result) => {

      if (result == true) {
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
                this.router.navigate(['admin/read-employees']);
              }
              else if(result.Status===400)
              {
                const dialogReference = this.dialog.open(
                  ExistsDialogComponent,
                  {
                    data: {
                      dialogTitle: 'Error',
                      dialogMessage: 'Invalid data',
                      operation: 'ok',
                    },
                    width: '25vw',
                  }
                );
              }
             else if(result.Status===401)
             {
              const dialogReference = this.dialog.open(
                ExistsDialogComponent,
                {
                  data: {
                    dialogTitle: 'ID in use',
                    dialogMessage: 'Enter a different ID',
                    operation: 'ok',
                  },
                  width: '25vw',
                }
              );
             }
             else if(result.Status===402)
             {
              const dialogReference = this.dialog.open(
                ExistsDialogComponent,
                {
                  data: {
                    dialogTitle: 'Phone Exists',
                    dialogMessage: 'Enter a different phone number',
                    operation: 'ok',
                  },
                  width: '25vw',
                }
              );
             }
             else if(result.Status===403)
             {
              const dialogReference = this.dialog.open(
                ExistsDialogComponent,
                {
                  data: {
                    dialogTitle: 'Email in use',
                    dialogMessage: 'Enter a different email address',
                    operation: 'ok',
                  },
                  width: '25vw',
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
                    dialogMessage: 'Internal server error, please try again.',
                    operation: 'ok',
                  },
                  width: '25vw',
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
