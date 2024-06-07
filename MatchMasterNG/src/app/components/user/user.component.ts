import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Tournament } from '../../models/tournament.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  userId:number;
  myTournaments: Tournament[] = [];

  constructor(private userService: UserService, private authService: AuthenticationService) {
    this.userId = this.authService.getCurrentUserId();
  }

  ngOnInit()
  {
    this.getMyTournaments()
  }

  getMyTournaments()
  {
    this.userService.getMyTournaments(this.userId)
    .subscribe(tournaments => this.myTournaments = tournaments);
  }
}
