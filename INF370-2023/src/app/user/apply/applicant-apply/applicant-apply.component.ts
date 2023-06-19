import {
  Component,
  VERSION,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { Applicant } from 'src/app/Models/applicant-model';
import { ApplicantService } from 'src/app/Services/applicant.service';
import { JobOppService } from 'src/app/Services/job-opp.service';
import { Title } from '@angular/platform-browser';
import { JobOpportunities } from 'src/app/Models/JobOpportunities.model';

@Component({
  selector: 'app-applicant-apply',
  templateUrl: './applicant-apply.component.html',
  styleUrls: ['./applicant-apply.component.scss']
})
export class ApplicantApplyComponent implements OnInit {
  nameFormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]);
  surnameFormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]);
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  phoneFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^0[1-9]\\d{8}$'),
  ]);
  idFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9]{13}'),
  ]);
  
 
  cvFormControl = new FormControl('', [Validators.required]);
  biographyFormControl = new FormControl('', [Validators.required]);
  imageFormControl = new FormControl('', [Validators.required]);

  test!: Applicant;

  jobOpp!: JobOpportunities;
  jobOppID: any;

  resourceFile: string = "";
  fileAttribute = ' ';
  dataImage:any;
  isLoading = false;  
  constructor(private fb: FormBuilder,
    public router: Router,
    private location: Location,
    private service: ApplicantService,
    private serviceJ: JobOppService,
    private dialog: MatDialog,
    public toaster: ToastrService,
    private snack: MatSnackBar,
    private titleservice: Title) 
    { this.titleservice.setTitle('Submit Application'); }

  ngOnInit(): void {
    this.refreshForm();
    this.jobOpp = this.serviceJ.test;
    this.test.JobOppID = this.serviceJ.test.JobOppID;
    console.log(this.test);
  }

  refreshForm(){
    this.test ={
      Name:'',
      Surname:'',
      Email:'',
      CV:null,
      Image:'',
      Phone:'',
      Biography:'',
      RSAIDNumber:'',
      JobOppID:0

    }
  }

  onSubmit() {
    this.resourceFile = this.resourceFile.slice(28);
    this.test.CV = this.resourceFile;
    console.log(this.test);
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
      const title = 'Confirm New Application';
      const message = 'Are you sure you want to submit this application?';
      this.showDialog(title, message);
    }
  }

  validateFormControls(): boolean {
    if (
      this.nameFormControl.hasError('required') == false &&
      this.nameFormControl.hasError('pattern') == false &&
      this.surnameFormControl.hasError('required') == false &&
      this.surnameFormControl.hasError('pattern') == false &&
      this.emailFormControl.hasError('required') == false &&
      this.emailFormControl.hasError('email') == false &&
      this.phoneFormControl.hasError('required') == false &&
      this.phoneFormControl.hasError('pattern') == false &&
      this.idFormControl.hasError('required') == false &&
      this.idFormControl.hasError('pattern') == false &&
      this.cvFormControl.hasError('required') == false &&
      this.biographyFormControl.hasError('required')==false &&
      this.imageFormControl.hasError('required') == false 
     
  
    ) {
      return false;
    } else {
      return true;
    }
  }

  showDialog(title: string, message: string): void {
    const dialogReference = this.dialog.open(ConfirmDialogComponent, {
      data: {
        dialogTitle: title,
        dialogMessage: message,
        operation: 'add',
        applicantData: this.test,
      }, //^captured department info here for validation
      width: '50vw',
      height:'30vh'
    });

    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        this.isLoading = true;
        console.log(this.test + 'hit')
        this.service.newApplicant(this.test).subscribe(
          (result:any) => 
          {
            this.isLoading = false;
            console.log(result);
            if(result.Status === 200)
            {
              this.snack.open(
                'Application submitted successfully!',
                      'OK',
                      {
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        duration: 3000,
                      }
              );
              this.refreshForm();
              this.router.navigate(['home']);
            }
            else if(result.Status === 300)
            {
              const dialogReference = this.dialog.open(ExistsDialogComponent, {
                data: {
                  dialogTitle: 'Error',
                  dialogMessage: 'Applicant is already an employee on the system. ',
                  operation: 'ok',
                },
                width: '50vw',
                height:'30vh'
              });
            }
            else if(result.Status === 350)
            {
              const dialogReference = this.dialog.open(ExistsDialogComponent, {
                data: {
                  dialogTitle: 'Error',
                  dialogMessage: 'You cannot apply for multiple opportunities at once. Please wait while we process your exisiting application ',
                  operation: 'ok',
                },
                width: '50vw',
                height:'30vh'
              });
            }
            else if(result.Status === 400)
            {
              const dialogReference = this.dialog.open(ExistsDialogComponent, {
                data: {
                  dialogTitle: 'Error',
                  dialogMessage: 'You may not re-apply for a previously rejected opportunity.',
                  operation: 'ok',
                },
                width: '50vw',
                height:'30vh'
              });
            }
            else if(result.Status === 404)
            {
              const dialogReference = this.dialog.open(ExistsDialogComponent, {
                data: {
                  dialogTitle: 'Error',
                  dialogMessage: 'Invalid data format ',
                  operation: 'ok',
                },
                width: '50vw',
                height:'30vh'
              });
            }
            else if(result.Status === 405)
            {
              const dialogReference = this.dialog.open(ExistsDialogComponent, {
                data: {
                  dialogTitle: 'Error',
                  dialogMessage: 'Phone number is in use with another user/applicant. Please enter a different phone number ',
                  operation: 'ok',
                },
                width: '50vw',
                height:'30vh'
              });
            }
            else if(result.Status === 406)
            {
              const dialogReference = this.dialog.open(ExistsDialogComponent, {
                data: {
                  dialogTitle: 'Error',
                  dialogMessage: 'Email is in use with another user/applicant. Please enter a different email',
                  operation: 'ok',
                },
                width: '50vw',
                height:'30vh'
              });
            }
            else
            {
              const dialogReference = this.dialog.open(ExistsDialogComponent, {
                data: {
                  dialogTitle: 'Error',
                  dialogMessage: 'Internal server error. Please try again',
                  operation: 'ok',
                },
                width: '50vw',
                height:'30vh'
              });
            }
           
          }
         
        );
      }
    });
  }

onBack() {
    this.location.back();
}


@ViewChild('fileInput') fileInput!: ElementRef;
fileAttr = ' ';

uploadFileEvt(imgFile: any) {
  if (imgFile.target.files && imgFile.target.files[0]) {
    this.fileAttr = '';
    Array.from(imgFile.target.files as FileList).forEach((file: File) => {
      this.fileAttr += file.name + ' - ';
    });

    // HTML5 FileReader API
    let reader = new FileReader();
    reader.onload = (e: any) => {
      let image = new Image();
      image.src = e.target.result;
      image.onload = (rs) => {
        let imgBase64Path = e.target.result;
        console.log(imgBase64Path);
        this.dataImage = imgBase64Path;
      };
    };
    reader.readAsDataURL(imgFile.target.files[0]);

  } else {
    this.fileAttr = 'Choose File';
  }

  let imagesave = new FileReader();
  imagesave.readAsDataURL(imgFile.target.files[0]);
  imagesave.onload = () =>
    {
      let invalid:number = ((imagesave.result)!.toString()).indexOf(",");
      this.test.Image = (imagesave.result)!.slice(invalid+1);
    }
}

uploadPDFFileEvt(dataFile:any) 
   {
     this.fileAttribute = '';
     Array.from(dataFile.target.files as FileList).forEach((file: File) => {
       this.fileAttribute += file.name + ' - ';
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
