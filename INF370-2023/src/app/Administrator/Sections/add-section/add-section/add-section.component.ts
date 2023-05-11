import { Section } from 'src/app/Models/section.model';
import { SectionService } from 'src/app/Services/section.service';
import { CourseService } from 'src/app/Services/course.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';


@Component({
  selector: 'app-add-section',
  templateUrl: './add-section.component.html',
  styleUrls: ['./add-section.component.scss']
})
export class AddSectionComponent implements OnInit {
nameFormControl = new FormControl('', [Validators.required]);
descFormControl = new FormControl('', [Validators.required]);

courseID!:number;
section!:Section;
storageCourse:any;

SectionDisplayedColumns: string[] = [
  'name',
  'description'
];
public dataSource = new MatTableDataSource<any>();

noData = this.dataSource.connect().pipe(map((data) => data.length === 0));

@ViewChild(MatPaginator) paginator!: MatPaginator;

constructor(
  public router: Router,
  private location: Location,
  private titleservice: Title,
  private serviceS: SectionService,
  private snack:MatSnackBar,
  private service: CourseService,
  private dialog: MatDialog,
  public toaster: ToastrService,
  private toastr: ToastrService

) {this.titleservice.setTitle('Section'); }

ngOnInit(): void {
  this.storageCourse = JSON.parse(sessionStorage['Course']);
  this.courseID = this.storageCourse.CourseID;
  this.refreshList();
  this.refreshForm();
  }

  ngAfterViewInit() {

    this.dataSource.paginator = this.paginator;
    this.refreshList();
  }

refreshList() {
  this.serviceS.GetCourseSections(this.courseID).subscribe((result) => {
  this.dataSource.data = result as Section[];
})
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

onBack()
{
  this.router.navigate(['admin/view-course']);
}

refreshForm() {
  this.section = {
    CourseID: this.courseID,
    SectionID: 0,
    SectionName: '',
    SectionDescription: ''
  };
}

onArrowBack()
{
 this.location.back();
}

validateFormControls(): boolean {
  if (
    this.descFormControl.hasError('required') == false &&
    this.nameFormControl.hasError('required')  == false 
   
    )
    { return false}
    else
    {return true}
}

onSubmit() {
  const isInvalid = this.validateFormControls();
  if (isInvalid == true) {
    this.dialog.open(InputDialogComponent, {
      data: {
        dialogTitle: 'Add error',
        dialogMessage: 'Correct errors',
        operation: 'ok',
      },
      width: '25vw',
    height: '27vh',
    });
  } else
  {
  const dialogReference = this.dialog.open(ConfirmDialogComponent, {
    data: {
      dialogTitle: 'Confirm new Section',
      dialogMessage: 'Are you sure you want to add the new section?',
      operation: 'add',
    },
    width: '25vw',
  });

  dialogReference.afterClosed().subscribe((result) => {
    if (result == true) {
      this.serviceS.AddSection(this.section).subscribe((result:any) => {
        console.log(result);
        if(result.Status===200)
            {
             
              this.snack.open(
                'Section added successfully!',
                      'OK',
                      {
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        duration: 3000,
                      }
              );
              this.refreshList();
              this.router.navigate(['admin/view-course']);
            }
            else if(result.Status===400)
            {
              const dialogReference = this.dialog.open(
                ExistsDialogComponent,
                {
                  data: {
                    dialogTitle: 'Error',
                    dialogMessage: 'Invalid data, please ensure that the data is in the correct format',
                    operation: 'ok',
                  },
                  width: '25vw',
                }
              );
            }
            else if(result.Status===404)
            {
              const dialogReference = this.dialog.open(
                ExistsDialogComponent,
                {
                  data: {
                    dialogTitle: 'Section Exists under this course',
                    dialogMessage: 'Enter a new section name',
                    operation: 'ok',
                  },
                  width: '25vw',
                }
              );
            }
            else
            {
              const dialogReference = this.dialog.open(
                ExistsDialogComponent,
                {
                  data: {
                    dialogTitle: 'Error',
                    dialogMessage: 'Internal server error, please try again',
                    operation: 'ok',
                  },
                  width: '25vw',
                }
              );
            }

        }
      );
    }
  });
}
}





}
