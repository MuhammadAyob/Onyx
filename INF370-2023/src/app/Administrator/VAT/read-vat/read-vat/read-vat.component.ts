import { ViewChild, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { map } from 'rxjs/operators';
import { VAT } from 'src/app/Models/vat.model';
import { VATService } from 'src/app/Services/vat.service';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { AuditLogService } from 'src/app/Services/audit-log.service';
import { AuditLog } from 'src/app/Models/audit.model';
import { SecurityService } from 'src/app/Services/security.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-read-vat',
  templateUrl: './read-vat.component.html',
  styleUrls: ['./read-vat.component.scss'],
  providers:[DatePipe]
})
export class ReadVATComponent implements OnInit {
  displayedColumns: string[] = 
  [
    'date',
    'vat',
    'view',
    'edit',
    'delete'
  ];
  
  public dataSource = new MatTableDataSource<any>();
  isLoading:boolean=true;
  noData = this.dataSource.connect().pipe(map((data) => data.length === 0));
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  vatlist!: VAT[];
  
  displayList!: string[];
  
  vat!: VAT;
  
  constructor(
    public router: Router,
    private location: Location,
    private titleservice: Title,
    private service: VATService,
    public toaster: ToastrService,
    private dialog: MatDialog,
    private snack:MatSnackBar,
    private aService:AuditLogService,
    private security:SecurityService,
    private datePipe:DatePipe
  ) {this.titleservice.setTitle('VAT');  }

  ngOnInit(): void {
    this.refreshList();
  }
  
  refreshList() {
    this.service.GetVATAmounts().subscribe((result) => {
      this.displayList= result as any[];
      this.dataSource.data = this.displayList;
      this.isLoading=false;
    });
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.refreshList();
  }
  
  public doFilter = (event: Event) => {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase();
    if (this.dataSource.filteredData.length === 0) {
      const dialogReference = this.dialog.open(SearchDialogComponent, {});
      dialogReference.afterClosed().subscribe((result) => {
        if (result == true) {
          console.log(result);
          this.refreshList();
        }
      });
    }
  };
  
  refreshObject() {
    this.vat = {
      VatID:0,
      VatDate: new Date,
      VatAmount:''
    };
  }
  
  onEdit(obj:any) {
    sessionStorage['VAT'] = JSON.stringify(obj);
    this.router.navigate(['admin/maintain-vat']);
  }
  
  addNew() {
    this.router.navigate(['admin/add-vat']);
  }
  
  onView(obj:any) {
    sessionStorage['VAT'] = JSON.stringify(obj);
    this.router.navigate(['admin/view-vat']);
  }
  
  onArrowBack() {
    this.location.back();
  }
  
  onDelete(obj:any) {
    const title = 'Confirm Delete VAT record';
    const message = 'Are you sure you want to delete the VAT record?';
    
    const dialogReference = this.dialog.open(ConfirmDialogComponent, {
      data: {
        dialogTitle: title,
        dialogMessage: message,
        operation: 'delete',
        qualificationData: this.vat,
      }, //^captured department info here for validation
      height: '30vh',
      width: '50vw',
    });
  
    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        this.service.DeleteVAT(obj.VatID).subscribe(
          (result:any) => {
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
              this.refreshList();

              let audit = new AuditLog();

              audit.AuditLogID = 0;
              audit.UserID = this.security.User.UserID;
              audit.AuditName = 'Delete VAT';
              audit.Description = 'Employee, ' + this.security.User.Username + ', deleted the VAT value of ' + this.datePipe.transform(obj.VatDate, 'yyyy/MM/dd')  + ' : ' + obj.VatAmount + '%'
              audit.Date = '';
  
             this.aService.AddAudit(audit).subscribe((data) => {
             })

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
          }
        );
      }
    });
    
    
  }

}
