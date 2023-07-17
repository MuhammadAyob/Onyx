import { AfterViewInit, ViewChild, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { UserRole } from 'src/app/Models/UserRole.model';
import { UserRoleService } from 'src/app/Services/user-role.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { map } from 'rxjs/operators';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';

@Component({
  selector: 'app-read-user-role',
  templateUrl: './read-user-role.component.html',
  styleUrls: ['./read-user-role.component.scss']
})
export class ReadUserRoleComponent implements OnInit {
  displayedColumns: string[] = [
    'RoleName',
    'RoleDescription',
    'view',
    'edit',
  ];

  public dataSource = new MatTableDataSource<UserRole>();
  @ViewChild(MatSort) sort!: MatSort;

  noData = this.dataSource.connect().pipe(map((data) => data.length === 0));
  isLoading:boolean =true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  userRolelist!: UserRole[];

  userRole!: UserRole;

  constructor(
    public router: Router,
    private location: Location,
    private titleservice: Title,
    private service: UserRoleService,
    public toaster: ToastrService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { this.titleservice.setTitle('User Role');}

  ngOnInit(): void {
    this.refreshList();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.refreshList();
  }

  public doFilter = (event:Event) => {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase();
     if (this.dataSource.filteredData.length === 0) {

      const dialogReference = this.dialog.open(SearchDialogComponent, {

      });
      dialogReference.afterClosed().subscribe((result) => {
        if (result == true) {
          console.log(result)
         this.refreshList();
        }
      });
    }
  }

  refreshList() {
    this.service.GetUserRoles().subscribe((result) => {
      this.dataSource.data = result as UserRole[];
      this.isLoading=false;
    });
  }

  refreshObject() {
    this.userRole = {
      UserRoleID: 0,
      RoleName: '',
      RoleDescription: '',
    };
  }

  onEdit(obj:any) {
    sessionStorage['userRole'] = JSON.stringify(obj);
    this.router.navigate(['admin/maintain-user-role']);
  }

  
  onView(obj:any) {
    sessionStorage['userRole'] = JSON.stringify(obj);
    this.router.navigate(['admin/view-user-role']);
  }

  onArrowBack() {
    this.location.back();
  }

}
