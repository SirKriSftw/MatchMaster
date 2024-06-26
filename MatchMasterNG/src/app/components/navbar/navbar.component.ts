import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  inLogin = false;
  isLoggedIn = false;

  constructor(private authService: AuthenticationService,
              private router: Router) {}

  ngOnInit()
  {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        const currentRoute = this.router.url;
        this.inLogin = currentRoute == '/login';
      }
    })

    this.authService.isLoggedIn$.subscribe((loggedIn:boolean) => {
      this.isLoggedIn = loggedIn;
    })
  }

  logout()
  {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(["/"]);
  }

  login()
  {
    this.router.navigate(["/login"]);
  }

  profile()
  {
    this.router.navigate(["/profile"]);
  }

  home()
  {
    this.router.navigate(["/"]);
  }
}
