import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { AfterViewInit,ViewChild, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CourseService } from 'src/app/Services/course.service';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ConfirmDialogComponent } from 'src/app/Dialog/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from 'src/app/Dialog/input-dialog/input-dialog/input-dialog.component';
import { SearchDialogComponent } from 'src/app/Dialog/search-dialog/search-dialog/search-dialog.component';
import { ExistsDialogComponent } from 'src/app/Dialog/exists-dialog/exists-dialog/exists-dialog.component';
import { CourseCategoryService } from 'src/app/Services/course-category.service';
import { CourseCategory } from 'src/app/Models/CourseCategory.model';
import { map } from 'rxjs/operators';
import { MatChipList } from '@angular/material/chips';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss'],
  //imports: [MatChipsModule],
})
export class StoreComponent implements OnInit {
displayedColumns: string[] = [
  'Price',
  'Image',
  'Name',
  'Category',
  'view',
  'add'
  ];

public dataSource = new MatTableDataSource<any>();
noData = this.dataSource.connect().pipe(map(data=>data.length===0));
  
  
@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!:MatSort;
  
courselist!:any[];
categoryList!:CourseCategory[];
StudentID: any;

constructor(
  private dialog:MatDialog,
    public router:Router,
    private location:Location,
    private service:CourseService,
    private catService: CourseCategoryService,
    public toaster:ToastrService,
    private _snackBar:MatSnackBar,
    private titleservice:Title
) { this.titleservice.setTitle('Store');}

ngOnInit(): void {
this.StudentID = sessionStorage.getItem('StudentID');
console.log('getting');
this.refreshList();
this.GetCategories();
}

ngAfterViewInit(){
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
  this.refreshList();
  this.GetCategories();
}



public doFilter = (event: Event) => {
  this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase();
   if (this.dataSource.filteredData.length === 0) {

    const dialogReference = this.dialog.open(SearchDialogComponent, {

    });
    dialogReference.afterClosed().subscribe((result) => {
      if (result == true) {
       this.refreshList();
      }
    });
  }
}

public selectedChip: string = '';

public onChipFilter(chipValue: string) {
  if (this.selectedChip === chipValue) {
    this.selectedChip = ''; // Unselect the chip if it is already selected
  } else {
    this.selectedChip = chipValue; // Select the clicked chip
  }

  if (this.selectedChip) {
    this.dataSource.filter = this.selectedChip;
  } else {
    this.dataSource.filter = ''; // Remove the filter if no chip is selected
  }

  if (this.dataSource.filteredData.length === 0) {
    const dialogReference = this.dialog.open(SearchDialogComponent, {});

    dialogReference.afterClosed().subscribe((result) => {
      if (result === true) {
        this.refreshList();
      }
    });
  }
}




refreshList() {
  this.service.ViewStore(this.StudentID).subscribe((result) => {
    this.dataSource.data = result as any[];
  });
}

GetCategories(){
  this.catService.GetCategories().subscribe((result)=>{
    this.categoryList = result as CourseCategory[];
    console.log(this.categoryList);
  })
}
 onView(obj:any){
  console.log(obj);
  sessionStorage['course-structure'] = JSON.stringify(obj)
  this.router.navigate(['student/view-course-structure']);
 }
}
