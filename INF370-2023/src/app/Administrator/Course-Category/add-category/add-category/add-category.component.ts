import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseCategory } from 'src/app/Models/CourseCategory.model';
import { CourseCategoryService } from 'src/app/Services/course-category.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {
nameFormControl = new FormControl('', [Validators.required]);

category!:CourseCategory;

constructor(
  public router: Router,
  private location: Location,
  private dialog: MatDialog,
  private service: CourseCategoryService,
  public toastr: ToastrService,
  private snack: MatSnackBar,
  private titleservice: Title
) { this.titleservice.setTitle('Course Category');}



ngOnInit(): void {
  this.refreshForm();
}

refreshForm() {
  this.category = {
    CategoryID: 0,
    Category: ''
  };
}

onSubmit() {
  const isInvalid = this.validateFormControls();
  if (isInvalid == true) {
    this.dialog.open(InputDialogComponent, {
      data: {
        dialogTitle: "Input Error",
        dialogMessage: "Correct Errors"
      },
      width: '25vw',
      height: '27vh',
    });
  } else {
    const title = 'Confirm New qualification';
    const message = 'Are you sure you want to add the new qualification?';
    this.showDialog(title, message);
  }
}

validateFormControls(): boolean {
  if (
    this.nameFormControl.hasError('required') == false
  )
  {return false}
  else
  {return true}
}

onArrowBack(): void {
  this.location.back();
}
onBack() {
  this.location.back();
}

showDialog(title: string, message: string): void {
  const dialogReference = this.dialog.open(ConfirmDialogComponent, {
    data: {
      dialogTitle: title,
      dialogMessage: message,
      operation: 'add',
      qualificationData: this.category,
    }, //^captured department info here for validation
    height: '27vh',
    width: '25vw',
  });

  dialogReference.afterClosed().subscribe((result) => {
    if (result == true) {
      this.service.AddCategory(this.category).subscribe(
        (result:any) => {
          if(result.Status===200)
          {
            this.snack.open(
              'Qualification added successfully!',
                    'OK',
                    {
                      horizontalPosition: 'center',
                      verticalPosition: 'bottom',
                      duration: 3000,
                    }
            );
            this.category = result as CourseCategory;
            this.refreshForm();
            this.router.navigate(['admin/read-categories']);
          }

          else if(result.Status===400)
          {
            const dialogReference = this.dialog.open(
              ExistsDialogComponent,
              {
                data: {
                  dialogTitle: 'Error',
                  dialogMessage: 'Invalid data post, please ensure data is in correct format',
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
                  dialogTitle: 'Category Exists',
                  dialogMessage: 'Enter a different category name',
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
                  dialogMessage: 'Internal server error, please try again.',
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
