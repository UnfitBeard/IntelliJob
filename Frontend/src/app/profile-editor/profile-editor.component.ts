import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-editor',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './profile-editor.component.html',
  styleUrl: './profile-editor.component.css'
})
export class ProfileEditorComponent {
  personalDetailsForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    description: new FormControl(''),
    address: new FormGroup({
      location: new FormControl(''),
      postalAddress: new FormControl(''),
    }),
    telephone: new FormControl(''),
    skills: new FormArray([
      new FormGroup({
        skill: new FormControl(''),
        experience: new FormControl(''),
      }),
    ]),
    projects: new FormArray([
      new FormGroup({
        projectName: new FormControl(''),
        projectDescription: new FormControl(''),
        projectLink: new FormControl(''),
      }),
    ]),
    courses: new FormArray([
      new FormGroup({
        courseName: new FormControl(''),
        courseDescription: new FormControl(''),
        courseDate: new FormControl(''),
      }),
    ])
  });

  // Getter for skills FormArray
  get skills() {
    return (this.personalDetailsForm.get('skills') as FormArray);
  }

  // Getter for projects FormArray
  get projects() {
    return (this.personalDetailsForm.get('projects') as FormArray);
  }

  // Getter for courses FormArray
  get courses() {
    return (this.personalDetailsForm.get('courses') as FormArray);
  }

  // Method to add a new skill form group
  addSkill() {
    const skillFormGroup = new FormGroup({
      skill: new FormControl(''),
      experience: new FormControl(''),
    });
    this.skills.push(skillFormGroup);
  }

  // Method to remove a skill from the FormArray
  removeSkill(index: number) {
    this.skills.removeAt(index);
  }

  // Method to add a new project form group
  addProject() {
    const projectFormGroup = new FormGroup({
      projectName: new FormControl(''),
      projectDescription: new FormControl(''),
      projectLink: new FormControl(''),
    });
    this.projects.push(projectFormGroup);
  }

  // Method to remove a project from the FormArray
  removeProject(index: number) {
    this.projects.removeAt(index);
  }

  // Method to add a new course form group
  addCourse() {
    const courseFormGroup = new FormGroup({
      courseName: new FormControl(''),
      courseDescription: new FormControl(''),
      courseDate: new FormControl(''),
    });
    this.courses.push(courseFormGroup);
  }

  // Method to remove a course from the FormArray
  removeCourse(index: number) {
    this.courses.removeAt(index);
  }

  // onSubmit Method: logs the form values to the console
  onSubmit() {
    console.log('Form Submitted');
    console.log(this.personalDetailsForm.value);
  }}
