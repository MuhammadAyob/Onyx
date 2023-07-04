import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { Title } from '@angular/platform-browser';
import { Rating } from 'src/app/Models/rating.model';
import { RatingsService } from 'src/app/Services/ratings.service';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-maintain-rating',
  templateUrl: './maintain-rating.component.html',
  styleUrls: ['./maintain-rating.component.scss']
})
export class MaintainRatingComponent implements OnInit {
rating!:any;
sRating:number=1;
commentFormControl = new FormControl('', [Validators.required]);
constructor(
  public router: Router,
  private location: Location,
  private dialog: MatDialog,
  private service: RatingsService,
  public toastr: ToastrService,
  private _snack:MatSnackBar,
  private titleservice: Title) 
  {this.titleservice.setTitle('Ratings'); }

  ngOnInit(): void {
    this.rating = JSON.parse(sessionStorage['rating']);
    this.sRating = this.rating.Rating;
  }
  
  onBack(): void {
    this.location.back();
  }


stars: number[] = [1, 2, 3, 4, 5];

rate(star: number) {
  this.sRating = star;
}

  onSubmit() {
    this.rating.Rating = this.sRating;
    console.log(this.rating);
    
    const isInvalid = this.validateFormControls();
    if (isInvalid == true) {
      this.dialog.open(InputDialogComponent, {
        data: {
          dialogTitle: "Input Error",
          dialogMessage: "Correct Errors"
        },
        width: '50vw',
        height: '30vh',
      });
    } else {
      const title = 'Confirm Update Rating';
      const message = 'Are you sure you want to save changes to the Rating?';
      const popupMessage = 'Rating changes successful!';
      this.showDialog(title, message, popupMessage);
    }
  }

  showDialog(title: string, message: string, popupMessage: string): void {
    const dialogReference = this.dialog.open(ConfirmDialogComponent, {
      data: {
        dialogTitle: title,
        dialogMessage: message,
        dialogPopupMessage: popupMessage,
        operation: 'add',
        departmentData: this.rating,
      }, //^captured department info here for validation
      height: '30vh',
      width: '50vw',
    });

    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        this.service
          .UpdateRating(this.rating.RatingID, this.rating)
          .subscribe((result:any) => {
            if (result.Status === 200) 
            {
              this._snack.open(
                'Rating updated successfully!',
                      'OK',
                      {
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        duration: 3000,
                      }
              );
              this.router.navigate(['student/read-ratings']);

            } 
          

            else
            {
              const dialogReference = this.dialog.open(
                ExistsDialogComponent,
                {
                  data: {
                    dialogTitle: 'Error',
                    dialogMessage: 'Internal server error. Please try again',
                    operation: 'ok',
                  },
                  width: '50vw',
                  height:'30vh'
                }
              );
            }
          });
      }
    });
  }

  validateFormControls(): boolean {
    if (
      this.commentFormControl.hasError('required') == false
    )
    {return false}
    else
    {return true}
  }

}
