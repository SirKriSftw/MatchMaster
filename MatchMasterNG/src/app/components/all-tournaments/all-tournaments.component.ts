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
  tournamentMatchesMap: { [tournamentId: number]: Match[]} = {};

  constructor(private tournamentService: TournamentService, private authService: AuthenticationService, private router: Router) {}

  ngOnInit(): void {
    this.getAllTournaments();
  }

  getAllTournaments(): void {
    this.tournamentService.getAllTournaments()
      .subscribe(tournaments => this.tournaments = tournaments);
  }

  toggleTournamentMatches(tournamentId: number): void {
    if (this.tournamentMatchesMap[tournamentId])
    {
      delete this.tournamentMatchesMap[tournamentId];
    }
    else
    {
      this.tournamentService.getTournamentMatches(tournamentId)
        .subscribe(matches => this.tournamentMatchesMap[tournamentId] = matches)
    }
  }

  showTournament(tournamentId: number)
  {
    this.router.navigate(["/tournament", tournamentId])
  }

  isLoggedIn()
  {
    return this.authService.isLoggedIn();
  }

  goToProfile()
  {
    this.router.navigate(["/profile"]);
  }
}