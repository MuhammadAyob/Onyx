import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login/login.component';
import { FirstPageComponent } from './first-page/first-page/first-page.component';
import { EmployeeHomeComponent } from './Employee/Home Portal/employee-home/employee-home.component';
import { UserProfileComponent } from './Employee/Profile/user-profile/user-profile.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './Angular Material/Material';
import { CustomModule } from './Angular Material/custom.module';
import { ResetPasswordComponent } from './reset-password/reset-password/reset-password.component';
import { EnterOtpComponent } from './enter-otp/enter-otp/enter-otp.component';
import { VimeoUrlPipe } from './vimeo-url.pipe';
import { VideosComponent } from './Employee/Videos/videos/videos.component';
import { VideoPipePipe } from './video-pipe.pipe';
import { SkillsPipe } from './skills.pipe';
import { QualificationsPipe } from './qualifications.pipe';
import { ViewRequestComponent } from './Employee/view-requests/view-request/view-request.component';
import { RequestUpdateComponent } from './Employee/request-update/request-update/request-update.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { UpdatePipe } from './update.pipe';
import { PdfModalComponent } from './pdf-modal/pdf-modal/pdf-modal.component';
import { YtPipePipe } from './yt-pipe.pipe';

@NgModule({
  declarations: 
  [AppComponent,
  LoginComponent,
  FirstPageComponent,
  EmployeeHomeComponent,
  UserProfileComponent,
  ResetPasswordComponent,
  EnterOtpComponent,
  VideosComponent,
  ViewRequestComponent,
  RequestUpdateComponent,
  PdfModalComponent,
  VimeoUrlPipe,
  VideoPipePipe,
  SkillsPipe,
  QualificationsPipe,
  UpdatePipe,
  YtPipePipe
  
  ],
  imports: [
    BrowserModule, 
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    AppRoutingModule, 
    FormsModule,
    ReactiveFormsModule, 
    HttpClientModule, 
    MaterialModule,
    PdfViewerModule,
    CustomModule,],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
