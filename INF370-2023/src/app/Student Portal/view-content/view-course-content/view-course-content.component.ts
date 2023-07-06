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
import { DomSanitizer } from '@angular/platform-browser';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-view-course-content',
  templateUrl: './view-course-content.component.html',
  styleUrls: ['./view-course-content.component.scss']
})
export class ViewCourseContentComponent implements OnInit {

panelOpenState = false;
courseDetails:any;
course:any
faqList!:FAQ[];
ratings:any;
LessonName:any;
VideoID:any;
notRetrieved = true;
activeLessonId: number = -1; // Initially set to -1 or any value that doesn't exist as a lesson ID
empList:any;

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
  ) { this.titleservice.setTitle('Course Content');}

ngOnInit(): void {
this.course = JSON.parse( sessionStorage['Course'] );
this.VideoID = this.course.VideoID;
this.LessonName = this.course.LessonName;
this.getStructure();
this.getAssistants();
this.GetFAQ();
}

getStructure(){
  this.service.GetCourseView(this.course.CourseID).subscribe((result)=>{
    this.courseDetails = result as any;
  })
}

getAssistants(){
  this.service.GetCourseAssistants(this.course.CourseID).subscribe((result)=>{
    this.empList = result as any;
  })
}

GetFAQ(){
  this.FAQService.GetFAQs().subscribe((result)=>{
    this.faqList = result as FAQ[];
  })
  }

changeVideo(lesson: any): void {
  this.activeLessonId = lesson.LessonID;
  this.VideoID = lesson.VideoID; 
  this.LessonName=lesson.LessonName;
  // Update the current video ID with the clicked lesson's video ID
}

onBack(){
  this.router.navigate(['student/view-enrolled-courses']);
}



downloadResource(obj:any) {
  let  pdfSrc:any;
  pdfSrc = 'data:image/pdf;base64,' + obj.ResourceFile;
  const pdfBase64 = pdfSrc.split(',')[1];
  const byteCharacters = atob(pdfBase64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'application/pdf' });

  saveAs(blob, obj.ResourceName +'.pdf');
}

}
