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
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { map } from 'rxjs/operators';
import { RatingsService } from 'src/app/Services/ratings.service';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';

@Component({
  selector: 'app-read-ratings',
  templateUrl: './read-ratings.component.html',
  styleUrls: ['./read-ratings.component.scss']
})
export class ReadRatingsComponent implements OnInit {
starArray: number[] = [1, 2, 3, 4, 5];

displayedColumns: string[] = [
'Date',
'Course',
'Rating',
'Comment',
'edit',
'delete'
];

public dataSource = new MatTableDataSource<any>();
noData = this.dataSource.connect().pipe(map(data=>data.length===0));

@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!:MatSort;

ratingList!:any[];
StudentID:any;
rating:any;
  
constructor(
  private dialog:MatDialog,
  public router:Router,
  private location:Location,
  private service:CourseService,
  private rService:RatingsService,
  public toaster:ToastrService,
  private _snackBar:MatSnackBar,
  private titleservice:Title
) { this.titleservice.setTitle('Ratings');}

  
ngOnInit(): void {
this.StudentID = sessionStorage.getItem('StudentID');
console.log(this.StudentID);
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
  this.service.GetPersonalRatings(this.StudentID).subscribe((result) => {
    console.log(result);
    this.dataSource.data = result as any[];
  });
}

onEdit(obj:any) {
  sessionStorage['rating'] = JSON.stringify(obj);
  this.router.navigate(['student/maintain-rating']);
}

addNew(): void {
  this.router.navigate(['student/add-rating']);
}

onDelete(obj:any) {
  const title = 'Confirm Delete Rating>';
  const message = 'Are you sure you want to delete the Rating?';

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
          this.rService.DeleteRating(obj.RatingID).subscribe((res:any) => 
          {
            if(res.Status===200)
            {
              this._snackBar.open(
                'Rating deleted successfully!',
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
                    dialogTitle: "Delete Rating",
                    dialogMessage: "Rating cannot be deleted as it is in use in other parts of the system."
                  },
                }
              );
            }

          
          });
        }
      });
    }

}
