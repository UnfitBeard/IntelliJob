import { Component } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import {BaseChartDirective} from 'ng2-charts'
@Component({
  selector: 'app-admin-dashboard',
  imports: [BaseChartDirective],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
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
  public skillGrowthChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
      'January', 'February', 'March', 'April', 'May', 'June', 'July'
    ],
    datasets: [
      {
        data: [ 65, 71, 80, 81, 80, 82, 80 ],  // Skill development data (e.g., user's skill progress)
        label: 'Skill Development',
        fill: true,
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgba(35, 137, 218, 0.3)',
      },
    ]
  };

  public jobAnalyticsChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
      'January', 'February', 'March', 'April', 'May', 'June', 'July'
    ],
    datasets: [
      {
        data: [ 20, 25, 30, 35, 40, 45, 50 ],  // Job analytics data (e.g., number of jobs posted)
        label: 'Posted Jobs',
        fill: true,
        tension: 0.5,
        borderColor: '#ff5f6d',
        backgroundColor: 'rgba(255, 95, 109, 0.3)',
      },
    ]
  };

  public offersMadeChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
      'January', 'February', 'March', 'April', 'May', 'June', 'July'
    ],
    datasets: [
      {
        data: [ 5, 10, 15, 20, 25, 30, 35 ],  // Offers made over the same months
        label: 'Offers Made',
        fill: true,
        tension: 0.5,
        borderColor: '#2389da',
        backgroundColor: 'rgba(35, 137, 218, 0.3)',
      },
    ]
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,  // Ensures responsiveness for smaller screens
  };

  public lineChartLegend = true;

  constructor() {}

  ngOnInit() {}


}
