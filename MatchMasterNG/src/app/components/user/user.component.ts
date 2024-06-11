import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Tournament } from '../../models/tournament.model';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  userId: number;
  tournaments: Tournament[] = [];
  userProfile: User;
  profileId: number;
  isMyProfile: boolean = false;

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

  ngOnInit()
  {
    this.getTournaments()
  }

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

  getTournaments()
  {
    this.userService.getMyTournaments(this.profileId)
    .subscribe(tournaments => this.tournaments = tournaments);
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
