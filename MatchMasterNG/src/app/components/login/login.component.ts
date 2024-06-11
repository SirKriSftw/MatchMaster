import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  signingUp = false;
  errors: string[] = [];
  loginForm: FormGroup;
  signupForm: FormGroup;
  
  constructor(private authService: AuthenticationService, 
              private router: Router,
              private formBuilder: FormBuilder) 
  {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
            
    this.signupForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }

  login()
  {
    const email = this.loginForm.get("email")?.value;
    const password = this.loginForm.get("password")?.value;

    if(this.loginForm.valid)
    {    
      this.authService.login(email, password)
      .subscribe((response) => 
        {
          localStorage.setItem('userData', JSON.stringify(response));
          this.authService.setLoggedIn(true);
          this.router.navigate(["/"]);
        },
        (error) => 
        {
          this.loginForm.get("password")!.setErrors({ wrong: true })
        }
      )
    }
  }

  signup()
  {
    this.signingUp = true;
  }

  register()
  {
    if(this.signupForm.valid)
    {
      const username = this.signupForm.get("username")?.value;
      const email = this.signupForm.get("email")?.value;
      const password = this.signupForm.get("password")?.value;
      this.authService.register(username, email, password).subscribe(
        (r) => {
          this.authService.login(email, password).subscribe(
            (r) => 
            {
              localStorage.setItem('userData', JSON.stringify(r));
              this.router.navigate(["/"]);
            }
          )
        },
        (e) => {
          this.signupForm.get("email")!.setErrors({ taken: true })
          console.log(this.signupForm.get("email")!.errors);
        }
      )
    }
  }
}
