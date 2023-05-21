import { Component, OnInit } from '@angular/core';
import { FormControl , Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { VAT } from 'src/app/Models/vat.model';
import { VATService } from 'src/app/Services/vat.service';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';

@Component({
  selector: 'app-view-vat',
  templateUrl: './view-vat.component.html',
  styleUrls: ['./view-vat.component.scss']
})
export class ViewVATComponent implements OnInit {

test!: VAT;
id:any;

constructor(
  public router:Router,
  private service:VATService,
  private dialog:MatDialog,
  private titleservice:Title,
  private location:Location,
  private snack:MatSnackBar
) {this.titleservice.setTitle('VAT'); }

ngOnInit(): void {
  this.test = JSON.parse(sessionStorage['VAT']);
}

onEdit(){
  this.router.navigate(['admin/maintain-vat']);
  
}

onBack() {
  this.router.navigate(['admin/read-vat']);
}

onArrowBack() {
  this.location.back();
}

onDelete() {
  const title = 'Confirm Delete VAT record';
  const message = 'Are you sure you want to delete the VAT record?';

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
          this.service.DeleteVAT(this.test.VatID).subscribe((result:any) => 
          {
            console.log(result);
            if(result.Status===200)
            {
              this.snack.open(
                'VAT deleted successfully!',
                      'OK',
                      {
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        duration: 3000,
                      }
              );
              this.router.navigate(['admin/read-vat']);
            }
            else if(result.Status===404)
            {
              const dialogReference = this.dialog.open(
                ExistsDialogComponent,
                {
                  data: {
                    dialogTitle: 'Error',
                    dialogMessage: 'Cannot delete, as this is the only VAT Value on the system.',
                    operation: 'ok',
                  },
                  width: '50vw',
                  height:'30vh'
                }
              );
            }
            else if(result.Status===500)
            {
              const dialogReference = this.dialog.open(
                ExistsDialogComponent,
                {
                  data: {
                    dialogTitle: 'Error',
                    dialogMessage: 'Cannot delete VAT, as it is in use in other parts of the system.',
                    operation: 'ok',
                  },
                  width: '50vw',
                  height:'30vh'
                }
              );
            }
            else
            {
              this.dialog.open(InputDialogComponent, {
                height: '30vh',
                width: '50vw',
                data: {
                  dialogTitle: 'Error',
                  dialogMessage:'Internal server error. Please try again'
                },
              });
            }
          
          });
        }
      });
    }

}
