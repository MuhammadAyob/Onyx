import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { AfterViewInit, ViewChild, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FAQ } from 'src/app/Models/faq.model';
import { FAQService } from 'src/app/Services/faq.service';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import {map} from 'rxjs/operators';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import * as xlsx from 'xlsx';
import { AuditLog } from 'src/app/Models/audit.model';
import { AuditLogService } from 'src/app/Services/audit-log.service';
import { SecurityService } from 'src/app/Services/security.service';

@Component({
  selector: 'app-read-faq',
  templateUrl: './read-faq.component.html',
  styleUrls: ['./read-faq.component.scss']
})
export class ReadFaqComponent implements OnInit {
  displayedColumns: string[] = [
    'Question',
    'Answer',
    'view',
    'edit',
    'delete'
  ];

  public dataSource = new MatTableDataSource<FAQ>();

  noData = this.dataSource.connect().pipe(map(data => data.length === 0));

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

faqlist!: FAQ[];
faq!: FAQ;
isLoading:boolean = true;

  constructor(
    private dialog: MatDialog,
    public router: Router,
    private location: Location,
    private service: FAQService,
    public toaster: ToastrService,
    private _snackBar: MatSnackBar,
    private titleservice: Title,
    private aService:AuditLogService,
    private security:SecurityService
  ) { this.titleservice.setTitle('FAQ');}

  ngOnInit(): void {
    
    this.refreshList();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.refreshList();
  }

  GetHelp(){
    localStorage.removeItem('pageNumber');
    localStorage.setItem('pageNumber', '19');
  }

  public doFilter = (event:Event) => {
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

  refreshObject() {
    this.faq = {
      ID: 0,
      Question: '',
      Answer: '',
    };
  }
  refreshList() {

    this.service.GetFAQs().subscribe((result) => {
      this.dataSource.data = result as FAQ[];
      this.isLoading=false;
    });
   
  }

  onEdit(obj:any) {
    sessionStorage['faq'] = JSON.stringify(obj);
    this.router.navigate(['admin/maintain-faq']);
  }
  addNew(): void {
    this.router.navigate(['admin/add-faq']);
  }

  onView(obj:any) {
    sessionStorage['faq'] = JSON.stringify(obj);
    this.router.navigate(['admin/view-faq']);
  }

  onDelete(obj: any) {
    const title = 'Confirm Delete FAQ';
    const message = 'Are you sure you want to delete the FAQ?';
    
    const dialogReference = this.dialog.open(ConfirmDialogComponent, {
      data: {
        dialogTitle: title,
        dialogMessage: message,
        operation: 'delete',
        //qualificationData: id,
      }, //^captured department info here for validation
      height: '30vh',
      width: '50vw',
    });

    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        this.service.DeleteFAQ(obj.ID).subscribe(
          (result:any) => {
            if(result.Status===200)
            {
              this._snackBar.open(
                'FAQ deleted successfully!',
                      'OK',
                      {
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom',
                        duration: 3000,
                      }
              );
              this.refreshList();
              
              let audit = new AuditLog();
              audit.AuditLogID = 0;
              audit.UserID = this.security.User.UserID;
              audit.AuditName = 'Delete FAQ';
              audit.Description = 'Employee, ' + this.security.User.Username + ', deleted the FAQ: ' + obj.Question
              audit.Date = '';

          this.aService.AddAudit(audit).subscribe((data) => {
          })
            }

            else if(result.Status===501)
            {
              this.dialog.open(InputDialogComponent, {
                height: '27vh',
                width: '25vw',
                data: {
                  dialogTitle: 'Error',
                  dialogMessage:'Cannot delete faq as it is being used in other parts of the system.'
                },
              });
            }

            else
            {
              this.dialog.open(InputDialogComponent, {
                height: '27vh',
                width: '25vw',
                data: {
                  dialogTitle: 'Delete FAQ',
                  dialogMessage:'Internal server error, please try again.'
                },
              });
            }
          }
        );
      }
    });
    
    
  }

  onArrowBack(): void {
    this.location.back();
  }

  downloadExcel(): void {
    const data: FAQ[] = this.dataSource.data;

    // Select only "Question" and "Answer" properties for export
    const selectedData = data.map(item => {
      return { Question: item.Question, Answer: item.Answer };
    });

    const ws = xlsx.utils.json_to_sheet(selectedData);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');

    const excelBuffer = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'faq_export.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  downloadJSON(): void {
    const selectedData = this.dataSource.data.map(item => {
      return { Question: item.Question, Answer: item.Answer };
    });

    const jsonBlob = new Blob([JSON.stringify(selectedData)], {
      type: 'application/json'
    });

    const url = window.URL.createObjectURL(jsonBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'faq_data.json';
    a.click();
    window.URL.revokeObjectURL(url);
  }

}
