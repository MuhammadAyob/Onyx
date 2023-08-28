import { Course } from 'src/app/Models/course.model';
import { CoursePrice } from 'src/app/Models/course.model';
import { EmployeeListForCourses } from 'src/app/Models/employee.model';
import { CourseService } from 'src/app/Services/course.service';
import { CourseCategoryService } from 'src/app/Services/course-category.service';
import { CourseCategory } from 'src/app/Models/CourseCategory.model';
import { CourseDetails } from 'src/app/Models/course-details.model';
import { Employee } from 'src/app/Models/employee.model';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { AuditLogService } from 'src/app/Services/audit-log.service';
import { AuditLog } from 'src/app/Models/audit.model';
import { SecurityService } from 'src/app/Services/security.service';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent implements OnInit {

nameFormControl = new FormControl('', [Validators.required]);
descriptionFormControl = new FormControl('', [Validators.required]);
imageFormControl = new FormControl('', [Validators.required]);
categoryFormControl = new FormControl('', [Validators.required]);
priceFormControl = new FormControl('', [Validators.required,Validators.pattern('^(?!0(?:\\.0+)?$)(?:\\d+)?(?:\\.\\d+)?$')]);
assistantsFormControl = new FormControl('', [Validators.required]);
activeFormControl = new FormControl('',[Validators.required]);
previewFormControl = new FormControl('',[Validators.required, Validators.pattern('^[0-9]+$')]);
course!: CourseDetails;
coursePrice!:CoursePrice;
SelectedCategoryID!: number;
SelectedActivityList!: any;
SelectedEmployees!:number[];
categoryList!:CourseCategory[];
employeeList!:EmployeeListForCourses[];
dataImage:any;
isLoading!:boolean;

constructor(
  public router: Router,
  private location: Location,
  private titleservice: Title,
  private dialog: MatDialog,
  public toastr: ToastrService,
  private cService: CourseService,
  private catService: CourseCategoryService,
  private snack:MatSnackBar,
  private aService:AuditLogService,
  private security:SecurityService
) { this.titleservice.setTitle('Courses');}

  ngOnInit(): void {
    this.refreshForm();
    this.getCategoriesList();
    this.getEmployeesList();
  }

  getCategoriesList(){
    this.catService.GetCategories().subscribe((res)=>{
    this.categoryList = res as CourseCategory[];
    })
  }

  getEmployeesList(){
    this.cService.GetEmployeeList().subscribe((res)=>{
    this.employeeList = res as EmployeeListForCourses[];
    })
  }

  refreshForm() {
    this.course = {
      CourseID: 0,
      Name: '',
      Description: '',
      Image: '',
      Active: '',
      Price:0,
      CourseAssistants:null,
      CategoryID:0,
      Preview:''
    };
  }

  selectCategory($event:any) {
    this.course.CategoryID = $event;
  }
  
  selectActive($event:any) {
    this.course.Active = $event;
  }

  onSubmit() {
    const isInvalid = this.validateFormControls();
    if (isInvalid == true) {
      this.dialog.open(InputDialogComponent, {
        data: {
          dialogTitle: "Input Error",
          dialogMessage: "Correct Errors on highlighted fields"
        },
        width: '40vw',
        height: '30vh',
      });
    } else {
      const title = 'Confirm New Course';
      const message = 'Are you sure you want to add the new Course?';
      this.showDialog(title, message);
    }
  }

  validateFormControls(): boolean {
    if (
      this.nameFormControl.hasError('required')== false &&
      this.descriptionFormControl.hasError('required')== false &&
      this.priceFormControl.hasError('pattern')==false &&
      this.priceFormControl.hasError('required')== false &&
      this.categoryFormControl.hasError('required')==false &&
      this.assistantsFormControl.hasError('required')==false &&
      this.activeFormControl.hasError('required') == false &&
      this.previewFormControl.hasError('required') == false &&
      this.previewFormControl.hasError('pattern') == false && 
      this.imageFormControl.hasError('required') == false


    ){
      return false}
    else{return true}
  }

  onArrowBack(): void {
    this.location.back();
  }
  onBack() {
    this.router.navigate(['admin/read-courses']);
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
        this.cService.AddCourse(this.course).subscribe(
          (result:any) => {
            console.log(result);
            if(result.Status===200)
            {
              this.snack.open(
                'Course added successfully!',
                      'OK',
                      {
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        duration: 3000,
                      }
              );
              this.isLoading=false;
              this.router.navigate(['admin/read-courses']);

              let audit = new AuditLog();
              audit.AuditLogID = 0;
              audit.UserID = this.security.User.UserID;
              audit.AuditName = 'Add Course';
              audit.Description = 'Employee, ' + this.security.User.Username + ', added a new Course: ' + this.course.Name
              audit.Date = '';
  
              this.aService.AddAudit(audit).subscribe((data) => {
                //console.log(data);
                this.refreshForm();
              })
              
            }
            else if(result.Status === 100)
            {
              this.isLoading=false;
              const dialogReference = this.dialog.open(
                ExistsDialogComponent,
                {
                  data: {
                    dialogTitle: 'Preview Exists',
                    dialogMessage: 'The preview belongs to an existing course',
                    operation: 'ok',
                  },
                  width: '50vw',
                  height:'30vh'
                }
              );
            }
            else if(result.Status===400)
            { this.isLoading=false;
              const dialogReference = this.dialog.open(
                ExistsDialogComponent,
                {
                  data: {
                    dialogTitle: 'Invalid data',
                    dialogMessage: 'Please ensure data is in proper format',
                    operation: 'ok',
                  },
                  width: '50vw',
                  height:'30vh'
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
                    dialogTitle: 'Price invalid',
                    dialogMessage: 'Ensure the price is rounded off to 2 decimal places with a "." seperating the whole number',
                    operation: 'ok',
                  },
                  width: '50vw',
                  height:'30vh'
                }
              );
            }
            else if(result.Status===404)
            {
              this.isLoading=false;
              const dialogReference = this.dialog.open(
                ExistsDialogComponent,
                {
                  data: {
                    dialogTitle: 'Course Name Exists',
                    dialogMessage: 'Enter a new course name',
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
                    dialogMessage:'Internal server error, please try again',
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
      };
    };
    reader.readAsDataURL(imgFile.target.files[0]);

  } else {
    this.fileAttr = 'Choose Image';
  }

  let imagesave = new FileReader();
  imagesave.readAsDataURL(imgFile.target.files[0]);
  imagesave.onload = () =>
    {
      let invalid:number = ((imagesave.result)!.toString()).indexOf(",");
      this.course.Image = (imagesave.result)!.slice(invalid+1);
    }
}
}
