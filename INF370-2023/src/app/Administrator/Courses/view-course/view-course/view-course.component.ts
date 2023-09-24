import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CourseService } from 'src/app/Services/course.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseDetails } from 'src/app/Models/course-details.model';
import { Section } from 'src/app/Models/section.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { SectionService } from 'src/app/Services/section.service';
import { EmployeeListForCourses } from 'src/app/Models/employee.model';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { AuditLogService } from 'src/app/Services/audit-log.service';
import { AuditLog } from 'src/app/Models/audit.model';
import { SecurityService } from 'src/app/Services/security.service';
import { Lesson } from 'src/app/Models/lesson.model';
import { LessonService } from 'src/app/Services/lesson.service';
import { LessonResource } from 'src/app/Models/LessonResource.model';
import { LessonResourceService } from 'src/app/Services/lesson-resource.service';

@Component({
  selector: 'app-view-course',
  templateUrl: './view-course.component.html',
  styleUrls: ['./view-course.component.scss']
})

export class ViewCourseComponent implements OnInit {
test!: CourseDetails;
id: any;
employeeList! : any[];
category!:any;

panelOpenState = false;
courseDetails:any;
course:any
ratings:any;
LessonName:any;
VideoID:any;
notRetrieved = true;
isLoading!:boolean;




public dataSource = new MatTableDataSource<any>();

noData = this.dataSource.connect().pipe(map((data) => data.length === 0));

@ViewChild(MatPaginator) paginator!: MatPaginator;

displayList!: Section[];

constructor( private dialog: MatDialog,
  public router: Router,
  private location: Location,
  private service: CourseService,
  public toaster: ToastrService,
  private _snackBar: MatSnackBar,
  private titleservice: Title,
  private toastr: ToastrService,
  private sectionService:SectionService,
  private aService:AuditLogService,
  private security:SecurityService,
  private lService:LessonService,
  private lrService:LessonResourceService
  ) 
  { this.titleservice.setTitle('Course');}

  getEmployeeList() {
    this.service.GetCourseAssistants(this.test.CourseID).subscribe((result) => {
     this.employeeList = result as any[];
     //this.isLoading=false;
    });
  }

  ngAfterViewInit() {

    this.dataSource.paginator = this.paginator;
    this.refreshList();
  }

  getCategory(){
    this.service.GetCategory(this.test.CategoryID).subscribe((result)=>{
      this.category = result;
    })
  }

addLesson(obj:any){
  let sec = new Section();
    sec.CourseID = obj.CourseID;
    sec.SectionName = obj.SectionName;
    sec.SectionDescription = obj.SectionDescription;
    sec.SectionID = obj.SectionID;

  sessionStorage['Section'] = JSON.stringify(sec);
 
  this.router.navigate(['admin/add-lesson'])
}

addResource(obj:any){
let lesson = new Lesson();
lesson.LessonID = obj.LessonID;
lesson.LessonName = obj.LessonName;
lesson.LessonDescription = obj.LessonDescription;
lesson.SectionID = obj.SectionID;
lesson.VideoID = obj.VideoID;

sessionStorage['Lesson'] = JSON.stringify(lesson);
//console.log(obj);
this.router.navigate(['admin/add-resource'])

}

ngOnInit(): void {
  this.test=JSON.parse( sessionStorage['Course'] );
  this.getStructure();
  this.getEmployeeList();
  this.getCategory();
}

  getStructure(){
    this.isLoading = true;
    this.service.GetCourseView(this.test.CourseID).subscribe((result)=>{
      this.courseDetails = result as any;
      this.isLoading=false;
    })
  }

  onViewResource(obj:any){
    let res =  new LessonResource();
    res.LessonID = obj.LessonID;
    res.ResourceID = obj.ResourceID;
    res.ResourceName = obj.ResourceName;
    res.ResourceFile = '';

    sessionStorage['LessonResource'] = JSON.stringify(res);
    this.router.navigate(['admin/view-resource']);
  }

  onEditResource(obj:any){
    let res =  new LessonResource();
    res.LessonID = obj.LessonID;
    res.ResourceID = obj.ResourceID;
    res.ResourceName = obj.ResourceName;
    res.ResourceFile = '';

    sessionStorage['LessonResource'] = JSON.stringify(res);
    this.router.navigate(['admin/maintain-resource']);
  }

