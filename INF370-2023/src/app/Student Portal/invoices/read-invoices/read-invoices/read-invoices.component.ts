import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { AfterViewInit,ViewChild, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { PaymentService } from 'src/app/Services/payment.service';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-read-invoices',
  templateUrl: './read-invoices.component.html',
  styleUrls: ['./read-invoices.component.scss']
})
export class ReadInvoicesComponent implements OnInit {
displayedColumns: string[] = [
    'Date',
    'PurchaseNumber',
    'Total',
    'view'
];

public dataSource = new MatTableDataSource<any>();
noData = this.dataSource.connect().pipe(map(data=>data.length===0));


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;

  invoicelist!:any[];
  invoice:any;
  StudentID:any
  isLoading:boolean=true;

  constructor(
    private dialog:MatDialog,
    public router:Router,
    private location:Location,
    private service:PaymentService,
    public toaster:ToastrService,
    private _snackBar:MatSnackBar,
    private titleservice:Title
  ) 
  { this.titleservice.setTitle('Invoices');}

ngOnInit(): void {
this.StudentID = sessionStorage.getItem('StudentID');
this.refreshList();
}

  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.refreshList();
  }

  public doFilter = (event: Event) => {
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

  refreshList() {
    this.service.GetInvoices(this.StudentID).subscribe((result) => {
      this.dataSource.data = result as any[];
      this.isLoading=false;
    });
  }

  onView(obj:any) {
    sessionStorage['invoice'] = JSON.stringify(obj);
    this.router.navigate(['student/view-invoice']);
  }

}
