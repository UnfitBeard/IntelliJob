import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-recruiters-dashboard',
  imports: [CommonModule],
  templateUrl: './recruiters-dashboard.component.html',
  styleUrl: './recruiters-dashboard.component.css'
})
export class RecruitersDashboardComponent {
  postedJobs: any[] = [
    { name: 'Job1' }
  ]

  candidatesApplied: any[] = [
    { name: 'Merlow' }
  ]

  offersMade: any[] = [
    { amount: 1 }
  ]

  offersAccepted: any[] = [
    { amount: 1 }
  ]

  personalInfo: any[] = [
    { name: 'George', company: 'Company1' }
  ]

  yourPostedJobs: any[] = [
    {
      title: 'Backend Software Engineer',
      description:'Looks like a good job',
      applicants: [
        {name: 'Tory'}
      ]
    },
    {
      title: 'Backend Software Engineer',
      description:'Looks like a good job',
      applicants: [
        {name: 'Tory'}
      ]
    },
    {
      title: 'Backend Software Engineer',
      description:'Looks like a good job',
      applicants: [
        {name: 'Tory'}
      ]
    }
  ]
}
