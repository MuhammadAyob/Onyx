import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AlertController, ToastController } from '@ionic/angular';
import { SecurityService } from './Services/security.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  title = 'Onyx';
  username='';
  employeeDetails:any;
  userlog=1;
  pages = [
    {
      title: 'Home',
      url: '/employee-home',
      icon: 'home-outline'
    },
    {
      title: 'User Profile',
      url: '/user-profile',
      icon: 'person-circle-outline'
    },
    {
      title: 'Instructional Videos',
      url: '/videos',
      icon: 'videocam-outline'
    },
    {
      title: 'Pending Requests',
      url: '/view-requests',
      icon: 'cloud-upload-outline'
    },
    {
      title: 'Request Update',
      url: '/request-update',
      icon: 'pencil-outline'

    },
  
  ];


  nonMenuRoutes: string[] = ['/welcome', '/home', '/login','/reset-password','/enter-otp','/test-login','/otppage','/reset'];

  showMenu: boolean = false;

  constructor(
    private router: Router,
    private titleservice:Title, 
    private alertController:AlertController,
    private toastController:ToastController,
    private security:SecurityService) 
    
    { 
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showMenu = this.shouldShowMenu();
        if(this.showMenu == true)
        {
          this.findName();
        }
        
      }
    });
  }

  public findName() {
    if (this.security.isLoggedIn) {
      
        this.security.getUserName().subscribe((result) => {
          this.employeeDetails = result as any;
          this.username = this.employeeDetails.Name;
        });
      
    }
    else{
      this.username=''
    }
   
  }

  shouldShowMenu(): boolean {
    const currentRoute = this.router.url;
    return !this.nonMenuRoutes.includes(currentRoute);
  }

  public setTitle(newTitle:any) {
    this.titleservice.setTitle(newTitle);
  }

  public getTitle() {
    return this.titleservice.getTitle();
  }
  
  async logOut(){
    const alert = await this.alertController.create({
      header: "Logout",
      message: "Are you sure you want to log out?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel"
        },
        {
          text: "OK",
          handler: async () => {
            this.security.Logout();
            const toast = await this.toastController.create({
              message: 'Logged out successfully',
              duration: 3000,
              position: 'bottom',
            });
        
            await toast.present();

          }
        }
      ]
    });
    alert.present();
  }

}
