import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit {
  dateTime!: Date;
  constructor( 
    private titleservice:Title,
    ) 
    {  this.titleservice.setTitle('Home');}

  ngOnInit(): void {

    timer(0, 1000).subscribe(() => {
      this.dateTime = new Date();
    })
  }

}
