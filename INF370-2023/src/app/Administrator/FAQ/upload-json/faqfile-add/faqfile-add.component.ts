import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { FAQService } from 'src/app/Services/faq.service';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuditLog } from 'src/app/Models/audit.model';
import { AuditLogService } from 'src/app/Services/audit-log.service';
import { SecurityService } from 'src/app/Services/security.service';

@Component({
  selector: 'app-faqfile-add',
  templateUrl: './faqfile-add.component.html',
  styleUrls: ['./faqfile-add.component.scss']
})
export class FaqfileAddComponent implements OnInit {
  fileFormControl = new FormControl('', [Validators.required]);
  invalidFormat!:boolean;
  invalidJSONStructure!:boolean;
  isError!:boolean;

  isLoading:boolean=false;
constructor( 
  public router: Router,
  private location: Location,
  private dialog: MatDialog,
  private service: FAQService,
  private _snack:MatSnackBar,
  private titleservice: Title,
  private aService:AuditLogService,
  private security:SecurityService) 
  { this.titleservice.setTitle('FAQ');}
  
fileAttr = ' ';

ngOnInit(): void {
}

faqData: any[] = []; // Local variable to store the valid FAQ data
hasIncompleteRecords = false; // Track incomplete records
hasExtraColumns = false; // Track presence of extra columns

onFileSelected(event: any) {
  this.invalidFormat = false;
  this.invalidJSONStructure = false;
  this.isError = false;
  this.hasIncompleteRecords = false;
  this.hasExtraColumns = false;

  const file: File = event.target.files[0];

  this.fileAttr = '';
  Array.from(event.target.files as FileList).forEach((file: File) => {
    this.fileAttr += file.name + ' - ';
  });

  if (file) {
    if (file.type !== 'application/json') {
      this.invalidFormat = true;
      console.error('Invalid file format. Please select a JSON file.');
      return;
    }

    // File is selected, perform operations on the file
    console.log('File selected:', file.name);
    console.log('File size:', file.size);

    // Read the contents of the file
    const fileReader = new FileReader();
    fileReader.onload = (e: any) => {
      const fileContent = e.target.result;
      console.log('File content:', fileContent);

      try {
        const jsonData = JSON.parse(fileContent);
        if (Array.isArray(jsonData) && jsonData.length > 0) {
          const uniqueData = this.removeDuplicates(jsonData, 'Question');

          // Check for incomplete records and extra columns
          for (const item of uniqueData) {
            if (!this.isValidStructure(item)) {
              if (!item.hasOwnProperty('Question') || !item.hasOwnProperty('Answer')) {
                this.hasIncompleteRecords = true;
              } else {
                this.hasExtraColumns = true;
              }
              break;
            }
          }

          if (!this.hasIncompleteRecords && !this.hasExtraColumns) {
            this.faqData = uniqueData;
            console.log(this.faqData);
          } else {
            if (this.hasIncompleteRecords) {
              console.error('Some records are incomplete.');
            }
            if (this.hasExtraColumns) {
              console.error('The file contains extra columns.');
            }
          }
        } else {
          this.invalidJSONStructure = true;
          console.error('JSON structure is incorrect or empty.');
        }
      } catch (error) {
        this.isError = true;
        console.error('Failed to parse JSON file:', error);
      }
    };
    fileReader.readAsText(file);
  }
}

isValidStructure(data: any): boolean {
  const expectedColumns = ['Question', 'Answer'];
  const actualColumns = Object.keys(data);

  // Check if the number of actual columns matches the expected columns
  if (actualColumns.length !== expectedColumns.length) {
    return false;
  }

  // Check if all actual columns are present in the expected columns
  const hasAllColumns = actualColumns.every((column: string) =>
    expectedColumns.includes(column)
  );

  // Check if all records have non-empty values for 'Question' and 'Answer'
  const hasValidValues = expectedColumns.every((column: string) =>
    data[column] && data[column].trim() !== ''
  );

  return hasAllColumns && hasValidValues;
}

removeDuplicates(data: any[], key: string): any[] {
  const uniqueData = [];
  const uniqueKeys = new Set();

  for (const item of data) {
    const keyValue = item[key].trim().toLowerCase();
    if (!uniqueKeys.has(keyValue)) {
      uniqueData.push(item);
      uniqueKeys.add(keyValue);
    }
  }

  return uniqueData;
}

onBack(){
  this.router.navigate(['admin/read-faq'])
}

onSubmit() {
 const isInvalidForm = this.validateFormControls(); 
 const isInvalidFile = this.validateFileUpload();

 if (isInvalidForm == true) {
  this.dialog.open(InputDialogComponent, {
    data: {
      dialogTitle: "Input Error",
      dialogMessage: "Please upload a FAQ schema JSON File"
    },
    width: '50vw',
    height: '30vh',
  });
} 
else if(isInvalidFile == true){
  this.dialog.open(InputDialogComponent, {
    data: {
      dialogTitle: "Invalid File Upload",
      dialogMessage: "Ensure that the JSON File has the required FAQ structure (Question Answer columns) and/or that there are no incomplete/null records"
    },
    width: '50vw',
    height: '30vh',
  });
}
else{
  const title = 'Confirm overwrite all existing FAQ?';
  const message = 'Are you sure you want to add the FAQ JSON File?';
  this.showDialog(title, message);
}
 

}

showDialog(title: string, message: string): void {
  const dialogReference = this.dialog.open(ConfirmDialogComponent, {
    data: {
      dialogTitle: title,
      dialogMessage: message,
      operation: 'add',
      departmentData: this.faqData,
    }, //^captured department info here for validation
    height: '30vh',
    width: '50vw',
  });

  dialogReference.afterClosed().subscribe((result) => {
    if (result == true) {
      this.isLoading=true;
      this.service.OverrideFAQs(this.faqData).subscribe(
        (result:any) => {
          console.log(result);
          if(result.Status===200)
          {
            this._snack.open(
              'FAQs uploaded successfully!',
                    'OK',
                    {
                      horizontalPosition: 'center',
                      verticalPosition: 'bottom',
                      duration: 3000,
                    }
            );
            this.isLoading=false;
            this.router.navigate(['admin/read-faq']);
            let audit = new AuditLog();
            audit.AuditLogID = 0;
            audit.UserID = this.security.User.UserID;
            audit.AuditName = ' Overwrite all FAQs';
            audit.Description = 'Employee, ' + this.security.User.Username + ', uploaded a JSON file to overwrite all FAQ records in the database.'
            audit.Date = '';

            this.aService.AddAudit(audit).subscribe((data) => {
            })
          }

          else if(result.Status===404)
          {
            this.isLoading=false;
            const dialogReference = this.dialog.open(
              ExistsDialogComponent,
              {
                data: {
                  dialogTitle: 'Error',
                  dialogMessage: 'Invalid data request, please ensure data body is valid',
                  operation: 'ok',
                },
                width: '50vw',
                height:'30vh'
              }
            );
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

          
        }
      );
    }
  });
}

validateFormControls(): boolean {
  if (
    this.fileFormControl.hasError('required') == false 
  )
  {return false}
  else
  {return true}
}

validateFileUpload(): boolean{
  return (
    this.invalidFormat ||
    this.invalidJSONStructure ||
    this.isError ||
    this.hasIncompleteRecords ||
    this.hasExtraColumns
  );
}



}
