import { LessonService } from 'src/app/Services/lesson.service';
import { CourseService } from 'src/app/Services/course.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Lesson } from 'src/app/Models/lesson.model';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { LessonResourceService } from 'src/app/Services/lesson-resource.service';
import { LessonResource } from 'src/app/Models/LessonResource.model';
import { MatPaginator } from '@angular/material/paginator';
import { map } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-view-lesson',
  templateUrl: './view-lesson.component.html',
  styleUrls: ['./view-lesson.component.scss']
})
export class ViewLessonComponent implements OnInit {

ResourceDisplayedColumns: string[] = [
  'name',
  'view'
];

test!: Lesson;
section: any;
course: any;

public ResourceDataSource = new MatTableDataSource<any>();

noData = this.ResourceDataSource.connect().pipe(map((data) => data.length === 0));

@ViewChild(MatPaginator) paginator!: MatPaginator;
  
constructor(
  public router: Router,
    private location: Location,
    private service: LessonService,
    private serviceLR:LessonResourceService,
    private dialog: MatDialog,
    private titleservice: Title,
    private toastr: ToastrService,
    private snack:MatSnackBar
) {this.titleservice.setTitle('Lesson');}


ngOnInit(): void {
this.test=JSON.parse(sessionStorage['Lesson']);
this.section=JSON.parse(sessionStorage['Section']);
this.course=JSON.parse(sessionStorage['Course']);
this.refreshList();
}

refreshList() {
  this.serviceLR.GetLessonsResources(this.test.LessonID).subscribe((result) => {
    this.ResourceDataSource.data = result as any[];
  });
}

addNewLessonResource() {
  this.router.navigate(['admin/add-resource']);
}

onViewLessonResource(obj:any) {
  sessionStorage['LessonResource'] = JSON.stringify(obj);
  this.router.navigate(['admin/view-resource']);
}

onBack()
{
  this.router.navigate(['admin/view-section']);
}

ngAfterViewInit() {

  this.ResourceDataSource.paginator = this.paginator;
  this.refreshList();
}

public doFilter = (event:Event) => {
  this.ResourceDataSource.filter = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase();
   if (this.ResourceDataSource.filteredData.length === 0) {

    const dialogReference = this.dialog.open(SearchDialogComponent, {

    });
    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
       this.refreshList();
      }
    });
  }
}

onEdit()
{
this.router.navigate(['admin/maintain-lesson']);
}

onArrowBack()
{
  this.location.back();
}

onDelete() {
const title = 'Confirm Delete Lesson ';
const message = 'Are you sure you want to delete the Lesson?';

const dialogReference = this.dialog.open(
  ConfirmDialogComponent,
    {
      width: '25vw',
      data: {
        dialogTitle: title,
        operation: 'delete',
        dialogMessage: message,
      },
    }
  );
  dialogReference.afterClosed().subscribe((result) => {
    if (result == true) {
      this.service.DeleteLesson(this.test.LessonID).subscribe((res:any) => 
      {
        if(res.Status===200)
        {
          this.snack.open(
            'Lesson added successfully!',
                  'OK',
                  {
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                    duration: 3000,
                  }
          );
          this.router.navigate(['admin/view-section']);
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
              width: '25vw',
            }
          );
        }
      });
      
       }
   });
  
}


}
