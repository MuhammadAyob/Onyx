import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomeComponent } from './Administrator/Admin-Home/admin-home/admin-home.component';
import { AddCategoryComponent } from './Administrator/Course-Category/add-category/add-category/add-category.component';
import { MaintainCategoryComponent } from './Administrator/Course-Category/maintain-category/maintain-category/maintain-category.component';
import { ReadCategoryComponent } from './Administrator/Course-Category/read-category/read-category/read-category.component';
import { AddCourseComponent } from './Administrator/Courses/add-course/add-course/add-course.component';
import { MaintainCourseComponent } from './Administrator/Courses/maintain-course/maintain-course/maintain-course.component';
import { ReadCourseComponent } from './Administrator/Courses/read-course/read-course/read-course.component';
import { ViewCourseComponent } from './Administrator/Courses/view-course/view-course/view-course.component';
import { ReActivateUsersComponent } from './Administrator/Deactivated Users/Re-activate User/re-activate-users/re-activate-users.component';
import { AddDepartmentComponent } from './Administrator/Department/add-department/add-department/add-department.component';
import { MaintainDepartmentComponent } from './Administrator/Department/maintain-department/maintain-department/maintain-department.component';
import { ReadDepartmentComponent } from './Administrator/Department/read-department/read-department/read-department.component';
import { ViewDepartmentComponent } from './Administrator/Department/view-department/view-department/view-department.component';
import { AddEmployeeComponent } from './Administrator/Employees/add-employee/add-employee/add-employee.component';
import { MaintainEmployeeComponent } from './Administrator/Employees/maintain-employee/maintain-employee/maintain-employee.component';
import { ReadEmployeeComponent } from './Administrator/Employees/read-employee/read-employee/read-employee.component';
import { ViewEmployeeComponent } from './Administrator/Employees/View-Employee/view-employee/view-employee.component';
import { ViewSelectedEmployeeComponent } from './Administrator/Employees/view-selected-employee/view-selected-employee/view-selected-employee.component';
import { AddFaqComponent } from './Administrator/FAQ/add-faq/add-faq/add-faq.component';
import { MaintainFaqComponent } from './Administrator/FAQ/maintain-faq/maintain-faq/maintain-faq.component';
import { ReadFaqComponent } from './Administrator/FAQ/read-faq/read-faq/read-faq.component';
import { ViewFaqComponent } from './Administrator/FAQ/view-faq/view-faq/view-faq.component';
import { AddResourceComponent } from './Administrator/Lesson Resources/add-resource/add-resource/add-resource.component';
import { MaintainResourceComponent } from './Administrator/Lesson Resources/maintain-resource/maintain-resource/maintain-resource.component';
import { ReadResourcesComponent } from './Administrator/Lesson Resources/read-resources/read-resources/read-resources.component';
import { ViewResourceComponent } from './Administrator/Lesson Resources/view-resource/view-resource/view-resource.component';
import { AddLessonComponent } from './Administrator/Lessons/add-lesson/add-lesson/add-lesson.component';
import { MaintainLessonComponent } from './Administrator/Lessons/maintain-lesson/maintain-lesson/maintain-lesson.component';
import { ReadLessonsComponent } from './Administrator/Lessons/read-lessons/read-lessons/read-lessons.component';
import { ViewLessonComponent } from './Administrator/Lessons/view-lesson/view-lesson/view-lesson.component';
import { AddPriorityComponent } from './Administrator/Maintenance Priority/add-maintenance-priority/add-priority/add-priority.component';
import { MaintainPriorityComponent } from './Administrator/Maintenance Priority/maintain-priority/maintain-priority/maintain-priority.component';
import { ReadPriorityComponent } from './Administrator/Maintenance Priority/read-priority/read-priority/read-priority.component';
import { AddMaintenanceTypeComponent } from './Administrator/Maintenance Type/add-type/add-maintenance-type/add-maintenance-type.component';
import { MaintainMaintenanceTypeComponent } from './Administrator/Maintenance Type/maintain-type/maintain-maintenance-type/maintain-maintenance-type.component';
import { ReadMaintenanceTypesComponent } from './Administrator/Maintenance Type/read-types/read-maintenance-types/read-maintenance-types.component';
import { ConfirmRequestComponent } from './Administrator/Maintenance/confirm-request/confirm-request/confirm-request.component';
import { MaintainRequestComponent } from './Administrator/Maintenance/maintain-request/maintain-request/maintain-request.component';
import { ReadRequestComponent } from './Administrator/Maintenance/read-request/read-request/read-request.component';
import { AddQualificationComponent } from './Administrator/Qualification/add-qualification/add-qualification/add-qualification.component';
import { MaintainQualificationComponent } from './Administrator/Qualification/maintain-qualification/maintain-qualification/maintain-qualification.component';
import { ReadQualificationComponent } from './Administrator/Qualification/read-qualification/read-qualification/read-qualification.component';
import { ViewQualificationComponent } from './Administrator/Qualification/view-qualification/view-qualification/view-qualification.component';
import { AddSectionComponent } from './Administrator/Sections/add-section/add-section/add-section.component';
import { MaintainSectionComponent } from './Administrator/Sections/maintain-section/maintain-section/maintain-section.component';
import { ReadSectionComponent } from './Administrator/Sections/read-sections/read-section/read-section.component';
import { ViewSectionComponent } from './Administrator/Sections/view-section/view-section/view-section.component';
import { AddSkillTypeComponent } from './Administrator/Skill Type/add-skill-type/add-skill-type/add-skill-type.component';
import { MaintainSkillTypeComponent } from './Administrator/Skill Type/maintain-skill-type/maintain-skill-type/maintain-skill-type.component';
import { ReadSkillTypeComponent } from './Administrator/Skill Type/read-skill-type/read-skill-type/read-skill-type.component';
import { ViewSkillTypeComponent } from './Administrator/Skill Type/view-skill-type/view-skill-type/view-skill-type.component';
import { AddSkillComponent } from './Administrator/Skill/add-skill/add-skill/add-skill.component';
import { MaintainSkillComponent } from './Administrator/Skill/maintain-skill/maintain-skill/maintain-skill.component';
import { ReadSkillComponent } from './Administrator/Skill/read-skill/read-skill/read-skill.component';
import { ViewSkillComponent } from './Administrator/Skill/view-skill/view-skill/view-skill.component';
import { AddTrainingVideoComponent } from './Administrator/Training Videos/add-training-video/add-training-video/add-training-video.component';
import { MaintainTrainingVideoComponent } from './Administrator/Training Videos/maintain-training-video/maintain-training-video/maintain-training-video.component';
import { ReadTrainingVideoComponent } from './Administrator/Training Videos/read-training-video/read-training-video/read-training-video.component';
import { MaintainUpdateRequestComponent } from './Administrator/update-request/maintain-update-request/maintain-update-request/maintain-update-request.component';
import { ReadUpdateRequestsComponent } from './Administrator/update-request/read-update-requests/read-update-requests/read-update-requests.component';
import { MaintainUserRoleComponent } from './Administrator/UserRole/maintain-UserRole/maintain-user-role/maintain-user-role.component';
import { ReadUserRoleComponent } from './Administrator/UserRole/read-UserRole/read-user-role/read-user-role.component';
import { ViewUserRoleComponent } from './Administrator/UserRole/view-UserRole/view-user-role/view-user-role.component';
import { EmployeeHomeComponent } from './Employee TA Portal/employee-home/employee-home.component';
import { RequestUpdateComponent } from './Employee TA Portal/request-update/request-update/request-update.component';
import { EnterOtpComponent } from './enter-otp/enter-otp/enter-otp.component';
import { AdminGuard } from './Guards/admin.guard';
import { AuthGuardGuard } from './Guards/auth-guard.guard';
import { EmployeeGuard } from './Guards/employee.guard';
import { StudentGuard } from './Guards/student.guard';
import { HomePageComponent } from './Home Page/home-page/home-page.component';
import { LoginComponent } from './Login/login/login.component';
import { RegisterComponent } from './Register/register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password/reset-password.component';
import { ViewAllCoursesComponent } from './Student Portal/Courses/view-all-courses/view-all-courses.component';
import { SudentHomeComponent } from './Student Portal/Student-Home/sudent-home/sudent-home.component';
import { AdminProfileUpdateComponent } from './update-profile/admin-profile-update/admin-profile-update/admin-profile-update.component';
import { EmployeeProfileUpdateComponent } from './update-profile/employee-profile-update/employee-profile-update/employee-profile-update.component';
import { StudentProfileUpdateComponent } from './update-profile/student-profile-update/student-profile-update/student-profile-update.component';
import { ErrorAccessComponent } from './user/error access/error-access/error-access.component';
import { LogMaintenanceRequestComponent } from './user/maintenance-request/log-maintenance-request/log-maintenance-request.component';
import { AddVatComponent } from './Administrator/VAT/add-vat/add-vat/add-vat.component';
import { ViewVATComponent } from './Administrator/VAT/view-vat/view-vat/view-vat.component';
import { MaintainVATComponent } from './Administrator/VAT/maintain-vat/maintain-vat/maintain-vat.component';
import { ReadVATComponent } from './Administrator/VAT/read-vat/read-vat/read-vat.component';
import { ReadOTPComponent } from './Administrator/OTP/read-otp/read-otp/read-otp.component';
import { MaintainOTPComponent } from './Administrator/OTP/maintain-otp/maintain-otp/maintain-otp.component';
import { ReadTermsComponent } from './Administrator/TermsAndConditions/read-terms/read-terms.component';
import { MaintainTermsComponent } from './Administrator/TermsAndConditions/maintain-terms/maintain-terms/maintain-terms.component';
import { AddJobComponent } from './Administrator/JobOpps/add-job/add-job/add-job.component';
import { MaintainJobComponent } from './Administrator/JobOpps/maintain-job/maintain-job/maintain-job.component';
import { ReadJobsComponent } from './Administrator/JobOpps/read-job-opps/read-jobs/read-jobs.component';
import { ViewJobComponent } from './Administrator/JobOpps/view-job/view-job/view-job.component';
import { ViewJobOppsComponent } from './user/job-listings/view-job-opps/view-job-opps.component';
import { ApplicantApplyComponent } from './user/apply/applicant-apply/applicant-apply.component';
import { ReadSlotsComponent } from './Administrator/MaxSlots/read-slots/read-slots/read-slots.component';
import { MaintainSlotsComponent } from './Administrator/MaxSlots/maintain-slots/maintain-slots/maintain-slots.component';
import { ReadApplicationsComponent } from './Administrator/Applications/read-applications/read-applications/read-applications.component';
import { ViewApplicationComponent } from './Administrator/Applications/view-application/view-application/view-application.component';


