import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FAQService } from 'src/app/Services/faq.service';
import { FAQ } from 'src/app/Models/faq.model';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';

@Component({
  selector: 'app-view-faq',
  templateUrl: './view-faq.component.html',
  styleUrls: ['./view-faq.component.scss']
})
export class ViewFaqComponent implements OnInit {
  test!: FAQ;
  faqlist!: FAQ[];
  id: any;

  constructor(
    public router: Router,
    private location: Location,
    private service: FAQService,
    private dialog: MatDialog,
    private titleservice: Title,
    private snack:MatSnackBar
  ) { this.titleservice.setTitle('FAQ')}

  ngOnInit(): void {
    this.test = JSON.parse(sessionStorage['faq']);
  }

  refreshList() {
    this.service.GetFAQs().subscribe((result) => {
      this.faqlist = result as FAQ[];
    });
  }

  onBack() {
    this.location.back();
  }

  onEdit() {
    this.router.navigate(['admin/maintain-faq']);
    this.refreshList();
  }

  onArrowBack() {
    this.location.back();
  }
  onDelete() {
    const title = 'Confirm Delete FAQ';
    const message = 'Are you sure you want to delete the FAQ?';

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
            this.service.DeleteFAQ(this.test.ID).subscribe((res:any) => 
            {
              if(res.Status===200)
              {
                this.snack.open(
                  'FAQ deleted successfully!',
                        'OK',
                        {
                          horizontalPosition: 'center',
                          verticalPosition: 'bottom',
                          duration: 3000,
                        });
                this.router.navigate(['admin/read-faq']);        
              }

              else if(res.Status===500)
              {
                this.dialog.open(
                  InputDialogComponent,
                  {
                    height: '30vh',
                    width: '50vw',
                    data: {
                      dialogTitle: "Delete FAQ",
                      dialogMessage: "FAQ cannot be deleted as it is in use in other parts of the system."
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
