import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CustomModule } from 'src/app/Angular Material/custom.module';
import { IonicModule } from '@ionic/angular';
import { MaterialModule } from 'src/app/Angular Material/Material';
import { OtppagePageRoutingModule } from './otppage-routing.module';

import { OtppagePage } from './otppage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OtppagePageRoutingModule, 
    CustomModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  declarations: [OtppagePage]
})
export class OtppagePageModule {}
