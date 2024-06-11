import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Tournament } from '../../models/tournament.model';
import { Match } from '../../models/match.model';
import { TournamentService } from '../../services/tournament.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-all-tournaments',
  templateUrl: './all-tournaments.component.html',
  styleUrls: ['./all-tournaments.component.css']
})
export class AllTournamentsComponent {
  tournaments : Tournament[] = [];

  constructor(private tournamentService: TournamentService, private authService: AuthenticationService, private router: Router) {}

  ngOnInit(): void {
    this.getAllTournaments();
  }

  getAllTournaments(): void {
    this.tournamentService.getAllTournaments()
      .subscribe((tournaments) => {
        this.tournaments = tournaments
      });
  }

  isLoggedIn()
  {
    return this.authService.isLoggedIn();
  }

  logout()
  {
    this.authService.logout();
  }

  login()
  {
    this.router.navigate(["/login"]);
  }

  goToProfile()
  {
    this.router.navigate(["/profile"]);
  }
}