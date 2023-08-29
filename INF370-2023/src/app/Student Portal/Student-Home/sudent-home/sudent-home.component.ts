import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-sudent-home',
  templateUrl: './sudent-home.component.html',
  styleUrls: ['./sudent-home.component.scss']
})
export class SudentHomeComponent implements OnInit {

  constructor(private router:Router,private titleservice:Title) 
  { this.titleservice.setTitle('Home');}

ngOnInit(): void {
}

onStore(){
  this.router.navigate(['student/view-store'])
}

}
