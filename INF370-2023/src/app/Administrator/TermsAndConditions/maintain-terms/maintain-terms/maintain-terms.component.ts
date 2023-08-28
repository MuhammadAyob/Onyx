import { Component,VERSION,ElementRef, OnInit,ViewChild } from '@angular/core';
import { FormGroup, FormBuilder,Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { Title } from '@angular/platform-browser';
import { TermsAndCondition } from 'src/app/Models/terms.model';
import { TermsService } from 'src/app/Services/terms.service';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { AuditLogService } from 'src/app/Services/audit-log.service';
import { AuditLog } from 'src/app/Models/audit.model';
import { SecurityService } from 'src/app/Services/security.service';

@Component({
  selector: 'app-maintain-terms',
  templateUrl: './maintain-terms.component.html',
  styleUrls: ['./maintain-terms.component.scss']
})
export class MaintainTermsComponent implements OnInit {

resourceFormControl = new FormControl('', [Validators.required]);
isLoading:boolean=false;

constructor(
private fb: FormBuilder,
public router: Router,
private location: Location,
private service: TermsService,
private dialog: MatDialog,
public toaster: ToastrService,
private snack: MatSnackBar,
private titleservice: Title,
private aService:AuditLogService,
private security:SecurityService
) { this.titleservice.setTitle('Terms and Conditions');}

test!: TermsAndCondition;
fileAttr = ' ';
resourceFile: string = "";

ngOnInit(): void {
 this.refreshForm();
}

refreshForm() {
  this.test = {
    ID:1,
   TCFile:null
  };
}

onSubmit() {
  this.resourceFile = this.resourceFile.slice(28);
   this.test.TCFile = this.resourceFile;
  
 
 const isInvalid = this.validateFormControls();
 
   if (isInvalid == true) {
     this.dialog.open(InputDialogComponent, {
       data: {
         dialogTitle: "Input Error",
         dialogMessage: "Correct errors on Highlighted fields"
       },
       width: '27vw',
       height: '29vh',
     });
   } else {
     const title = 'Confirm Edit T&Cs';
     const message = 'Are you sure you want to submit this File?';
     this.showDialog(title, message);
   }
 }
 
 validateFormControls(): boolean {
 if (
   this.resourceFormControl.hasError('required') == false
   )
 {return false}
 else{return true}
 }
 
 onBack() {
   this.router.navigate(['admin/read-terms']);
 }
 
 showDialog(title: string, message: string): void {
   const dialogReference = this.dialog.open(ConfirmDialogComponent, {
     data: {
       dialogTitle: title,
       dialogMessage: message,
       operation: 'add',
     },
     width: '50vw',
     height:'30vh'
   });
 
   dialogReference.afterClosed().subscribe((result) => {
     if (result == true) 
     {
      this.isLoading=true;
       this.service.UpdateTerms(this.test.ID, this.test).subscribe((result:any)=>
       {
         console.log(result)
         if(result.Status===200)
         {
           this.snack.open(
             'Terms and Conditions updated successfully!',
                   'OK',
                   {
                     horizontalPosition: 'center',
                     verticalPosition: 'bottom',
                     duration: 3000,
                   }
           );
           //this.refreshForm();
           this.router.navigate(['admin/read-terms']);
           this.isLoading=false;

           let audit = new AuditLog();

           audit.AuditLogID = 0;
           audit.UserID = this.security.User.UserID;
           audit.AuditName = 'Configure Terms & Conditions File';
           audit.Description = 'Employee, ' + this.security.User.Username + ', configured the Terms and Conditions File.'
           audit.Date = '';

          this.aService.AddAudit(audit).subscribe((data) => {
          })
          
         }
      
         else
         {
          this.isLoading=false;
           const dialogReference = this.dialog.open(
             ExistsDialogComponent,
             {
               data: {
                 dialogTitle: 'Error',
                 dialogMessage: 'Internal server error, please try again',
                 operation: 'ok',
               },
               width: '50vw',
               height:'30vh'
             }
           );
         }
       })
     }
   });
 }
 
 uploadFileEvt(dataFile:any) 
   {
     this.fileAttr = '';
     Array.from(dataFile.target.files as FileList).forEach((file: File) => {
       this.fileAttr += file.name + ' - ';
     });
 
    //this.test.ResourceName=this.fileAttr;
    var fileUpload = dataFile.target.files[0];
    var fileReader = new FileReader();
    fileReader.readAsDataURL(fileUpload);
      fileReader.onloadend = () => {
        this.resourceFile = fileReader.result!.toString();
      }
   }


}
