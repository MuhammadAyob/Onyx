import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { UpdateRequestService } from 'src/app/Services/update-request.service';
import { SkillService } from 'src/app/Services/skill.service';
import { Skill } from 'src/app/Models/skill.model';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { map } from 'rxjs/operators';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-read-update-requests',
  templateUrl: './read-update-requests.component.html',
  styleUrls: ['./read-update-requests.component.scss']
})
export class ReadUpdateRequestsComponent implements OnInit {
  displayedColumns: string[] = [
    'EmployeeName',
    'EmployeeSurname',
    'Subject',
    'edit',
  ];
  
  public dataSource = new MatTableDataSource<any>();

  noData = this.dataSource.connect().pipe(map((data) => data.length === 0));

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  isLoading:boolean=true;
  displayList!: string[];

  constructor(
    private dialog: MatDialog,
    public router: Router,
    private location: Location,
    private service: UpdateRequestService,
    public toaster: ToastrService,
    private _snackBar: MatSnackBar,
    private titleservice: Title) 
    { this.titleservice.setTitle('Update Requests');}

  ngOnInit(): void {
    this.refreshList();
  }

  GetHelp(){
    localStorage.removeItem('pageNumber');
    localStorage.setItem('pageNumber', '55');
  }

  refreshList() {
    this.service.GetUpdateRequestDetails().subscribe((result) => {
      this.dataSource.data = result as any[];
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

      const dialogReference = this.dialog.open(SearchDialogComponent, {

      });
      dialogReference.afterClosed().subscribe((result) => {
        if (result == true) {
         this.refreshList();
        }
      });
    }
  }

  onEdit(obj:any) {
    sessionStorage['UpdateRequest'] = JSON.stringify(obj);
    this.router.navigate(['admin/maintain-update-request']);
  }

  onArrowBack(): void {
    this.location.back();
  }

}
