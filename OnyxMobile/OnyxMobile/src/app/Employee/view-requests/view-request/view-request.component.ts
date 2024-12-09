import { Component, OnInit } from '@angular/core';
import { UpdateRequestService } from 'src/app/Services/update-request.service';
import { Title } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { PdfModalComponent } from 'src/app/pdf-modal/pdf-modal/pdf-modal.component';
@Component({
  selector: 'app-view-request',
  templateUrl: './view-request.component.html',
  styleUrls: ['./view-request.component.scss'],
})
export class ViewRequestComponent  implements OnInit {

EmployeeID:any;
updateRequests:any;
search:any;
isLoading!:boolean;
constructor(
private service: UpdateRequestService,
private titleservice: Title,
private modalController:ModalController) 
{ this.titleservice.setTitle('View Update Requests'); }

ngOnInit():void {
  this.isLoading = true;
 this.getRequests();
 this.isLoading = false;
}

getRequests(){
  this.isLoading = true;
  this.service.GetUserUpdateRequestDetails(JSON.parse(sessionStorage.getItem('EmployeeID')!)).subscribe((result) =>{
    this.updateRequests = result as any;
   });
  
}

async openPdfModal(request: any) {
  console.log(request)
  const modal = await this.modalController.create({
    component: PdfModalComponent,
    componentProps: {
    request
    }
  });
  return await modal.present();
}

}
