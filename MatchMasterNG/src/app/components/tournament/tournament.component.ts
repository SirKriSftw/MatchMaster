import { Component, Input } from '@angular/core';
import { Tournament } from '../../models/tournament.model';
import { Match } from '../../models/match.model';
import { TournamentService } from '../../services/tournament.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrl: './tournament.component.css'
})
export class TournamentComponent {
  @Input() tournament!: Tournament;
  matches: Match[] = [];

  constructor(private tournamentService: TournamentService,
              private router: Router
  ){}

  ngOnInit()
  {
    this.getMatches();
  }

  getMatches()
  {
    this.tournamentService.getTournamentMatches(this.tournament.tournamentId).subscribe(
      (r) => {
        this.matches = r;
      }
    );
  }
}
