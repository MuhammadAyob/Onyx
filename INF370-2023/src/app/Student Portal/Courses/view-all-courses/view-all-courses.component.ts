import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { AfterViewInit,ViewChild, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CourseService } from 'src/app/Services/course.service';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-view-all-courses',
  templateUrl: './view-all-courses.component.html',
  styleUrls: ['./view-all-courses.component.scss']
})
export class ViewAllCoursesComponent implements OnInit {
displayedColumns: string[] = [
    'Image',
    'Name',
    'view'
];
public dataSource = new MatTableDataSource<any>();
noData = this.dataSource.connect().pipe(map(data=>data.length===0));


@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!:MatSort;

courseList!:any[];
StudentID:any;
course:any;

isLoading:boolean=true;

constructor(
  private dialog:MatDialog,
  public router:Router,
  private location:Location,
  private service:CourseService,
  public toaster:ToastrService,
  private _snackBar:MatSnackBar,
  private titleservice:Title) 
  { this.titleservice.setTitle('My Courses');}

ngOnInit(): void {
this.StudentID = sessionStorage.getItem('StudentID');
this.refreshList();
}

ngAfterViewInit(){
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
  this.refreshList();
}

public doFilter = (event: Event) => {
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

refreshList() {
  this.service.GetEnrolledCourses(this.StudentID).subscribe((result) => {
    this.dataSource.data = result as any[];
    this.isLoading=false;
  });
}

onView(obj:any) {
  sessionStorage['Course'] = JSON.stringify(obj);
  this.router.navigate(['student/view-course-content']);
}

}
