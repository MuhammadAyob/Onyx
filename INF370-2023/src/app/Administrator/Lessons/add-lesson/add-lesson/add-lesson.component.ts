import { Section } from 'src/app/Models/section.model';
import { Lesson } from 'src/app/Models/lesson.model';
import { LessonService } from 'src/app/Services/lesson.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';

@Component({
  selector: 'app-add-lesson',
  templateUrl: './add-lesson.component.html',
  styleUrls: ['./add-lesson.component.scss']
})
export class AddLessonComponent implements OnInit {

lesson!: Lesson;
storageSection: any;
storageCourse:any;

nameFormControl = new FormControl('', [Validators.required]);
descFormControl = new FormControl('', [Validators.required]);
videoFormControl = new FormControl('', [Validators.required]);

LessonDisplayedColumns: string[] = [
  'name',
  'description'
];

public LessonDataSource = new MatTableDataSource<any>();
noData = this.LessonDataSource.connect().pipe(map((data) => data.length === 0));

@ViewChild(MatPaginator) paginator!: MatPaginator;

constructor(
  public router: Router,
  private location: Location,
  private dialog: MatDialog,
  private serviceL: LessonService,
  private snack:MatSnackBar,
  public toastr: ToastrService,
  private titleservice: Title,
  public formbuilder: FormBuilder
) { this.titleservice.setTitle('Lesson');}

  ngOnInit(): void {
    this.storageCourse=JSON.parse(sessionStorage['Course']);
    this.storageSection=JSON.parse(sessionStorage['Section']);
    this.refreshList();
    this.refreshForm();
  }

  ngAfterViewInit() {

    this.LessonDataSource.paginator = this.paginator;
    this.refreshList();
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

refreshList() {
  this.serviceL.GetSectionLessons(this.storageSection.SectionID).subscribe((result) => {
  this.LessonDataSource.data = result as Lesson[];
  console.log(this.LessonDataSource.data);
    });
  }

refreshForm(){
this.lesson = {
  LessonID:0,
  SectionID: this.storageSection.SectionID,
  LessonName:'',
  LessonDescription:'',
  VideoID:''
};
}

onBack()
{
  this.router.navigate(['admin/view-section']);
}

onArrowBack(){
  this.location.back();
  }

validateFormControls(): boolean {
  if (
    this.descFormControl.hasError('required') == false &&
        this.nameFormControl.hasError('required')  == false &&
        this.descFormControl.hasError('required') == false &&
        this.videoFormControl.hasError('required') == false 
  )
  {return false}
  else{return true}
}

showDialog(title: string, message: string): void {
  const dialogReference = this.dialog.open(ConfirmDialogComponent, {
    data: {
      dialogTitle: title,
      dialogMessage: message,
      operation: 'add',
    },
    width: '25vw',
  });

  dialogReference.afterClosed().subscribe((result) => {
    if (result == true) 
    {
      this.serviceL.AddLesson(this.lesson).subscribe((result:any)=>
      {
        if(result.Status===200)
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
          this.refreshForm();
          this.router.navigate(['admin/view-section']);
        }
        else if(result.Status===400)
        {
          const dialogReference = this.dialog.open(
            ExistsDialogComponent,
            {
              data: {
                dialogTitle: 'Error',
                dialogMessage: 'Invalid data, ensure data is in the correct format',
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
                dialogTitle: 'Lesson exists under section',
                dialogMessage: 'Enter new lesson name',
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
      })
    }
  });
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
  } 
  else 
  {
  const title = 'Confirm New Lesson';
  const message = 'Are you sure you want to add the new Lesson?';
  this.showDialog(title, message);
  }
}

}
