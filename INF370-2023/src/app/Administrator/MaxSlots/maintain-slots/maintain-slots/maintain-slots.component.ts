import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { MaxSlotsPerDay } from 'src/app/Models/MaxSlots.model';
import { MaxslotsService } from 'src/app/Services/maxslots.service';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-maintain-slots',
  templateUrl: './maintain-slots.component.html',
  styleUrls: ['./maintain-slots.component.scss']
})
export class MaintainSlotsComponent implements OnInit {
  SlotsFormControl = new FormControl('',[Validators.required, Validators.min(1), Validators.pattern('^[0-9][0-9]*$')]);
  isLoading:boolean=false;
  MaxSlotsPerDay!:MaxSlotsPerDay;
  constructor(public router:Router,
    private location:Location,
    private dialog:MatDialog,
    private service:MaxslotsService,
    private titleservice:Title,
    public toastr: ToastrService,
    private snack:MatSnackBar) { this.titleservice.setTitle('Max Slots Per Day');}

  ngOnInit(): void {
    this.MaxSlotsPerDay=JSON.parse(sessionStorage['MaxSlotsPerDay'])
  }

  onBack(): void {
    this.router.navigate(['admin/read-max-slots'])
  }
  
  onSubmit() {
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
      const title = 'Confirm Edit Max Slots';
      const message = 'Are you sure you want to save changes to the Max Value?';
      const popupMessage = 'Max Slots Value changes successful!';
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
        departmentData: this.MaxSlotsPerDay,
      }, //^captured department info here for validation
      height: '30vh',
      width: '50vw',
    });
  
    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        this.isLoading=true;
        this.service
          .MaintainSlots(this.MaxSlotsPerDay.MaxID, this.MaxSlotsPerDay)
          .subscribe((result:any) => {
            console.log(result);
            if (result.Status === 200) 
            {
              this.snack.open(
                'Max Slots updated successfully!',
                      'OK',
                      {
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        duration: 3000,
                      }
              );
              this.router.navigate(['admin/read-max-slots']);
              this.isLoading=false;
  
            }
            else
            { 
              this.isLoading=false;
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
      this.SlotsFormControl.hasError('required') == false &&
      this.SlotsFormControl.hasError('pattern') == false && 
      this.SlotsFormControl.hasError('min') == false
    )
    {return false}
    else
    {return true}
  }

}
