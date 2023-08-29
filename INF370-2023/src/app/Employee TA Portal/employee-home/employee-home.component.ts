import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SecurityService } from 'src/app/Services/security.service';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee-home',
  templateUrl: './employee-home.component.html',
  styleUrls: ['./employee-home.component.scss']
})
export class EmployeeHomeComponent implements OnInit {

  constructor(
    public router:Router,
    private location:Location,
    private security:SecurityService,
    private titleservice:Title,
    private snack:MatSnackBar) 
    { this.titleservice.setTitle('What are you doing here?!')}

  ngOnInit(): void {
    if (this.security.User===null) 
    {
     console.log("There is 'name' in session storage ")
     this.router.navigateByUrl('login');
   }
  }

  onLogout(){
    this.security.Logout();
    this.Success();
  }

  Success() {
    this.snack.open(
      'Logged out successfully!',
            'OK',
            {
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              duration: 3000,
            }
    );
  }

}
