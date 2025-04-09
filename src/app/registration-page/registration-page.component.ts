import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-registration-page',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.css'
})
export class RegistrationPageComponent {
onRoleSelected(arg0: string) {
throw new Error('Method not implemented.');
}
  constructor(private router: Router) { }

  myForm = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl('')
  })
  onSubmit() {
    console.log(this.myForm.value)
  }

}
