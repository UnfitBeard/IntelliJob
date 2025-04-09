import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-jobs-search',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './jobs-search.component.html',
  styleUrl: './jobs-search.component.css'
})
export class JobsSearchComponent {
  jobSearchForm: FormGroup;

  jobs: any[] = [
    { name: 'FullStack development', from: 'Company x', skillsMatch: 80},
    { name: 'Frontend development using Angular', from: 'Company x', skillsMatch: 80 },
    { name: 'Backend Development using Express and Node.js', from: 'Company x', skillsMatch: 80 }
  ]

  experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Manager', 'Executive'];
  jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];

  constructor(private fb: FormBuilder) {
    // Initialize form group
    this.jobSearchForm = this.fb.group({
      salaryRange: [50, Validators.required],  // Default salary range value
      experience: ['Mid Level', Validators.required],
      location: ['', Validators.required],
      jobType: ['Full-time', Validators.required],
    });
  }

  onSearch() {
    if (this.jobSearchForm.valid) {
      console.log(this.jobSearchForm.value);
      // Here you can add logic to perform the search, for example, make an API call with the filters
    } else {
      alert('Please fill out all search fields.');
    }
  }
}
