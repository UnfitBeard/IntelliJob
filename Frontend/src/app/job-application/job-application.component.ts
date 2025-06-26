import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-job-application',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './job-application.component.html',
  styleUrl: './job-application.component.css'
})
export class JobApplicationComponent {
  jobApplicationForm = new FormGroup({
    cv: new FormControl<File | null>(null), // The FormControl for the file input
    coverLetter: new FormControl(''), // The FormControl for the cover letter textarea
  });

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.jobApplicationForm.patchValue({
        cv: file,
      });
    }
  }

  onSubmit() {
    const formData = new FormData();

    const cvFile = this.jobApplicationForm.get('cv')?.value;

    if (cvFile) {
      console.log('CV Selected:', cvFile);
    } else {
      console.error('No CV file selected');
    }
    const coverLetter = this.jobApplicationForm.get('coverLetter')?.value;
    console.log('Cover Letter:', coverLetter);
    console.log('Form Values:', this.jobApplicationForm.value);
  }
}