  onDeleteResource(obj:any) {
    const title = 'Confirm Delete Resource ';
    const message = 'Are you sure you want to delete the Resource?';
    
    const dialogReference = this.dialog.open(
      ConfirmDialogComponent,
        {
          width: '50vw',
          height:'30vh',
          data: {
            dialogTitle: title,
            operation: 'delete',
            dialogMessage: message,
          },
        }
      );
      dialogReference.afterClosed().subscribe((result) => {
        if (result == true) {
          this.lrService.DeleteLessonResource(obj.ResourceID).subscribe((res:any) => 
          {
            //console.log(res);
            if(res.Status===200)
            {
              this._snackBar.open(
                'Resource deleted successfully!',
                      'OK',
                      {
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        duration: 3000,
                      }
              );

              this.getStructure();
  
            let audit = new AuditLog();
            audit.AuditLogID = 0;
            audit.UserID = this.security.User.UserID;
            audit.AuditName = 'Delete Lesson Resource';
            audit.Description = 'Employee, ' + this.security.User.Username + ', deleted resource: ' + obj.ResourceName + ', in the course: ' + this.test.Name
            audit.Date = '';
  
            this.aService.AddAudit(audit).subscribe((data) => {
              //console.log(data);
              //this.refreshForm();
            })
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
                  width: '50vw',
                  height:'30vh'
                }
              );
            }
          });
          
           }
       });
      
    }

  onEditLesson(obj:any){
    let les = new Lesson();
    les.LessonID = obj.LessonID;
    les.LessonName = obj.LessonName;
    les.LessonDescription = obj.LessonDescription;
    les.SectionID = obj.SectionID;
    les.VideoID = obj.VideoID;

    sessionStorage['Lesson'] = JSON.stringify(les);
    this.router.navigate(['admin/maintain-lesson']);
  }

  onDeleteLesson(obj:any) {
    const title = 'Confirm Delete Lesson ';
    const message = 'Are you sure you want to delete the Lesson?';
    
    const dialogReference = this.dialog.open(
      ConfirmDialogComponent,
        {
          width: '50vw',
          height:'30vh',
          data: {
            dialogTitle: title,
            operation: 'delete',
            dialogMessage: message,
          },
        }
      );
      dialogReference.afterClosed().subscribe((result) => {
        if (result == true) {
          this.lService.DeleteLesson(obj.LessonID).subscribe((res:any) => 
          {
            if(res.Status===200)
            {
              this._snackBar.open(
                'Lesson deleted successfully!',
                      'OK',
                      {
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        duration: 3000,
                      }
              );
              this.getStructure();
    
              let audit = new AuditLog();
              audit.AuditLogID = 0;
              audit.UserID = this.security.User.UserID;
              audit.AuditName = 'Delete Lesson';
              audit.Description = 'Employee, ' + this.security.User.Username + ', deleted the Lesson: ' + obj.LessonName + ', in the course: ' + this.test.Name
              audit.Date = '';
    
              this.aService.AddAudit(audit).subscribe((data) => {
                //console.log(data);
                //this.refreshForm();
              })
            }
            else
            {
              const dialogReference = this.dialog.open(
                ExistsDialogComponent,
                {
                  data: {
                    dialogTitle: 'Delete Error',
                    dialogMessage: 'Cannot delete as there are attached lesson resources.',
                    operation: 'ok',
                  },
                  width: '50vw',
                  height:'30vh'
                }
              );
            }
          });
          
           }
       });
      
    }
 
  refreshList() {
    this.sectionService.GetCourseSections(this.test.CourseID).subscribe((result) => {
      this.displayList= result as Section[];
      this.dataSource.data = this.displayList;
    });
  } 
  
  onEditCourse()
  {
    this.router.navigate(['admin/maintain-course']);
  }

  onDeleteCourse()
  {
    console.log(this.test)
      const dialogReference = this.dialog.open(
        ConfirmDialogComponent,
        {
          width: '50vw',
          height:'30vh',
          data: {
            dialogTitle: 'Confirm Delete Course',
            operation: 'delete',
            dialogMessage: 'Are you sure you want to delete the Course?'
          },
        }
      );
      dialogReference.afterClosed().subscribe((result) => {
        if(result==true){
          this.service.DeleteCourse(this.test.CourseID).subscribe((res:any)=>
          {
            if(res.Status===200)
            {
              this._snackBar.open(
                'Course deleted successfully!',
                      'OK',
                      {
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        duration: 3000,
                      }
              );
              this.router.navigate(['admin/read-courses']);
              
              let audit = new AuditLog();
                audit.AuditLogID = 0;
                audit.UserID = this.security.User.UserID;
                audit.AuditName = 'Delete Course';
                audit.Description = 'Employee, ' + this.security.User.Username + ', deleted the Course: ' + this.test.Name
                audit.Date = '';
  
               this.aService.AddAudit(audit).subscribe((data) => {
               })   
            }
            else if(res.Status===501)
            {
              const dialogReference = this.dialog.open(ExistsDialogComponent, {
                data: {
                  dialogTitle: 'Cannot delete',
                  dialogMessage: 'Course is being used in other parts of the system',
                  operation: 'ok',
                },
                width: '50vw',
                height:'30vh'
              });
            }
            else
            {
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

          })
        }
      });
  }

  public doFilter = (event:Event) => {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase();
     if (this.dataSource.filteredData.length === 0) {

      const dialogReference = this.dialog.open(SearchDialogComponent, {

      });
      dialogReference.afterClosed().subscribe((result) => {
        if (result == true) {
         this.refreshList();
        }
      });
    }
  }

  addNewSection()
  {
    sessionStorage['cou'] = JSON.stringify(this.test);
    this.router.navigate(['admin/add-section']);
  }

  onViewSection(obj:any)
  {
    let sec = new Section();
    sec.CourseID = obj.CourseID;
    sec.SectionName = obj.SectionName;
    sec.SectionDescription = obj.SectionDescription;
    sec.SectionID = obj.SectionID;

    sessionStorage['Section'] = JSON.stringify(sec);
    this.router.navigate(['admin/view-section']);
  }

  onViewLesson(obj:any){
    let les = new Lesson();
    les.LessonID = obj.LessonID;
    les.LessonName = obj.LessonName;
    les.LessonDescription = obj.LessonDescription;
    les.SectionID = obj.SectionID;
    les.VideoID = obj.VideoID;

    sessionStorage['Lesson'] = JSON.stringify(les);
    this.router.navigate(['admin/view-lesson']);
  }

  onEditSection(obj:any){
    let sec = new Section();
    sec.CourseID = obj.CourseID;
    sec.SectionName = obj.SectionName;
    sec.SectionDescription = obj.SectionDescription;
    sec.SectionID = obj.SectionID;

    sessionStorage['Section'] = JSON.stringify(sec);
    this.router.navigate(['admin/maintain-section']);
  }

  
  onBack(){
    this.router.navigate(['admin/read-courses']);
  }

  onDeleteSection(obj:any) {

  
    const dialogReference = this.dialog.open(ConfirmDialogComponent, {
      width: '50vw',
      height:'30vh',
      data: {
        dialogTitle: 'Confirm Delete Section',
        operation: 'delete',
        dialogMessage:
          'Are you sure you want to delete the Section?',
      },
    });
    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        this.sectionService.DeleteSection(obj.SectionID).subscribe((res:any) => 
        {
          if(res.Status===200)
          {
            this._snackBar.open(
              'Section deleted successfully!',
                    'OK',
                    {
                      horizontalPosition: 'center',
                      verticalPosition: 'bottom',
                      duration: 3000,
                    }
            );
            this.getStructure();
  
            let audit = new AuditLog();
              audit.AuditLogID = 0;
              audit.UserID = this.security.User.UserID;
              audit.AuditName = 'Delete Section';
              audit.Description = 'Employee, ' + this.security.User.Username + ', deleted the Section: ' + obj.SectionName  + ', belonging to the Course: ' + this.test.Name
              audit.Date = '';
  
              this.aService.AddAudit(audit).subscribe((data) => {
                //console.log(data);
                //this.refreshForm();
              })
          }
          else
          {
            const dialogReference = this.dialog.open(ExistsDialogComponent, {
              data: {
                dialogTitle: 'Error',
                dialogMessage: 'Cannot delete as Lessons are attached to this section, please remove all subsequent lessons and children components first.',
                operation: 'ok',
              },
              width: '50vw',
              height:'36vh'
            });
          }
        }
        );
      }
    });
   
  }



}
