import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { AfterViewInit,ViewChild, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CourseService } from 'src/app/Services/course.service';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseCategoryService } from 'src/app/Services/course-category.service';
import { CourseCategory } from 'src/app/Models/CourseCategory.model';
import { map } from 'rxjs/operators';
import { MatChipList } from '@angular/material/chips';
import { MatExpansionPanel, MatExpansionPanelTitle, MatExpansionPanelDescription,MatExpansionPanelContent } from '@angular/material/expansion';
import { MatAccordion } from '@angular/material/expansion';
import { FAQService } from 'src/app/Services/faq.service';
import { FAQ } from 'src/app/Models/faq.model';
import { NgxStarRatingService } from 'ngx-star-rating';
import { CartService } from 'src/app/Services/cart.service';

@Component({
  selector: 'app-view-structure',
  templateUrl: './view-structure.component.html',
  styleUrls: ['./view-structure.component.scss'],
})
export class ViewStructureComponent implements OnInit {

panelOpenState = false;
courseDetails:any;
course:any
faqList!:any[];
ratings!:any[];

notRetrieved = true;
NumberOfRatings:any
AverageRating:any

  constructor(
    private dialog:MatDialog,
    public router:Router,
    private location:Location,
    private service:CourseService,
    private catService: CourseCategoryService,
    private FAQService:FAQService,
    public toaster:ToastrService,
    private _snackBar:MatSnackBar,
    private cartService:CartService,
    private titleservice:Title
  ) { 
    this.titleservice.setTitle('Course Details');
   
}

ngOnInit(): void {
this.course = JSON.parse( sessionStorage['course-structure'] );
//console.log(this.course);
this.getStructure();
this.GetFAQ();
this.GetRatings();
}

getStructure(){
  this.service.ViewCourseStructure(this.course.CourseID).subscribe((result)=>{
    this.courseDetails = result as any;
  })
}

getInitials(firstName: string, lastName: string): string {
  const initials = firstName.charAt(0) + lastName.charAt(0);
  return initials.toUpperCase();
}


onBack(){
  sessionStorage.removeItem('course-structure');
  this.router.navigate(['student/view-store']);
}

GetFAQ(){
this.FAQService.GetFAQs().subscribe((result)=>{
  this.faqList = result as any[];
})
}

GetRatings(){
this.service.GetRatings(this.course.CourseID).subscribe((result:any)=>{
this.ratings = result.Ratings as any[];
this.NumberOfRatings=result.NumberOfRatings as any;
this.AverageRating = result.AverageRating as any;

if(this.ratings.length == 0 )
{
this.notRetrieved = true;
}
else{
  this.notRetrieved = false;
}
})
}

AddToCart() {
  // Retrieve the cart data from the session storage
  const cartData = sessionStorage.getItem('cart');

  if (cartData) {
    // Parse the cart data from JSON string to an array of courses
    const cart: any[] = JSON.parse(cartData);

    // Check if the course already exists in the cart
    const existingCourse = cart.find(item => item.CourseID === this.course.CourseID);
    if (existingCourse) {
      // Course already exists in the cart, display a snackbar notification
      this._snackBar.open('Course is already in the cart!', 'Dismiss', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
                      
      });
      return;
    }
    
    // Add the course to the cart
    cart.push(this.course);

    // Update the cart data in the session storage
    sessionStorage.setItem('cart', JSON.stringify(cart));

    // Display a snackbar notification for successful addition to the cart
    this._snackBar.open('Course added to the cart!', 'Dismiss', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  } else {
    // Create a new cart and add the course
    const cart = [this.course];

    // Update the cart data in the session storage
    sessionStorage.setItem('cart', JSON.stringify(cart));

    // Display a snackbar notification for successful addition to the cart
    this._snackBar.open('Course added to the cart!', 'Dismiss', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}

}
