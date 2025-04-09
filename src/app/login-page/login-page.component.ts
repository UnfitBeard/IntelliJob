import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink,FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  router = inject(Router)
  navigateToSignup() {
    this.router.navigate(['registration-page'])
  }

  myForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  })

  onSubmit() {
    console.log(this.myForm.value)
  }


  constructor() { }

}
