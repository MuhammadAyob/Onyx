import { Component, OnInit,ViewChild } from '@angular/core';
import { CourseCategory } from 'src/app/Models/CourseCategory.model';
import { CourseCategoryService } from 'src/app/Services/course-category.service';
import { CourseService } from 'src/app/Services/course.service';
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
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { MatSort } from '@angular/material/sort';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { EmployeeListForCourses } from 'src/app/Models/employee.model';
@Component({
  selector: 'app-read-category',
  templateUrl: './read-category.component.html',
  styleUrls: ['./read-category.component.scss']
})
export class ReadCategoryComponent implements OnInit {
displayedColumns: string[] = [
    'Category',
    'edit',
    'delete',
];

public dataSource = new MatTableDataSource<CourseCategory>();
isLoading:boolean=true;
noData = this.dataSource.connect().pipe(map((data) => data.length === 0));

@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;

categoryList!: CourseCategory[];

category!: CourseCategory;
employeeList!:EmployeeListForCourses[];
constructor(
  private dialog: MatDialog,
  public router: Router,
  private location: Location,
  private service: CourseCategoryService,
  public toaster: ToastrService,
  private _snackBar: MatSnackBar,
  private titleservice: Title,
  private cService:CourseService
) {this.titleservice.setTitle('Course Category');}

ngOnInit(): void {
  this.refreshList();
 
}

ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
  this.refreshList();
}

public doFilter = (event:Event) => {
  this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase();
  if (this.dataSource.filteredData.length === 0) {
    const dialogReference = this.dialog.open(SearchDialogComponent, {});
    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        console.log(result);
        this.refreshList();
      }
    });
  }
};







refreshObject() {
  this.category = {
    CategoryID: 0,
    Category: ''
  };
}

refreshList() {
  this.service.GetCategories().subscribe((result) => {
    this.dataSource.data = result as CourseCategory[];
   this.isLoading=false;
  });
}


onEdit(obj:any) {
  sessionStorage['CourseCategory'] = JSON.stringify(obj);
  this.router.navigate(['admin/maintain-category']);
}

addNew(): void {
  this.router.navigate(['admin/add-category']);
}

onArrowBack(): void {
  this.location.back();
}

onDelete(id:number) {
  const title = 'Confirm Delete Category';
  const message = 'Are you sure you want to delete the qualification?';
  
  const dialogReference = this.dialog.open(ConfirmDialogComponent, {
    data: {
      dialogTitle: title,
      dialogMessage: message,
      operation: 'delete',
      qualificationData: this.category,
    }, //^captured department info here for validation
    height: '30vh',
    width: '50vw',
  });

  dialogReference.afterClosed().subscribe((result) => {
    if (result == true) {
      this.service.DeleteCategory(id).subscribe(
        (result:any) => {
          if(result.Status===200)
          {
            this._snackBar.open(
              'Category deleted successfully!',
                    'OK',
                    {
                      horizontalPosition: 'center',
                      verticalPosition: 'bottom',
                      duration: 3000,
                    }
            );
            this.refreshList();
          }
          else
          {
            this.dialog.open(InputDialogComponent, {
              height: '30vh',
              width: '50vw',
              data: {
                dialogTitle: 'Delete Category',
                dialogMessage:'Cannot delete Category as it is in use in other parts of the system.'
              },
            });
          }
        }
      );
    }
  });
  
  
}

}
