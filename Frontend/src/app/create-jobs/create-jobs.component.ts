import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-jobs',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './create-jobs.component.html',
  styleUrls: ['./create-jobs.component.css']
})
export class CreateJobsComponent {
  jobForm: FormGroup;  // Declare the form group here

  constructor(private fb: FormBuilder) {
    // Initialize the form group using FormBuilder
    this.jobForm = this.fb.group({
      jobTitle: ['', Validators.required],
      description: ['', Validators.required],
      salary: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],  // Only accepts numbers
      location: ['', Validators.required],
      datePosted: ['', Validators.required],
      experienceLevel: ['', Validators.required],  // Added Experience Level
      jobType: ['', Validators.required],          // Added Job Type
      salaryRange: [50000, [Validators.required, Validators.min(30000), Validators.max(200000)]] // Added Salary Range (default value)
    });
  }

  // On form submit
  onSubmit() {
    if (this.jobForm.valid) {
      console.log(this.jobForm.value);
      alert('Job created successfully!');
      this.jobForm.reset();  // Clear the form after submission
    } else {
      alert('Please fill out all fields correctly.');
    }
  }
}
