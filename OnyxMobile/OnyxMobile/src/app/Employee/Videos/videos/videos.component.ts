import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { InstructionalVideo } from 'src/app/Models/training-video.model';
import { InstructionalVideoService } from 'src/app/Services/instructional-video.service';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
})

export class VideosComponent  implements OnInit {
@ViewChild(MatPaginator) paginator!: MatPaginator;
instructionalVideo!: InstructionalVideo;
instructionalVideoList!: InstructionalVideo[];

holderList!: InstructionalVideo[];
videoUrls!: string[];
videoTags!: string[];

search!: string;
isLoading!:boolean;
filter: InstructionalVideo = new InstructionalVideo();
id: any;

constructor( 
  public router: Router,
  private titleservice: Title,
  private service: InstructionalVideoService,
  private alertController: AlertController) 
  { this.titleservice.setTitle('Instructional Videos');}

  ngOnInit():void {
    this.refreshList();
  }

  public refreshList() {
    this.isLoading=true;
    this.service.GetInstructionalVideosDetails().subscribe((result) => {
      this.instructionalVideoList = result as InstructionalVideo[];
      this.isLoading=false;
      //this.PaginateArray();
    });
  }

}
