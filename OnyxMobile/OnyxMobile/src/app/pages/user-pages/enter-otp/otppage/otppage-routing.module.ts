import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OtppagePage } from './otppage.page';

const routes: Routes = [
  {
    path: '',
    component: OtppagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OtppagePageRoutingModule {}
