import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location, Time } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { map } from 'rxjs/operators';
import { InterviewDetails } from 'src/app/Models/InterviewDetails.model';
import { InterviewSlots } from 'src/app/Models/InterviewSlots.model';
import { Pending } from 'src/app/Models/Pending.model';
import { InterviewService } from 'src/app/Services/interview.service';
import { MatSort } from '@angular/material/sort';
import { CalendarEvent } from 'angular-calendar';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-read-slots',
  templateUrl: './read-slots.component.html',
  styleUrls: ['./read-slots.component.scss']
})
export class ReadSlotsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
