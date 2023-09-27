import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { SkillService } from 'src/app/Services/skill.service';
import { Skill } from 'src/app/Models/skill.model';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { map } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { AuditLogService } from 'src/app/Services/audit-log.service';
import { AuditLog } from 'src/app/Models/audit.model';
import { SecurityService } from 'src/app/Services/security.service';

@Component({
  selector: 'app-read-skill',
  templateUrl: './read-skill.component.html',
  styleUrls: ['./read-skill.component.scss']
})
export class ReadSkillComponent implements OnInit {
  displayedColumns: string[] = [
    'SkillName',
    'Description',
    'skillTypeName',
    'view',
    'edit',
    'delete',
  ];
  public dataSource = new MatTableDataSource<any>();
  isLoading:boolean =true;

  noData = this.dataSource.connect().pipe(map((data) => data.length === 0));

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  skillList!: Skill[];

  displayList!: string[];

  skill!: Skill;
  constructor(
    private dialog: MatDialog,
    public router: Router,
    private location: Location,
    private service: SkillService,
    public toastr: ToastrService,
    private snack: MatSnackBar,
    private titleservice: Title,
    private aService:AuditLogService,
    private security:SecurityService
  ) { this.titleservice.setTitle('Skills');}

  ngOnInit(): void {
    this.refreshList();
  }

  GetHelp(){
    localStorage.removeItem('pageNumber');
    localStorage.setItem('pageNumber', '44');
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

  refreshList() {
    this.service.GetSkills().subscribe((result) => {
      this.displayList= result as any[];
      this.dataSource.data = this.displayList;
      //console.log(result)
      this.isLoading=false;
    });
  }

  onEdit(obj:any) {
    sessionStorage['skill'] = JSON.stringify(obj);
    this.router.navigate(['admin/maintain-skill']);
  }
  addNew(): void {
    this.router.navigate(['admin/add-skill']);
  }

  onView(obj:any) {
    sessionStorage['skill'] = JSON.stringify(obj)
    this.router.navigate(['admin/view-skill']);
  }

  onArrowBack(): void {
    this.location.back();
  }

  onDelete(obj:any) {
    const title = 'Confirm Delete Skill';
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
            this.service.DeleteSkill(obj.SkillID).subscribe((res:any) => 
            {
              if(res.Status===200)
              {
                this.snack.open(
                  'Skill deleted successfully!',
                        'OK',
                        {
                          horizontalPosition: 'center',
                          verticalPosition: 'bottom',
                          duration: 3000,
                        });
                this.refreshList();
                let audit = new AuditLog();
              audit.AuditLogID = 0;
              audit.UserID = this.security.User.UserID;
              audit.AuditName = 'Delete Skill';
              audit.Description = 'Employee, ' + this.security.User.Username + ', deleted the Skill: ' + obj.SkillName + ' - ' + obj.skillTypeName
              audit.Date = '';

          this.aService.AddAudit(audit).subscribe((data) => {
          })
              }

              else if(res.Status===501)
              {
                this.dialog.open(
                  InputDialogComponent,
                  {
                    height: '30vh',
                    width: '50vw',
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
