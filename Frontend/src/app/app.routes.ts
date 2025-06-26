import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { RecruitersDashboardComponent } from './recruiters-dashboard/recruiters-dashboard.component';
import { ProfileViewerComponent } from './profile-viewer/profile-viewer.component';
import { ProfileEditorComponent } from './profile-editor/profile-editor.component';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { CreateJobsComponent } from './create-jobs/create-jobs.component';
import { JobApplicationComponent } from './job-application/job-application.component';
import { JobsSearchComponent } from './jobs-search/jobs-search.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { JobseekerDashboardComponent } from './jobseeker-dashboard/jobseeker-dashboard.component';
import { ChatComponent } from './chat/chat.component';
import { NotificationsComponent } from './notifications/notifications.component';

export const routes: Routes = [
  {path: 'login', component: LoginPageComponent},
  {path: 'recruiters-dashboard', component: RecruitersDashboardComponent},
  {path: 'jobseeker-dashboard', component: JobseekerDashboardComponent},
  {path: 'profile-viewer', component: ProfileViewerComponent},
  {path: 'profile-editor', component: ProfileEditorComponent},
  {path: 'registration-page', component: RegistrationPageComponent},
  {path: 'create-jobs', component: CreateJobsComponent},
  {path: 'job-application', component: JobApplicationComponent},
  {path: 'job-search', component: JobsSearchComponent},
  {path: 'landing-page', component: LandingPageComponent},
  {path: 'chat', component: ChatComponent},
  {path: 'admin-dashboard', component: AdminDashboardComponent},
  {path: 'notifications', component: NotificationsComponent},
];
