import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

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
}
