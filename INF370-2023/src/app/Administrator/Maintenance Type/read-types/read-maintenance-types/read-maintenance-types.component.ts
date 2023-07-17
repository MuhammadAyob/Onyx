import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import {AfterViewInit,ViewChild, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MaintenanceType } from 'src/app/Models/maintenance-type.model';
import { MaintenanceTypeService } from 'src/app/Services/maintenance-type.service';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import {map} from 'rxjs/operators';


@Component({
  selector: 'app-read-maintenance-types',
  templateUrl: './read-maintenance-types.component.html',
  styleUrls: ['./read-maintenance-types.component.scss']
})
export class ReadMaintenanceTypesComponent implements OnInit {
  displayedColumns: string[] = [
    'MaintenanceType',
    'edit',
    'delete'
    ];
  

    public dataSource = new MatTableDataSource<MaintenanceType>();
    noData = this.dataSource.connect().pipe(map(data=>data.length===0));
    isLoading:boolean=true;
    
      @ViewChild(MatPaginator) paginator!: MatPaginator;
      @ViewChild(MatSort) sort!:MatSort;
    
      typelist!:MaintenanceType[];
    
      type!:MaintenanceType;    
    
constructor( 
  private dialog:MatDialog,
  public router:Router,
  private location:Location,
  private service:MaintenanceTypeService,
  public toaster:ToastrService,
  private _snackBar:MatSnackBar,
  private titleservice:Title) 
  { this.titleservice.setTitle('Maintenance Type');}

  ngOnInit(): void {
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

  refreshObject(){
    this.type = {
      MaintenanceTypeID: 0,
      Type: ''
    };
  }

  refreshList() {
    this.service.GetTypes().subscribe((result) => {
      this.dataSource.data = result as MaintenanceType[];
      this.isLoading=false;
    });
  }

  onEdit(obj:any) {
    sessionStorage['MaintenanceType'] = JSON.stringify(obj);
    this.router.navigate(['admin/maintain-maintenance-type']);
  }

  addNew(): void {
    this.router.navigate(['admin/add-maintenance-type']);
  }


  onArrowBack(): void {
    this.location.back();
  }

  onDelete(obj:any) {
    const title = 'Confirm Delete Type';
    const message = 'Are you sure you want to delete the Type?';

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
            this.service.DeleteType(obj.MaintenanceTypeID).subscribe((res:any) => 
            {
              if(res.Status===200)
              {
                this._snackBar.open(
                  'Maintenance Type deleted successfully!',
                        'OK',
                        {
                          horizontalPosition: 'center',
                          verticalPosition: 'bottom',
                          duration: 3000,
                        });
                this.refreshList();
              }

              else if(res.Status===500)
              {
                this.dialog.open(
                  InputDialogComponent,
                  {
                    height: '30vh',
                    width: '50vw',
                    data: {
                      dialogTitle: "Delete Type",
                      dialogMessage: "Type cannot be deleted as it is in use in other parts of the system."
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