const routes: Routes = [
{
  path: '',
  redirectTo: 'home',
  pathMatch: 'full',
},

{
  path:'home',
  component:HomePageComponent
},

{
path:'employee/update-profile',
component:EmployeeProfileUpdateComponent,
canActivate:[AuthGuardGuard,EmployeeGuard]
},

{
path:'admin/update-profile',
component:AdminProfileUpdateComponent,
canActivate:[AuthGuardGuard,AdminGuard]
},

{
path:'student/update-profile',
component:StudentProfileUpdateComponent,
canActivate:[AuthGuardGuard,StudentGuard]
},

{
path:'register-student',
component:RegisterComponent
},

{
path:'user/error-access',
component:ErrorAccessComponent,
canActivate:[AuthGuardGuard]
},

{
path:'reset-password',
component:ResetPasswordComponent
},

{
path:'enter-otp',
component:EnterOtpComponent
},

{
path:'user/log-maintenance-request',
component:LogMaintenanceRequestComponent,
canActivate:[AuthGuardGuard]
},

{
path:'admin/read-maintenance-requests',
component:ReadRequestComponent,
canActivate:[AuthGuardGuard,AdminGuard]
},

{
path:'admin/confirm-maintenance-request',
component:ConfirmRequestComponent,
canActivate:[AuthGuardGuard,AdminGuard]
},

{
path:'admin/maintain-maintenance-request',
component:MaintainRequestComponent,
canActivate:[AuthGuardGuard,AdminGuard]
},

// Admin Sub-system

{
  path:'home/admin-home',
  component:AdminHomeComponent,
  canActivate:[AuthGuardGuard,AdminGuard]
},

{
  path:'admin/view-employee',
  component:ViewEmployeeComponent
},

// Admin employee subystem

{
path:'admin/view-department',
component:ViewDepartmentComponent
//, add guards later
},

{
  path:'admin/read-department',
  component:ReadDepartmentComponent
  //, add guards later
},

{
  path:'admin/maintain-department',
  component:MaintainDepartmentComponent
  //, add guards later
},

{
  path:'admin/add-department',
  component:AddDepartmentComponent
  //, add guards later
},

//admin quali sub-system

{
  path:'admin/add-qualification',
  component:AddQualificationComponent
  //add guards later
},

{
  path:'admin/read-qualification',
  component:ReadQualificationComponent
  //add guards later
},

{
  path:'admin/view-qualification',
  component:ViewQualificationComponent
  //add guards later
},

{
  path:'admin/maintain-qualification',
  component:MaintainQualificationComponent
  //add guards later
},
{
path:'careers',
component:ViewJobOppsComponent
},

{
path:'applicant-apply',
component:ApplicantApplyComponent
},

{
path:'admin/add-job',
component:AddJobComponent,
canActivate:[AuthGuardGuard,AdminGuard]
},

{
path:'admin/maintain-job',
component:MaintainJobComponent,
canActivate:[AuthGuardGuard,AdminGuard]
},

{
path:'admin/read-jobs',
component:ReadJobsComponent,
canActivate:[AuthGuardGuard,AdminGuard]
},

{
path:'admin/view-job',
component:ViewJobComponent,
canActivate:[AuthGuardGuard,AdminGuard]
},
// Configurations

{
path:'admin/add-vat',
component:AddVatComponent,
canActivate:[AuthGuardGuard,AdminGuard]
},

{
path:'admin/view-vat',
component:ViewVATComponent,
canActivate:[AuthGuardGuard,AdminGuard]
},

{
path:'admin/maintain-vat',
component:MaintainVATComponent,
canActivate:[AuthGuardGuard,AdminGuard]
},

{
  path:'admin/read-vat',
  component:ReadVATComponent,
  canActivate:[AuthGuardGuard,AdminGuard]
},

{
path:'admin/read-max-slots',
component:ReadSlotsComponent,
canActivate:[AuthGuardGuard,AdminGuard]
},

{
path:'admin/maintain-max-slots',
component:MaintainSlotsComponent,
canActivate:[AuthGuardGuard,AdminGuard]
},

{
path:'admin/read-applications',
component:ReadApplicationsComponent,
canActivate:[AuthGuardGuard,AdminGuard]
},

{
path:'admin/view-application',
component:ViewApplicationComponent,
canActivate:[AuthGuardGuard,AdminGuard]
},


{
  path:'admin/read-otp-timer',
  component:ReadOTPComponent,
  canActivate:[AuthGuardGuard,AdminGuard]
},

{
  path:'admin/maintain-otp-timer',
  component:MaintainOTPComponent,
  canActivate:[AuthGuardGuard,AdminGuard]
},

{
  path:'admin/read-terms',
  component:ReadTermsComponent,
  canActivate:[AuthGuardGuard,AdminGuard]
},

{
  path:'admin/maintain-terms',
  component:MaintainTermsComponent,
  canActivate:[AuthGuardGuard,AdminGuard]
},

// admin skill and skill type
{
path:'admin/read-skill',
component:ReadSkillComponent
},

{
  path:'admin/view-skill',
  component:ViewSkillComponent
},

{
  path:'admin/maintain-skill',
  component:MaintainSkillComponent
},

{
  path:'admin/add-skill',
  component:AddSkillComponent
},

{
  path:'admin/maintain-skill-type',
  component:MaintainSkillTypeComponent
},

{
  path:'admin/read-skill-type',
  component:ReadSkillTypeComponent
},

{
  path:'admin/add-skill-type',
  component:AddSkillTypeComponent
},

{
  path:'admin/view-skill-type',
  component:ViewSkillTypeComponent
},

//FAQ
{
path:'admin/view-faq',
component:ViewFaqComponent
},

//FAQ
{
  path:'admin/read-faq',
  component:ReadFaqComponent
},

//FAQ
{
  path:'admin/maintain-faq',
  component:MaintainFaqComponent
},

//FAQ
{
  path:'admin/add-faq',
  component:AddFaqComponent
},

//Instructional Videos
{
path:'admin/read-instructional-videos',
component:ReadTrainingVideoComponent
},

{
  path:'admin/maintain-instructional-video',
  component:MaintainTrainingVideoComponent
},

{
  path:'admin/add-instructional-video',
  component:AddTrainingVideoComponent
  },

//Employee admin stuff

{
  path:'admin/read-employees',
  component:ReadEmployeeComponent
},

{
  path:'admin/view-employee',
  component:ViewEmployeeComponent
},

{
  path:'admin/maintain-employee',
  component:MaintainEmployeeComponent
},

{
  path:'admin/add-employee',
  component:AddEmployeeComponent
},

{
path:'admin/view-selected-employee',
component:ViewSelectedEmployeeComponent
},
{
path:'employee/request-update',
component:RequestUpdateComponent,
canActivate:[AuthGuardGuard,EmployeeGuard]
},

{
path:'admin/read-update-requests',
component:ReadUpdateRequestsComponent,
canActivate:[AuthGuardGuard,AdminGuard]
},

{
path:'admin/maintain-update-request',
component:MaintainUpdateRequestComponent,
canActivate:[AuthGuardGuard,AdminGuard]
},

//Maintenance Types

{
path:'admin/add-maintenance-type',
component:AddMaintenanceTypeComponent
},

{
  path:'admin/read-maintenance-types',
  component:ReadMaintenanceTypesComponent
},

{
  path:'admin/maintain-maintenance-type',
  component:MaintainMaintenanceTypeComponent
},

//Maintenance Priorities

{
  path:'admin/add-maintenance-priority',
  component:AddPriorityComponent
},

{
  path:'admin/read-maintenance-priorities',
  component:ReadPriorityComponent
},

{
  path:'admin/maintain-maintenance-priority',
  component:MaintainPriorityComponent
},

//Reactivate Users
{
path:'admin/re-activate-user',
component:ReActivateUsersComponent
},

//Course Categories

{
path:'admin/add-category',
component:AddCategoryComponent
},

{
path:'admin/read-categories',
component:ReadCategoryComponent
},

{
path:'admin/maintain-category',
component:MaintainCategoryComponent
},

// Resources admin

{
path:'admin/read-resources',
component:ReadResourcesComponent
},

{
path:'admin/view-resource',
component:ViewResourceComponent
},

{
path:'admin/add-resource',
component:AddResourceComponent
},

{
path:'admin/maintain-resource',
component:MaintainResourceComponent
},

// Lessons admin

{
path:'admin/read-lessons',
component:ReadLessonsComponent
},

{
path:'admin/view-lesson',
component:ViewLessonComponent
},

{
  path:'admin/maintain-lesson',
  component:MaintainLessonComponent
},

{
  path:'admin/add-lesson',
  component:AddLessonComponent
},

// Courses admin

{
path:'admin/add-course',
component:AddCourseComponent
},

{
  path:'admin/maintain-course',
  component:MaintainCourseComponent
},

{
path:'admin/view-course',
component:ViewCourseComponent
},

{
path:'admin/read-courses',
component:ReadCourseComponent
},

//Sections admin

{
path:'admin/read-sections',
component:ReadSectionComponent
},

{
path:'admin/view-section',
component:ViewSectionComponent
},

{
path:'admin/maintain-section',
component:MaintainSectionComponent
},

{
path:'admin/add-section',
component:AddSectionComponent
},
//UserRoles

{
path:'admin/read-user-role',
component:ReadUserRoleComponent
},

{
  path:'admin/view-user-role',
  component:ViewUserRoleComponent
},

{
  path:'admin/maintain-user-role',
  component:MaintainUserRoleComponent
},

// Student sub-system

{
  path:'home/student-home',
  component:SudentHomeComponent,
  canActivate:[AuthGuardGuard,StudentGuard]
},

//Employee sub-system
{
path:'home/employee-home',
component:EmployeeHomeComponent,
canActivate:[AuthGuardGuard,EmployeeGuard]
},

{
  path:'student/view-courses',
  component:ViewAllCoursesComponent
},
//Login and Register
{
path:'login',
component:LoginComponent
},
// Unrecognized path
{
  path:'**',
  redirectTo:'home'
}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
