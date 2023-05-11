import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { Qualification } from 'src/app/Models/qualification.model';
import { QualificationService } from 'src/app/Services/qualification.service';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-qualification',
  templateUrl: './view-qualification.component.html',
  styleUrls: ['./view-qualification.component.scss']
})
export class ViewQualificationComponent implements OnInit {
  test!: Qualification;
  qualificationList!: Qualification[];
  id: any;
  constructor(
    public router: Router,
    private location: Location,
    private service: QualificationService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private titleservice: Title
  ) {this.titleservice.setTitle('Qualifications');}

  ngOnInit(): void {
    this.test = JSON.parse( sessionStorage['qualification'] );
  }

  refreshList() {
    this.service.GetQualifications().subscribe((result) => {
    this.qualificationList = result as Qualification[];
  });
}

onBack() {
  this.location.back();
}

onEdit() {
  this.test;
  this.router.navigate(['admin/maintain-qualification']);
  this.refreshList();
}

onDelete() {
  const title = 'Confirm Delete qualification';
  const message = 'Are you sure you want to delete the qualification?';
  
  const dialogReference = this.dialog.open(ConfirmDialogComponent, {
    data: {
      dialogTitle: title,
      dialogMessage: message,
      operation: 'delete',
    }, //^captured department info here for validation
    height: '30vh',
    width: '50vw',
  });

  dialogReference.afterClosed().subscribe((result) => {
    if (result == true) {
      this.service.DeleteQualification(this.test.QualificationID).subscribe(
        (result:any) => {
          if(result.Status===200)
          {
            this.snack.open(
              'Qualification deleted successfully!',
                    'OK',
                    {
                      horizontalPosition: 'center',
                      verticalPosition: 'bottom',
                      duration: 3000,
                    }
            );
            this.refreshList();
            this.router.navigate(['admin/read-qualification']);

          }

          else if(result.Status===501)
          {
            this.dialog.open(InputDialogComponent, {
              height: '30vh',
              width: '50vw',
              data: {
                dialogTitle: 'Error',
                dialogMessage:'Cannot delete Qualification as it is being used in other parts of the system.'
              },
            });
          }

          else
          {
            this.dialog.open(InputDialogComponent, {
              height: '30vh',
              width: '50vw',
              data: {
                dialogTitle: 'Delete Qualification',
                dialogMessage:'Internal server error, please try again.'
              },
            });
          }
        }
      );
    }
  });
  
  
}
onArrowBack() {
  this.location.back();
}


}
