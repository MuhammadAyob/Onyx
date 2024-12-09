import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { Title } from '@angular/platform-browser';
import { Rating } from 'src/app/Models/rating.model';
import { RatingsService } from 'src/app/Services/ratings.service';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuditLogService } from 'src/app/Services/audit-log.service';
import { AuditLog } from 'src/app/Models/audit.model';
import { SecurityService } from 'src/app/Services/security.service';

@Component({
  selector: 'app-add-rating',
  templateUrl: './add-rating.component.html',
  styleUrls: ['./add-rating.component.scss']
})
export class AddRatingComponent implements OnInit {
courseFormControl = new FormControl('', [Validators.required]);
commentFormControl = new FormControl('', [Validators.required]);

rating!:Rating;
StudentID:any;
courseList!:any[];
currentDate!: Date;
isLoading!:boolean;
gettingCourses:boolean=true;

constructor(
    public router: Router,
    private location: Location,
    private dialog: MatDialog,
    private service: RatingsService,
    public toastr: ToastrService,
    private _snack:MatSnackBar,
    private titleservice: Title,
    private aService:AuditLogService,
    private security:SecurityService) 
    { this.titleservice.setTitle('Ratings');}

ngOnInit(): void {
this.StudentID = JSON.parse( sessionStorage['StudentID'] );
this.refreshForm();
this.GetCoursesToRate();
}

GetHelp(){
  localStorage.removeItem('pageNumber');
  localStorage.setItem('pageNumber', '7');
}

sRating: number = 1;
stars: number[] = [1, 2, 3, 4, 5];

rate(star: number) {
  this.sRating = star;
}

refreshForm() {
  this.rating = {
    RatingID: 0,
    CourseID:0,
    StudentID: 0,
    Rating:1,
    Date: new Date(),
    Comment:''
  };
}

GetCoursesToRate(){
  this.service.GetCoursesToRate(this.StudentID).subscribe((res)=>{
    this.courseList = res as any[];
    this.gettingCourses=false;
  })
}

setDateLogged(){
  this.currentDate = new Date();
  this.rating.Date = this.currentDate;
}

onBack() {
  this.location.back();
}

selectCourse($event:any) {
  this.rating.CourseID  = $event;
}

validateFormControls(): boolean {
  return (
    this.courseFormControl.hasError('required') ||
    this.commentFormControl.hasError('required') 
   
  );
}

showDialog(title: string, message: string): void {
  const dialogReference = this.dialog.open(ConfirmDialogComponent, {
    data: {
      dialogTitle: title,
      dialogMessage: message,
      operation: 'add',
      skillData: this.rating,
    },
    width: '50vw',
    height:'30vh'
  });

  dialogReference.afterClosed().subscribe((result) => {
    if (result == true) {
      this.isLoading=true;
      this.service.AddRating(this.rating).subscribe(
        (result:any) => {
          console.log(result);
          if(result.Status === 200)
          {
            this._snack.open(
              'Rating added successfully!',
                    'OK',
                    {
                      horizontalPosition: 'center',
                      verticalPosition: 'bottom',
                      duration: 3000,
                    }
            );
            this.isLoading=false;
            this.router.navigate(['student/read-ratings']);

            let audit = new AuditLog();
              audit.AuditLogID = 0;
              audit.UserID = this.security.User.UserID;
              audit.AuditName = 'Add Course Rating';
              audit.Description = 'Student, ' + this.security.User.Username + ', added a new ' + this.rating.Rating + ' star course rating to CourseID: ' + this.rating.CourseID 
              audit.Date = '';
  
              this.aService.AddAudit(audit).subscribe((data) => {
                //console.log(data);
                //this.refreshForm();
              })
          }
          else
          {
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
  //this.setDateLogged();
  this.rating.StudentID = this.StudentID;
  this.rating.Rating = this.sRating;
  console.log(this.rating);

  const isInvalid = this.validateFormControls();
  if (isInvalid == true) {
    this.dialog.open(InputDialogComponent, {
      data: {
        dialogTitle: "Input Error",
        dialogMessage: "Correct Errors on Highlighted fields"
      },
      width: '27vw',
      height: '29vh',
    });
  } else {
    const title = 'Confirm New Rating';
    const message = 'Are you sure you want to add the rating?';
    this.showDialog(title, message);
  }
}

}
