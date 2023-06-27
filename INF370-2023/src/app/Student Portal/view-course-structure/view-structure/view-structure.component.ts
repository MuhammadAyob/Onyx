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

@Component({
  selector: 'app-view-structure',
  templateUrl: './view-structure.component.html',
  styleUrls: ['./view-structure.component.scss']
})
export class ViewStructureComponent implements OnInit {

panelOpenState = false;
courseDetails:any;
course:any
faqList!:FAQ[];

  constructor(
    private dialog:MatDialog,
    public router:Router,
    private location:Location,
    private service:CourseService,
    private catService: CourseCategoryService,
    private FAQService:FAQService,
    public toaster:ToastrService,
    private _snackBar:MatSnackBar,
    private titleservice:Title
  ) { this.titleservice.setTitle('Course Details');}

ngOnInit(): void {
this.course = JSON.parse( sessionStorage['course-structure'] );
console.log(this.course);
this.getStructure();
this.GetFAQ();
}

getStructure(){
  this.service.ViewCourseStructure(this.course.CourseID).subscribe((result)=>{
    this.courseDetails = result as any;
  })
}

onBack(){
  this.router.navigate(['student/view-store']);
}

GetFAQ(){
this.FAQService.GetFAQs().subscribe((result)=>{
  this.faqList = result as FAQ[];
})
}

}
