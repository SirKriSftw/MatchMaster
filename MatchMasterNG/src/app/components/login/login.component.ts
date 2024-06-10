import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  signingUp = false;
  constructor(private authService: AuthenticationService, private router: Router) {}

  login(email: string, password: string, event: Event)
  {
    event.preventDefault();
    console.log(event);
    this.authService.login(email, password)
      .subscribe((response) => 
        {
          localStorage.setItem('userData', JSON.stringify(response));
          this.router.navigate(["/"]);
        },
        (error) => 
        {
          console.log(error)
        }
      )
  }

  signup()
  {
    this.signingUp = true;
  }

  register(username: string, email: string, password: string)
  {
    this.authService.register(username, email, password).subscribe(
      (r) => {},
      (e) => {console.log(e.error)}
    )
  }
}
