import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Tournament } from '../../models/tournament.model';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  userId:number;
  myTournaments: Tournament[] = [];

  constructor(private router: Router,private userService: UserService, private authService: AuthenticationService) {
    this.userId = this.authService.getCurrentUserId();
  }

  ngOnInit()
  {
    if(!this.authService.isLoggedIn())
    {
      this.router.navigate(["/"]);
    }
    this.getMyTournaments()
  }

  getMyTournaments()
  {
    this.userService.getMyTournaments(this.userId)
    .subscribe(tournaments => this.myTournaments = tournaments);
  }

  showTournament(tournamentId: number)
  {
    this.router.navigate(["tournament/", tournamentId]);
  }

  newTournament()
  {
    this.router.navigate(["create"]);
  }
}
