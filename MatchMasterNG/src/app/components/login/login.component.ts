import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private authService: AuthenticationService) {}

  login(email: string, password: string, event: Event)
  {
    event.preventDefault();
    console.log(event);
    this.authService.login(email, password)
      .subscribe((response) => 
        localStorage.setItem('userData', JSON.stringify(response))
    );
  }

  getCurrentUserId(): number 
  {
    const userDataString = localStorage.getItem('userData');
    if (userDataString)
    {
      const userData = JSON.parse(userDataString);
      const userId = userData.userId;
      return userId;
    }
    else
    {
      return -1;
    }
  }
}
