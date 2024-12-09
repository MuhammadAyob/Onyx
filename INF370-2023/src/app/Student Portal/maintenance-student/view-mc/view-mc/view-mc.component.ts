import { SecurityService } from 'src/app/Services/security.service';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VERSION, ViewChild, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { Maintenance } from 'src/app/Models/maintenance.model';
import { MaintenanceService } from 'src/app/Services/maintenance.service';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';

@Component({
  selector: 'app-view-mc',
  templateUrl: './view-mc.component.html',
  styleUrls: ['./view-mc.component.scss']
})
export class ViewMcComponent implements OnInit {

currentMaintenance: any;
maintenanceList!: Maintenance[];
maintainPriorityName!: string;
maintainTypeName!: string;
check: boolean = true;
dataimage: any;
isLoading!:boolean;

constructor( 
  public router: Router,
  private location: Location,
  private service: MaintenanceService,
  private dialog: MatDialog,
  private titleservice: Title,
  private security: SecurityService,
  private toastr: ToastrService,
  private snack:MatSnackBar) 
  { this.titleservice.setTitle('Maintenance'); }

ngOnInit(): void {
  this.currentMaintenance = JSON.parse(sessionStorage['MaintenanceRequest']);
  this.dataimage = this.currentMaintenance.Image;
  this.maintainTypeName = this.currentMaintenance.MaintenanceType;
  this.maintainPriorityName = this.currentMaintenance.MaintenancePriority;
}

onBack() {
  sessionStorage.removeItem('MaintenanceRequest');
  this.router.navigate(['student/read-queries']);
}


onArrowBack() {
  sessionStorage.removeItem('MaintenanceRequest');
  this.router.navigate(['student/read-queries']);
}



}
