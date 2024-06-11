import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Tournament } from '../../models/tournament.model';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { Match } from '../../models/match.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  userId: number;
  userProfile: User;
  profileId: number;
  isMyProfile: boolean = false;

  createdTournaments: Tournament[] = [];
  upcomingTournaments: Tournament[] = [];
  pastTournaments: Tournament[] = [];
  upcomingMatches: Match[] = [];
  pastMatches: Match[] = [];

  constructor(private router: Router,
              private userService: UserService, 
              private authService: AuthenticationService) 
  {
    // A default blank user
    this.userProfile = {
      "userId" : 0,
      "username" : "",
      "email": ""
    };
    
    this.userId = this.authService.getCurrentUserId();
    let URL = this.router.url.split("/");
    let URLroute = URL[URL.length - 1];
    if(URLroute == "profile")
    {
      this.profileId = this.userId;
    }
    else
    {
      this.profileId = parseInt(URLroute);
    }

    if(this.profileId == this.userId)
    {
      this.isMyProfile = true;
    }

    this.getUserInfo();
  }

  ngOnInit(){}

  getUserInfo()
  {
    this.userService.getUserInfo(this.profileId).subscribe(
      (r) => {
        this.userProfile = r;
      },
      (e) => {
        this.router.navigate(["/"]);
      }
    );
  }

  getCreatedTournaments()
  {
    this.userService.getCreatedTournaments(this.profileId)
    .subscribe(tournaments => this.createdTournaments = tournaments);
  }

  getUpcomingTournaments()
  {
    this.userService.getUpcomingTournaments(this.profileId)
    .subscribe(tournaments => this.upcomingTournaments = tournaments);
  }

  getPastTournamennts()
  {
    this.userService.getPastTournaments(this.profileId)
    .subscribe(tournaments => this.pastTournaments = tournaments);
  }

  getUpcomingMatches()
  {
    this.userService.getUpcomingMatches(this.profileId)
    .subscribe(matches => this.upcomingMatches = matches);
  }

  getPastMatches()
  {
    this.userService.getPastMatches(this.profileId)
    .subscribe(matches => this.pastMatches = matches);
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
