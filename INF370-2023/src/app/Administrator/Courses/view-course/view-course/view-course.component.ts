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

SectionDisplayedColumns: string[] = [
  'name',
  'description',
  'view'
];

public dataSource = new MatTableDataSource<any>();

noData = this.dataSource.connect().pipe(map((data) => data.length === 0));

@ViewChild(MatPaginator) paginator!: MatPaginator;
isLoading:boolean=true;
displayList!: Section[];

constructor( private dialog: MatDialog,
  public router: Router,
  private location: Location,
  private service: CourseService,
  public toaster: ToastrService,
  private _snackBar: MatSnackBar,
  private titleservice: Title,
  private toastr: ToastrService,
  private sectionService:SectionService
  ) 
  { this.titleservice.setTitle('Course');}

  getEmployeeList() {
    this.service.GetCourseAssistants(this.test.CourseID).subscribe((result) => {
     this.employeeList = result as any[];
     this.isLoading=false;
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

  ngOnInit(): void {
    this.test=JSON.parse( sessionStorage['Course'] );
    this.refreshList();
    this.getCategory();
    this.getEmployeeList();

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
    sessionStorage['Section'] = JSON.stringify(obj);
    this.router.navigate(['admin/view-section']);
  }

  onArrowBack()
  {
  this.location.back();
  }
  onBack(){
    this.router.navigate(['admin/read-courses']);
  }



}
