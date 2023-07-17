import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { AfterViewInit,ViewChild, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { StudentDetails } from 'src/app/Models/StudentDetails.model';
import { StudentService } from 'src/app/Services/student.service';
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
  selector: 'app-read-students',
  templateUrl: './read-students.component.html',
  styleUrls: ['./read-students.component.scss']
})
export class ReadStudentsComponent implements OnInit {
  displayedColumns: string[] = [
    'Title',
    'Name',
    'Surname',
    'Email',
    'Phone',
    'delete'
    ];

 public dataSource = new MatTableDataSource<StudentDetails>();
 noData = this.dataSource.connect().pipe(map(data=>data.length===0));

 isLoading:boolean =true;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;

  studentlist!:StudentDetails[];

  constructor( 
    private dialog:MatDialog,
    public router:Router,
    private location:Location,
    private service:StudentService,
    public toaster:ToastrService,
    private _snackBar:MatSnackBar,
    private titleservice:Title) 
    { this.titleservice.setTitle('Students');}

  ngOnInit(): void {
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
    this.service.GetStudents().subscribe((result) => {
      this.dataSource.data = result as StudentDetails[];
      this.isLoading=false;
    });
  }

  onDelete(obj:any) {
    const title = 'Confirm Deactivate Student';
    const message = 'Are you sure you want to deactivate the Student?';

    const dialogReference = this.dialog.open(
          ConfirmDialogComponent,
          {
            height: '30vh',
            width: '50vw',
            data: {
              dialogTitle: title,
              operation: 'delete',
              dialogMessage: message,
            },
          }
        );
        dialogReference.afterClosed().subscribe((result) => {
          if (result == true) {
            this.service.DeleteStudent(obj.StudentID).subscribe((res:any) => 
            {
              if(res.Status===200)
              {
                this._snackBar.open(
                  'Student deactivated successfully!',
                        'OK',
                        {
                          horizontalPosition: 'center',
                          verticalPosition: 'bottom',
                          duration: 3000,
                        });
                this.refreshList();
              }

            

              else
              {
                this.dialog.open(
                  InputDialogComponent,
                  {
                    height: '30vh',
                    width: '50vw',
                    data: {
                      dialogTitle: "Error",
                      dialogMessage: "Internal server error, please try again."
                    },
                  }
                );
              }
            
            });
          }
        });
      }

}
