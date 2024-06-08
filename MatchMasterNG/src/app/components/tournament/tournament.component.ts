import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Tournament } from '../../models/tournament.model';
import { Match } from '../../models/match.model';
import { TournamentService } from '../../services/tournament.service';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrl: './tournament.component.css'
})
export class TournamentComponent {
  tournament: Tournament = {
    tournamentId: 0,
    creatorId: 0,
    title: '',
    description: '',
    tournamentStart: new Date()
  }; // Initialize to an empty object with default values

  matches: Match[] = [];

  constructor(private tournamentService: TournamentService, 
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit(): void {
    const tournamentId = this.route.snapshot.paramMap.get("id");
    if(tournamentId)
    {
      this.getTournament(parseInt(tournamentId))
      if(this.tournament)
      {
        this.getMatches(parseInt(tournamentId))
      }
    }
  }

  getTournament(tournamentId: number)
  {
    this.tournamentService.getTournamentById(tournamentId)
    .subscribe(tournament => this.tournament = tournament);
  }

  getMatches(tournamentId: number)
  {
    this.tournamentService.getTournamentMatches(tournamentId)
    .subscribe(matches => this.matches = matches)
  }

  showAllTournaments()
  {
    this.router.navigate(["/tournaments"]);
  }
}
