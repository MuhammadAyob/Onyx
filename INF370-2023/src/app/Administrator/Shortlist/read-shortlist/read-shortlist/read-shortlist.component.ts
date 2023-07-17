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
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { Shortlist } from 'src/app/Models/shortlist.model';
import { ShortlistService } from 'src/app/Services/shortlist.service';
import { MatSort } from '@angular/material/sort';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';

@Component({
  selector: 'app-read-shortlist',
  templateUrl: './read-shortlist.component.html',
  styleUrls: ['./read-shortlist.component.scss']
})
export class ReadShortlistComponent implements OnInit {
  displayedColumns: string[] = [
    'Image',
    'Name', 
    'Surname',  
    'JobOpp', 
    'Status',
    'view',
    'offer',
    'delete'
  ];

  public dataSource = new MatTableDataSource<Shortlist>();
  noData = this.dataSource.connect().pipe(map((data) => data.length === 0));
  isLoading:boolean=true;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  shortlistList!: Shortlist[];

  shortlist!: Shortlist;

  constructor(
    public router: Router,
    private location: Location,
    private titleservice: Title,
    private service: ShortlistService,
    public toaster: ToastrService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) { this.titleservice.setTitle('Shortlist');}

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

  refreshList(){
    this.service.GetShortlist().subscribe((result)=>{
      this.dataSource.data=result as Shortlist[];
      this.isLoading=false;
    })
  }

  onView(obj:any) {
    sessionStorage['shortlist'] = JSON.stringify(obj);
    this.router.navigate([
      'admin/view-shortlist',
    ]);
  }

  onDelete(obj:any) {
    const title = 'Confirm Removing Shortlisted Candidate';
    const popupMessage = 'Shortlisted candidate was removed successfully';
    const message =
      'Are you sure you want to remove this Shortlisted Candidate?';

    const dialogReference = this.dialog.open(ConfirmDialogComponent, {
      width: '50vw',
      height:'30vh',
      data: {
        dialogTitle: title,
        operation: 'delete',
        dialogMessage: message,
        dialogPopupMessage: popupMessage,
        skillTypeData: obj,
      },
    });

    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        this.service.RemoveFromShortlist(obj.ApplicationID).subscribe((result:any) => {
       console.log(result);
       if(result.Status===200)
       {
        this._snackBar.open(
          'Applicant removed from Shortlist successfully!',
                'OK',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom',
                  duration: 3000,
                });
        this.refreshList();
       }
       else if(result.Status === 300)
       {
        this.dialog.open(
          InputDialogComponent,
          {
            height: '30vh',
            width: '50vw',
            data: {
              dialogTitle: "Error. Candidate has an existing interview slot",
              dialogMessage: "Delete interview slot first before removing from Shortlist"
            },
          }
        );
       }
       else if(result.Status === 400)
       {
        this.dialog.open(
          InputDialogComponent,
          {
            height: '30vh',
            width: '50vw',
            data: {
              dialogTitle: "Error",
              dialogMessage: "Candidate has already been offered employment. Reject candidate instead"
            },
          }
        );
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
              dialogMessage: "Internal server error. Please try again."
            },
          }
        );
       }
        });
      }
    });
  }

  OfferEmployment(obj:any) {
    const title = 'Confirm Offer Employment';
    const popupMessage = 'Employment contract has been sent!';
    const message =
      'Are you sure you want to offer this Applicant Employment?';

    const dialogReference = this.dialog.open(ConfirmDialogComponent, {
      width: '50vw',
      height:'30vh',
      data: {
        dialogTitle: title,
        operation: 'delete',
        dialogMessage: message,
        dialogPopupMessage: popupMessage,
        skillTypeData: obj,
      },
    });

    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        this.service.OfferEmployment(obj.ApplicationID).subscribe((result:any) => {
       console.log(result);
       if(result.Status===200)
       {
        this._snackBar.open(
          'Employee contract has been sent to candidate!',
                'OK',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom',
                  duration: 3000,
                });
        this.refreshList();
       }
       else if(result.Status === 300)
       {
        this.dialog.open(
          InputDialogComponent,
          {
            height: '30vh',
            width: '50vw',
            data: {
              dialogTitle: "Error",
              dialogMessage: "Applicant has already been offered employment"
            },
          }
        );
       }
       else if(result.Status === 400)
       {
        this.dialog.open(
          InputDialogComponent,
          {
            height: '30vh',
            width: '50vw',
            data: {
              dialogTitle: "Error",
              dialogMessage: "Applicant has not attended interview. Please ensure attendance has been taken before proceeding."
            },
          }
        );
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
              dialogMessage: "Internal server error. Please try again."
            },
          }
        );
       }
        });
      }
    });
  }

  

}
