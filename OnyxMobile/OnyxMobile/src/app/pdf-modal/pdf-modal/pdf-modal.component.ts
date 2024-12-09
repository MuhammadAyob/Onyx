import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-pdf-modal',
  templateUrl: './pdf-modal.component.html',
  styleUrls: ['./pdf-modal.component.scss'],
})
export class PdfModalComponent  implements OnInit {

  @Input() request!: any; // Input to receive the request data
  pdfSrc = "";
  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.pdfSrc = "data:image/pdf;base64," +  this.request.Proof;
  }

  closePdfModal() {
    this.modalController.dismiss();
  }

}
