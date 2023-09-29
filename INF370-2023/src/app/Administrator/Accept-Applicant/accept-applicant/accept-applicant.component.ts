import { ToastrService } from 'ngx-toastr';
import { EmployeeDetails } from 'src/app/Models/employee-details.model';
import { UserRoleService } from 'src/app/Services/user-role.service';
import { QualificationService } from 'src/app/Services/qualification.service';
import { SkillService } from 'src/app/Services/skill.service';
import { DepartmentService } from 'src/app/Services/department.service';
import { EmployeeService } from 'src/app/Services/employee.service';
import { Department } from 'src/app/Models/department.model';
import { Qualification } from 'src/app/Models/qualification.model';
import { Skill,SkillSelectList } from 'src/app/Models/skill.model';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { Location } from '@angular/common';
import { Component, OnInit, ViewChild,ElementRef} from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { UserRole } from 'src/app/Models/UserRole.model';
import { HttpErrorResponse } from '@angular/common/http';
import { TitleService } from 'src/app/Services/title.service';
import { Titles } from 'src/app/Models/title.model'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { Shortlist } from 'src/app/Models/shortlist.model';
import { ShortlistService } from 'src/app/Services/shortlist.service';
import { AuditLog } from 'src/app/Models/audit.model';
import { AuditLogService } from 'src/app/Services/audit-log.service';
import { SecurityService } from 'src/app/Services/security.service';

@Component({
  selector: 'app-accept-applicant',
  templateUrl: './accept-applicant.component.html',
  styleUrls: ['./accept-applicant.component.scss']
})
export class AcceptApplicantComponent implements OnInit {
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
  SelectedUserRoleID!: number;
  SelectedSkillList!: Skill[];
  SelectedQualificationsList!: Qualification[];
  Qualifications!: string[];
  qualificationList!: Qualification[];
  skillList!: SkillSelectList[];
  departmentList!: Department[];
  userRoleList!: UserRole[];
  titleList!:Titles[];
  dataImage:any;
  shortList!:Shortlist
  change!:boolean;

  isLoading!:boolean;

  constructor(
    public router: Router,
    private dialog: MatDialog,
    public formbuilder: FormBuilder,
    private location: Location,
    private titleservice: Title,
    private service: EmployeeService,
    private serviced: DepartmentService,
    private serviceT:TitleService,
    private serviceS: SkillService,
    private serviceQ: QualificationService,
    private serviceu: UserRoleService,
    private shortService:ShortlistService,
    private snack:MatSnackBar,
    private toastr: ToastrService,
    private aService:AuditLogService,
    private security:SecurityService) 
    { this.titleservice.setTitle('Accept Applicant');}

