import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { Router } from '@angular/router';
import { FirstPageComponent } from './first-page/first-page/first-page.component';
import { LoginComponent } from './login/login/login.component';
import { EmployeeHomeComponent } from './Employee/Home Portal/employee-home/employee-home.component';
import { UserProfileComponent } from './Employee/Profile/user-profile/user-profile.component';
import { ResetPasswordComponent } from './reset-password/reset-password/reset-password.component';
import { EnterOtpComponent } from './enter-otp/enter-otp/enter-otp.component';
import { VideosComponent } from './Employee/Videos/videos/videos.component';
import { RequestUpdateComponent } from './Employee/request-update/request-update/request-update.component';
import { ViewRequestComponent } from './Employee/view-requests/view-request/view-request.component';
import { AboutComponent } from './about/about/about.component';
const routes: Routes = [
 
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  
  {
   path:'home',
   component:FirstPageComponent
  },

  {
path:'about',
component:AboutComponent
  },

  {
path:'videos',
component:VideosComponent
  },

  {
path:'request-update',
component:RequestUpdateComponent
  },
  {
path:'view-requests',
component:ViewRequestComponent
  },

  {
path:'login',
component:LoginComponent,
data: {
  cache: false // Disable caching for this page
}
  },
  {
path:'employee-home',
component:EmployeeHomeComponent,
data: {
  cache: false // Disable caching for this page
}
  },
  {
path:'user-profile',
component:UserProfileComponent, 
data: {
  cache: false // Disable caching for this page
}
  },
  {
path:'reset-password',
component:ResetPasswordComponent, data: {
  cache: false // Disable caching for this page
}
  },
  {
path:'enter-otp',
component:EnterOtpComponent,data: {
  cache: false // Disable caching for this page
}
  },



  {
    path: 'test-login',
    loadChildren: () => import('./pages/user-pages/login/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'otppage',
    loadChildren: () => import('./pages/user-pages/enter-otp/otppage/otppage.module').then( m => m.OtppagePageModule)
  },

  {
    path: 'reset',
    loadChildren: () => import('./pages/user-pages/reset-password/reset/reset.module').then( m => m.ResetPageModule)
  },
 

  // Unrecognized path
{
  path:'**',
  redirectTo:'home'
},
 
 
 
 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
