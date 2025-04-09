import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective} from 'ng2-charts'

@Component({
  selector: 'app-profile-viewer',
  imports: [CommonModule, BaseChartDirective, FormsModule],
  templateUrl: './profile-viewer.component.html',
  styleUrl: './profile-viewer.component.css'
})
export class ProfileViewerComponent {
  personalInfo: any[] = [
    { name: 'The G', github: 'https://yufhwik', location: 'Kenya' }
  ]

  skills = ['HTML', 'Angular']

  projects = [
    {
      title: 'Backend Software Engineer',
      description: 'Looks like a good job',
    },
    {
      title: 'Backend Software Engineer',
      description: 'Looks like a good job',
    },
    {
      title: 'Backend Software Engineer',
      description: 'Looks like a good job',
    }
  ]
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

  // Chart Data
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
    ],
    datasets: [
      {
        data: [65, 71, 80, 81, 80, 82, 80],
        label: 'Skill Development',
        fill: true,
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgba(35, 137, 218, 0.3)'
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false
  };
  public lineChartLegend = true;

  constructor() {}

  // Modal visibility toggle
  isModalVisible = false;

  openModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }

  interviewDetails = {
    candidateName: '',
    interviewDate: '',
    interviewTime: '',
    interviewType: 'In-person',
  };

  // Schedule Interview
  scheduleInterview() {
    const { candidateName, interviewDate, interviewTime, interviewType } = this.interviewDetails;
    alert(`Interview scheduled for ${candidateName} on ${interviewDate} at ${interviewTime} (${interviewType})`);

    // Reset form after scheduling
    this.interviewDetails = {
      candidateName: '',
      interviewDate: '',
      interviewTime: '',
      interviewType: 'In-person',
    };

    this.closeModal();  // Close the modal after scheduling
  }

  ngOnInit() {}

}

