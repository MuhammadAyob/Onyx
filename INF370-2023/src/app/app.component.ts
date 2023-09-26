import { EmployeeDetails } from './Models/employee-details.model';
import { EmployeeService } from './Services/employee.service';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { SecurityService } from './Services/security.service';
import { Employee } from './Models/employee.model';
import { Student } from './Models/student.model';
import { ConfirmDialogComponent } from './Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JobOppService } from './Services/job-opp.service';
import { CartService } from './Services/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Onyx';
  flag=true;
  userlog=1;
  admin=false;
  student=false;
  employee=false;
  username='';
  employeeDetails!:Employee;
  studentDetails!:Student;
  cartItemCount: number = 0;

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private location: Location,
    private titleservice: Title,
    public security: SecurityService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private ref: ChangeDetectorRef,
    private snack:MatSnackBar,
    private JService:JobOppService,
    private cartService:CartService
  ) {
    this.router.events.subscribe((e) => {
      //this.jobOppExpired();
      if (e instanceof NavigationEnd) {
        if (
          e.url === '/index' ||
          e.url === '/home' ||
          e.url === '/login' ||
          e.url === '/' ||
          e.url === '/landing-page' ||
          e.url === '/register-student' ||
          e.url === '/careers' ||
          e.url === '/applicant-apply' ||
          e.url === '/enter-otp' ||
          e.url === '/reset-password' ||
          e.url === '/contact' ||
          e.url === '/about' ||
          e.url === '/help'
        ) {
          this.flag = true;
        } else {
          this.flag = false;
          //this.checkQuatationDueDate();
          this.userlog = this.security.isLoggedIn.UserRoleID;
          this.findName();
          
          if(this.security.User.UserRoleID == 1)
          {
            //this.onAdminNotifications();
          }
          else if(this.security.User.UserRoleID == 2)
          {
           // this.EmployeeNotification();
          }
          else if(this.security.User.UserRoleID == 3)
          {
           // this.StudentNotification();
          }
         

         // this.contact = false;
          //this.clientNotification = false;
         // this.pmNotification = false;
         // this.employeeNotification = false;

          switch (this.userlog) {
            case 1:
              this.admin = true;
              break;
            case 2:
              this.employee = true;
              break;
            case 3:
              this.student = true;
              break;
            
              default:
              this.flag = false;
              this.admin = false;
              this.student = false;
              this.employee = false;
              
              break;
          }
         
        }
      }
    });
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }

  ngOnInit(): void {
    this.cartService.cartItemCount$.subscribe(itemCount => {
      this.cartItemCount = itemCount;
      this.ref.detectChanges();
    });
  }

  getCartCount(): number {
    return this.cartService.getCartCount();
  }
  
  GetHelp(){
    localStorage.setItem('pageNumber', '1');
  }

  public findName() {
    if (this.security.isLoggedIn) {
      if (this.userlog === 3) {
        this.security.getUserName().subscribe((result) => {
          this.studentDetails = result as Student;
          this.username = this.studentDetails.Name;
        });
      } else {
        this.security.getUserName().subscribe((result) => {
          this.employeeDetails = result as Employee;
          this.username = this.employeeDetails.Name;
        });
      }
    }
  }

  public setTitle(newTitle:any) {
    this.titleservice.setTitle(newTitle);
  }

  public getTitle() {
    return this.titleservice.getTitle();
  }

  onArrowBack() {
    this.location.back();
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

  help: boolean = false;
  onBot() {
    this.help = !this.help;
  }



  jobOppExpired(){
    this.JService.ExpiredJob().subscribe(()=>{
      console.log('hitting');
    })
  }

  onLogout() {
    const dialogReference = this.dialog.open(ConfirmDialogComponent, {
      data: {
        dialogTitle: 'Confirm Logout',
        dialogMessage: 'Are you sure you want to logout?',
        operation: 'add',
      },
      width: '50vw',
      height:'30vh'
    });

    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
        this.flag = false;
        this.admin = false;
        this.student = false;
        this.employee = false;
      
        this.security.Logout();
        this.Success();
      }
    });
  }

}
