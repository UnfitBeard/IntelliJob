import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-jobseeker-dashboard',
  imports: [CommonModule],
  templateUrl: './jobseeker-dashboard.component.html',
  styleUrl: './jobseeker-dashboard.component.css'
})
export class JobseekerDashboardComponent {
  recommended: any[] = [
    { name: 'FullStack development' },
    { name: 'Frontend development using Angular' },
    { name: 'Backend Development using Express and Node.js' }
  ]

  notifications: any[] = [
    { name: 'FullStack development', from: 'Company x'},
    { name: 'Frontend development using Angular', from: 'Company x' },
    { name: 'Backend Development using Express and Node.js', from: 'Company x' }
  ]

  jobs: any[] = [
    { name: 'FullStack development', from: 'Company x', skillsMatch: 80},
    { name: 'Frontend development using Angular', from: 'Company x', skillsMatch: 80 },
    { name: 'Backend Development using Express and Node.js', from: 'Company x', skillsMatch: 80 }
  ]
}
