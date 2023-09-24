import { LessonService } from 'src/app/Services/lesson.service';
import { SectionService } from 'src/app/Services/section.service';
import { CourseService } from 'src/app/Services/course.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { Section } from 'src/app/Models/section.model';
import { Lesson } from 'src/app/Models/lesson.model';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { AuditLogService } from 'src/app/Services/audit-log.service';
import { AuditLog } from 'src/app/Models/audit.model';
import { SecurityService } from 'src/app/Services/security.service';

@Component({
  selector: 'app-view-section',
  templateUrl: './view-section.component.html',
  styleUrls: ['./view-section.component.scss']
})
export class ViewSectionComponent implements OnInit {

constructor(
  private dialog: MatDialog,
  public router: Router,
  private location: Location,
  private serviceS: SectionService,
  private serviceL: LessonService,
  private snack:MatSnackBar,
  public toaster: ToastrService,
  private titleservice: Title,
  private toastr: ToastrService,
  private aService:AuditLogService,
  private security:SecurityService
) { this.titleservice.setTitle('Section');}

test!:Section;
course!:any
isLoading:boolean=true;
LessonDisplayedColumns: string[] = [
  'name',
  'description',
  'view',
];

public LessonDataSource = new MatTableDataSource<any>();

noData = this.LessonDataSource.connect().pipe(map((data) => data.length === 0));

@ViewChild(MatPaginator) paginator!: MatPaginator;


ngOnInit(): void {
  this.course=JSON.parse(sessionStorage['Course']);
  this.test = JSON.parse(sessionStorage['Section']);
 // this.refreshList();

}

public doFilter = (event:Event) => {
  this.LessonDataSource.filter = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase();
   if (this.LessonDataSource.filteredData.length === 0) {

    const dialogReference = this.dialog.open(SearchDialogComponent, {

    });
    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
       this.refreshList();
      }
    });
  }
}

ngAfterViewInit() {

  this.LessonDataSource.paginator = this.paginator;
  this.refreshList();
}

refreshList() {
  this.serviceL.GetSectionLessons(this.test.SectionID).subscribe((result) => {
    this.LessonDataSource.data = result as Lesson[];
    this.isLoading=false;
  });
}

addNewLesson() {
  this.router.navigate(['admin/add-lesson']);
}

onViewLesson(obj:any) {
  sessionStorage['Lesson'] = JSON.stringify(obj);
  this.router.navigate(['admin/view-lesson']);
}

onBack() {
  this.router.navigate(['admin/view-course']);
}

onEditSection() {
  this.router.navigate(['admin/maintain-section']);
}

onArrowBack() {
  this.location.back();
}

onDeleteSection() {

  
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
      this.serviceS.DeleteSection(this.test.SectionID).subscribe((res:any) => 
      {
        if(res.Status===200)
        {
          this.snack.open(
            'Section deleted successfully!',
                  'OK',
                  {
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                    duration: 3000,
                  }
          );
          this.router.navigate(['admin/view-course']);

          let audit = new AuditLog();
            audit.AuditLogID = 0;
            audit.UserID = this.security.User.UserID;
            audit.AuditName = 'Delete Section';
            audit.Description = 'Employee, ' + this.security.User.Username + ', deleted the Section: ' + this.test.SectionName  + ', belonging to the Course: ' + this.course.Name
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
