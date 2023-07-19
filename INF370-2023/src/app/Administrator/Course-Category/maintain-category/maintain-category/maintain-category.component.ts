import { Component, OnInit } from '@angular/core';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseCategory } from 'src/app/Models/CourseCategory.model';
import { CourseCategoryService } from 'src/app/Services/course-category.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-maintain-category',
  templateUrl: './maintain-category.component.html',
  styleUrls: ['./maintain-category.component.scss']
})
export class MaintainCategoryComponent implements OnInit {
nameFormControl = new FormControl('', [Validators.required]);

isLoading!:boolean;
category!: CourseCategory;
categoryList!: CourseCategory[];
public dataSource = new MatTableDataSource<CourseCategory>();

constructor(
  public router: Router,
  private location: Location,
  private dialog: MatDialog,
  private service: CourseCategoryService,
  private titleservice: Title,
  public toastr: ToastrService,
  private snack: MatSnackBar
) { this.titleservice.setTitle('Course Category');}

ngOnInit(): void {
  this.category = JSON.parse( sessionStorage['CourseCategory'] );
}

onBack(): void {
  this.router.navigate([
    'admin/read-categories',
  ]);
}

refreshList() {
  this.service.GetCategories().subscribe((result) => {
    this.dataSource.data = result as CourseCategory[];
  });
}

onSubmit() {
  const isInvalid = this.validateFormControls();
  if (isInvalid == true) {
    this.dialog.open(InputDialogComponent, {
      data: {
        dialogTitle: "Input Error",
        dialogMessage: "Correct Errors on Highlighted fields"
      },
      width: '25vw',
      height: '28vh',
    });
  } else {
    const title = 'Confirm Edit Category';
    const message =
      'Are you sure you want to save changes to the Category?';
    this.showDialog(title, message);
  }
}

showDialog(title: string, message: string): void {
  const dialogReference = this.dialog.open(ConfirmDialogComponent, {
    data: {
      dialogTitle: title,
      dialogMessage: message,
    },
    height: '30vh',
    width: '50vw',
  });

  dialogReference.afterClosed().subscribe((result) => {
    if (result == true) {
      this.isLoading=true;
      this.service
        .UpdateCategory(
          this.category.CategoryID,
          this.category
        )
        .subscribe((result:any) => {
          if (result.Status === 200) 
          {
            this.snack.open(
              'Category updated successfully!',
              'OK',
              {
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                duration: 3000,
              }
            );
            this.isLoading=false;
            this.router.navigate([
              'admin/read-categories',
            ]);
          } 

          else if(result.Status===400)
          {
            this.isLoading=false;
            const dialogReference = this.dialog.open(
              ExistsDialogComponent,
              {
                data: {
                  dialogTitle: 'Error',
                  dialogMessage: 'Invalid data post, please ensure data is in correct format.',
                  operation: 'ok',
                },
                height: '30vh',
                width: '50vw',
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
                  dialogTitle: 'Error',
                  dialogMessage: 'Category exists, please enter a different Category name',
                  operation: 'ok',
                },
                height: '30vh',
                width: '50vw',
              }
            );
          }

          else
          {
            this.isLoading=false;
            const dialogReference = this.dialog.open(
              ExistsDialogComponent,
              {
                data: {
                  dialogTitle: 'Error',
                  dialogMessage: 'Internal server error, please try again.',
                  operation: 'ok',
                },
                height: '30vh',
                width: '50vw',
              }
            );
          }
        });
    }
  });
}

validateFormControls(): boolean {
  if (
    this.nameFormControl.hasError('required') == false
  )
  {return false}
  else
  {return true}
}



}
