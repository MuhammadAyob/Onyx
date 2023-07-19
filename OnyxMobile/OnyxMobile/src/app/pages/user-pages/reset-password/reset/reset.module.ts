import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/Angular Material/Material';
import { CustomModule } from 'src/app/Angular Material/custom.module';
import { IonicModule } from '@ionic/angular';


import { ResetPageRoutingModule } from './reset-routing.module';

import { ResetPage } from './reset.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResetPageRoutingModule, 
    CustomModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  declarations: [ResetPage]
})
export class ResetPageModule {}
