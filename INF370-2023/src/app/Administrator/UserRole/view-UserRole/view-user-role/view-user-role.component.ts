import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { UserRole } from 'src/app/Models/UserRole.model';
import { UserRoleService } from 'src/app/Services/user-role.service';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-view-user-role',
  templateUrl: './view-user-role.component.html',
  styleUrls: ['./view-user-role.component.scss']
})
export class ViewUserRoleComponent implements OnInit {
  currentUserRole!: UserRole;
  userRoleList!: UserRole[];
  id: any;
  constructor(
    public router: Router,
    private location: Location,
    private titleservice: Title,
    private dialog: MatDialog,
    private service: UserRoleService
  ) { this.titleservice.setTitle('User Role');}

  ngOnInit(): void {
    this.currentUserRole = JSON.parse( sessionStorage['userRole'] );
  }

  refreshList() {
    this.service.GetUserRoles().subscribe((result) => {
      this.userRoleList = result as UserRole[];
    });
  }

 onEdit() {
    this.router.navigate(['admin/maintain-user-role']);
    this.refreshList();
  }


  onArrowBack() {
    this.location.back();
  }
  onBack() {
    this.router.navigate(['admin/read-user-role']);
  }


}
