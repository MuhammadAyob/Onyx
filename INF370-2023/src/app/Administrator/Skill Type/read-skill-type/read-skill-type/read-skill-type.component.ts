import { SkillTypeService } from 'src/app/Services/skill-type.service';
import { SkillType } from 'src/app/Models/skill-type.model';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { map } from 'rxjs/operators';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { MatSort } from '@angular/material/sort';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';

@Component({
  selector: 'app-read-skill-type',
  templateUrl: './read-skill-type.component.html',
  styleUrls: ['./read-skill-type.component.scss']
})
export class ReadSkillTypeComponent implements OnInit {
  displayedColumns: string[] = [
    'SkillTypeName',
    'TypeDescription',
    'view',
    'edit',
    'delete'
  ];

  public dataSource = new MatTableDataSource<SkillType>();

  noData = this.dataSource.connect().pipe(map((data) => data.length === 0));

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  skillTypeList!: SkillType[];

  skillType!: SkillType;

  constructor( 
    private dialog: MatDialog,
    public router: Router,
    private location: Location,
    private service: SkillTypeService,
    public toaster: ToastrService,
    private _snackBar: MatSnackBar,
    private titleservice: Title) 
    {
      this.titleservice.setTitle('Skill Type');
    }

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
      const dialogReference = this.dialog.open(SearchDialogComponent, {});
      dialogReference.afterClosed().subscribe((result) => {
        if (result == true) {
          this.refreshList();
        }
      });
    }
  };

  refreshObject() {
    this.skillType = {
      SkillTypeID: 0,
      SkillTypeName: '',
      TypeDescription: ''
    };
  }

  refreshList() {
    this.service.GetSkillTypes().subscribe((result) => {
      this.dataSource.data = result as SkillType[];
    });
  }

  onEdit(obj:any) {
    sessionStorage['skillType'] = JSON.stringify(obj);
    this.router.navigate(['admin/maintain-skill-type']);
  }

  onDelete(obj:any) {
    const title = 'Confirm Delete Skill Type';
    const message = 'Are you sure you want to delete the Skill?';

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
            this.service.DeleteSkillType(obj.SkillTypeID).subscribe((res:any) => 
            {
              if(res.Status===200)
              {
                this._snackBar.open(
                  'Skill type deleted successfully!',
                        'OK',
                        {
                          horizontalPosition: 'center',
                          verticalPosition: 'bottom',
                          duration: 3000,
                        });
                this.refreshList();
              }

              else if(res.Status===501)
              {
                this.dialog.open(
                  InputDialogComponent,
                  {
                    height: '27vh',
                    width: '25vw',
                    data: {
                      dialogTitle: "Delete Skill",
                      dialogMessage: "Skill cannot be deleted as it is in use in other parts of the system."
                    },
                  }
                );
              }

              else
              {
                this.dialog.open(
                  InputDialogComponent,
                  {
                    height: '27vh',
                    width: '25vw',
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

  addNew(): void {
    this.router.navigate(['admin/add-skill-type']);
  }

  onView(obj:any) {
    sessionStorage['skillType'] = JSON.stringify(obj);
    this.router.navigate(['admin/view-skill-type']);
  }

  onArrowBack(): void {
    this.location.back();
  }

}
