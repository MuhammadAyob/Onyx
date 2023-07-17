import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { InstructionalVideo } from 'src/app/Models/training-video.model';
import { InstructionalVideoService } from 'src/app/Services/instructional-video.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component'; 
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VimeoUrlPipe } from 'src/app/vimeo.pipe';
import { VideoPipePipe } from 'src/app/searchvideo.pipe';

@Component({
  selector: 'app-read-training-video',
  templateUrl: './read-training-video.component.html',
  styleUrls: ['./read-training-video.component.scss']
})
export class ReadTrainingVideoComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  instructionalVideo!: InstructionalVideo;
  instructionalVideoList!: InstructionalVideo[];
isLoading:boolean=true;
  holderList!: InstructionalVideo[];

  initialPage = 0;
  pageSize = 9;
  currentPage = 0;

  videoUrls!: string[];
  videoTags!: string[];

  search!: string;

  filter: InstructionalVideo = new InstructionalVideo();
  id: any;



  constructor(
    public router: Router,
    private location: Location,
    private titleservice: Title,
    private service: InstructionalVideoService,
    private dialog: MatDialog,
    private toastr: ToastrService ,
    private snack:MatSnackBar
  ) { this.titleservice.setTitle('Instructional Videos');}

  ngOnInit(): void {
    this.refreshList();
  }

  nextPage(){
    this.currentPage++;
    this.PaginateArray();
  }

  prevPage(){
    this.currentPage--;
    this.PaginateArray();
  }

  PaginateArray() {
    this.holderList = [];

    if(this.pageSize > this.instructionalVideoList.length){
      this.holderList = this.instructionalVideoList;
      return
    }

    for (
      let i = 0 + this.currentPage * this.pageSize;
      i < this.currentPage * this.pageSize + this.pageSize;
      i++
    ) {
      if(i >= this.instructionalVideoList.length){
        return
      }
      this.holderList.push(this.instructionalVideoList[i]);
    }
  }

  public refreshList() {
    this.service.GetInstructionalVideosDetails().subscribe((result) => {
      this.instructionalVideoList = result as InstructionalVideo[];
      this.PaginateArray();
      this.isLoading=false;
    });
  }

  onEdit(obj:any) {
    sessionStorage['instructionalVideo'] = JSON.stringify(obj);
    this.router.navigate([
      'admin/maintain-instructional-video',
    ]);
  }

  onDelete(id:number) {
    const title = 'Confirm Delete Video';
    const message = 'Are you sure you want to delete the Video?';

    const dialogReference = this.dialog.open(ConfirmDialogComponent, {
      height: '30vh',
      width: '50vw',
      data: {
        dialogTitle: title,
        operation: 'delete',
        dialogMessage: message,
      },
    });
    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        this.service.DeleteInstructionalVideo(id).subscribe((res:any) => {
          if(res.Status===200)
          {
            this.snack.open(
              'Video deleted successfully!',
                    'OK',
                    {
                      horizontalPosition: 'center',
                      verticalPosition: 'bottom',
                      duration: 3000,
                    });
                    this.refreshList();
          }
          else
          {
            const dialogReference = this.dialog.open(
              ExistsDialogComponent,
              {
                data: {
                  dialogTitle: 'Error',
                  dialogMessage: 'Internal server error, please try again',
                  operation: 'ok',
                },
                width: '25vw',
              }
            );
          }
        });
      }
    });
  }

  addNew() {
    this.router.navigate(['admin/add-instructional-video']);
  }

  onArrowBack() {
    this.location.back();
  }

}
