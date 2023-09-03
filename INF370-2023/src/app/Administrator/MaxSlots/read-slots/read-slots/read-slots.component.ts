import { Component, OnInit } from '@angular/core';
import { FormControl , Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { MaxSlotsPerDay } from 'src/app/Models/MaxSlots.model';
import { MaxslotsService } from 'src/app/Services/maxslots.service';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-read-slots',
  templateUrl: './read-slots.component.html',
  styleUrls: ['./read-slots.component.scss']
})
export class ReadSlotsComponent implements OnInit {

MaxSlotsPerDay!:MaxSlotsPerDay;
fetched:boolean=false;

constructor(
  public router:Router,
  private location:Location,
  private service:MaxslotsService,
  private _snackBar:MatSnackBar,
  private titleservice:Title
) { this.titleservice.setTitle('Max Slots Per Day');}

  ngOnInit(): void {
    this.GetMax();
  }

  GetMax(){
    this.service.GetMaxSlots().subscribe((result) => {
      this.MaxSlotsPerDay = result as any;
      sessionStorage['MaxSlotsPerDay'] = JSON.stringify(result);
      this.fetched=true;
    });
  
  }
  
  onEdit() {
  this.router.navigate(['admin/maintain-max-slots']);
  }
  
  onBack(): void {
    this.router.navigate(['home/admin-home']);
  }

}
