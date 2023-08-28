import { Component, OnInit } from '@angular/core';
import { FormControl , Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { TermsAndCondition } from 'src/app/Models/terms.model'; 
import { TermsService } from 'src/app/Services/terms.service';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-s-terms',
  templateUrl: './view-s-terms.component.html',
  styleUrls: ['./view-s-terms.component.scss']
})
export class ViewSTermsComponent implements OnInit {
  Terms:any;
  pdfSrc:any;
  
  constructor( 
    public router:Router,
    private location:Location,
    private service:TermsService,
    private _snackBar:MatSnackBar,
    private titleservice:Title) { this.titleservice.setTitle('Terms and Conditions'); }

    ngOnInit(): void {
      this.GetFile();
    }
    
    GetFile(){
      this.service.GetTerms().subscribe((result) => {
      this.Terms = result as any;
      sessionStorage['Terms'] = JSON.stringify(result);
      this.pdfSrc = 'data:image/pdf;base64,' + this.Terms.TCFile;
    });
    }
    
   
      
    onBack(): void {
    this.router.navigate(['home/student-home']);}

}