  ngOnInit(): void {
    this.getDepartmentList();
    this.getQualificationList();
    this.getSkillList();
    this.getUserRoleList();
    this.getTitleList();
    this.refreshForm();

    this.shortList = JSON.parse( sessionStorage['shortlist'] );
    this.change=false;
    this.dataImage=this.shortList.Image;
    this.employee.Employee.Image = this.dataImage;
    this.employee.Employee.Name = this.shortList.Name;
    this.employee.Employee.Surname = this.shortList.Surname;
    this.employee.Employee.Phone = this.shortList.Phone;
    this.employee.Employee.Email = this.shortList.Email;
    this.employee.Employee.RSAIDNumber = this.shortList.RSAIDNumber;
    this.employee.Employee.Biography = this.shortList.Biography;
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

  getDepartmentList() {
    this.serviced.GetDepartments().subscribe((result) => {
      this.departmentList = result as Department[];
    });
  }

  getUserRoleList() {
    this.serviceu.GetEmployeeUserRoles().subscribe((result) => {
      this.userRoleList = result as UserRole[];
    });
  }

getTitleList(){
 this.serviceT.GetTitles().subscribe((result)=>{
   this.titleList=result as Titles[];
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

onBack() {
  sessionStorage.removeItem('shortlist');
  this.location.back();
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

selectTitle($event:any) {
  this.employee.Employee.TitleID = $event;
}

selectDepartment($event:any) {
  this.employee.Employee.DepartmentID = $event;
}

selectUserRole($event:any){
  this.employee.Employee.UserRoleID=$event;
}

onSubmit() {
    const isInvalid = this.validateFormControls();
    if (isInvalid == true) {
      this.dialog.open(InputDialogComponent, {
        data: {
          dialogTitle: 'Input Error',
          dialogMessage: 'Correct errors on highlighted fields',
          operation: 'ok',
        },
        width: '25vw',
        height: '27vh',
      });
    } 
    else
    {
      const title = 'Confirm New Employee';
      const message = 'Are you sure you want to add the applicant as a new employee?';
      this.showDialog(title, message);
    }
}

showDialog(title: string, message: string): void {
  const dialogReference = this.dialog.open(ConfirmDialogComponent, {
    data: {
      dialogTitle: title,
      dialogMessage: message,
      operation: 'add',
    },
    height: '30vh',
    width: '50vw',
  });

  dialogReference.afterClosed().subscribe((result) => {
    if (result == true) {
      this.isLoading=true;
      this.employee.Employee.EmployeeID = 0;
      this.service.AddEmployee(this.employee).subscribe(
        (result:any) => {
          console.log(result);
        if(result.Status===200)
        {
          this.snack.open(
            'Applicant has been added as an employee successfully!',
                  'OK',
                  {
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                    duration: 3000,
                  }
          );
          this.refreshForm();
          this.isLoading=false;
          
          this.router.navigate(['admin/read-employees']);
          this.shortService.AcceptShortlistedCandidate(this.shortList.ApplicationID).subscribe(
            (result:any)=>
            {
if(result.Status === 200){
  console.log('application done')
  let audit = new AuditLog();
        audit.AuditLogID = 0;
        audit.UserID = this.security.User.UserID;
        audit.AuditName = 'Accept Applicant';
        audit.Description = 'Employee, ' + this.security.User.Username + ', accepted the applicant: ' + this.employee.Employee.Name + ' ' + this.employee.Employee.Surname + ' - ' + this.employee.Employee.RSAIDNumber + ' for the Job: ' + this.shortList.JobOpp
        audit.Date = '';

        this.aService.AddAudit(audit).subscribe((data) => {
          sessionStorage.removeItem('shortlist');
          //console.log(data);
          //this.refreshForm();
        })
}
else{
  console.log('app not over')
}
          })
        }
        else if(result.Status==600)
        {
          this.isLoading=false;
          const dialogReference = this.dialog.open(ExistsDialogComponent, {
            data: {
              dialogTitle: 'Error',
              dialogMessage: 'One or more of the following dropdowns are missing: Title, Department or User Role',
              operation: 'ok',
            },
            width: '50vw',
            height:'30vh'
          });
        }
        else if(result.Status===400)
        {
          this.isLoading=false;
          const dialogReference = this.dialog.open(ExistsDialogComponent, {
            data: {
              dialogTitle: 'Error',
              dialogMessage: 'Invalid data post',
              operation: 'ok',
            },
            width: '50vw',
            height:'30vh'
          });
        }    
        else if(result.Status===401)
        {
          this.isLoading=false;
          const dialogReference = this.dialog.open(ExistsDialogComponent, {
            data: {
              dialogTitle: 'RSA ID Number Exists',
              dialogMessage: 'ID Number is attached to another user of the system, enter a unique RSA ID Number',
              operation: 'ok',
            },
            width: '50vw',
            height:'30vh'
          });
        }
        else if(result.Status===402)
        {
          this.isLoading=false;
          const dialogReference = this.dialog.open(ExistsDialogComponent, {
            data: {
              dialogTitle: 'Phone number Exists',
              dialogMessage: 'Phone number is attached to another user of the system, enter a different number',
              operation: 'ok',
            },
            width: '50vw',
            height:'30vh'
          });
        }
        else if(result.Status===403)
        {
          this.isLoading=false;
          const dialogReference = this.dialog.open(ExistsDialogComponent, {
            data: {
              dialogTitle: 'Email Exists',
              dialogMessage: 'Email is attached to another user of the system, enter a different email',
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
              dialogMessage: 'Internal server error',
              operation: 'ok',
            },
            width: '50vw',
            height:'30vh'
          });
        }
        });
    }
  });
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
