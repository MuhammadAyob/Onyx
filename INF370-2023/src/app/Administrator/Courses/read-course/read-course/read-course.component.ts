import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { map } from 'rxjs/operators';
import { CourseService } from 'src/app/Services/course.service';
import { CourseDetails } from 'src/app/Models/course-details.model';
import { MatSort } from '@angular/material/sort';
import { EmployeeListForCourses } from 'src/app/Models/employee.model';

@Component({
  selector: 'app-read-course',
  templateUrl: './read-course.component.html',
  styleUrls: ['./read-course.component.scss']
})
export class ReadCourseComponent implements OnInit {
course!:CourseDetails;

displayedColumns: string[] = [
  'Image',
  'CourseName',
  'Price',
  'Active',
  'view'
];
public dataSource = new MatTableDataSource<any>();

noData = this.dataSource.connect().pipe(map((data) => data.length === 0));

@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;

displayList!: CourseDetails[];

constructor(
  private dialog: MatDialog,
  public router: Router,
  private location: Location,
  private service: CourseService,
  public toaster: ToastrService,
  private _snackBar: MatSnackBar,
  private titleservice: Title
) {this.titleservice.setTitle('Courses'); }

  ngOnInit(): void {
    this.refreshList();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.refreshList();
  }

  public doFilter = (event: Event) => {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase();
    if (this.dataSource.filteredData.length === 0) {
      const dialogReference = this.dialog.open(SearchDialogComponent, {});
      dialogReference.afterClosed().subscribe((result) => {
        if (result == true) {
          this.refreshList();

        }
      });
    }
  };
  refreshList() {
    this.service.GetCourseDetails().subscribe((result) => {
      this.displayList= result as CourseDetails[];
      this.dataSource.data = this.displayList;
    });
  }

onView(obj:any) {
 sessionStorage['Course'] = JSON.stringify(obj);
 this.router.navigate(['admin/view-course']);
}

onArrowBack(): void {
  this.location.back();
}
  
addNew(): void {
  this.router.navigate(['admin/add-course']);
}
  
  


}
