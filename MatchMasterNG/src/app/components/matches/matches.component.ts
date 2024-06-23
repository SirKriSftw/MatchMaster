import { Component, Input } from '@angular/core';
import { Dictionary } from '../../models/dictionary.model';
import { Match } from '../../models/match.model';
import { TournamentService } from '../../services/tournament.service';
import { MatchService } from '../../services/match.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrl: './matches.component.css'
})
export class MatchesComponent {
  @Input() tournamentId!: number;
  @Input() preview: boolean = false;
  
  previewMatches: Match[] = [];
  winnersSide: Dictionary<Match[]> = {};
  losersSide: Dictionary<Match[]> = {};

  constructor(private tournamentService: TournamentService,
              private matchService: MatchService
              ) {}

  ngOnInit() {
    const previewCount: number = 3;

    if(this.preview)
    {
      this.getSomeMatches(previewCount);
    }
    else
    {
      this.getGroupedMatches();
    }
  }

  getGroupedMatches() 
  {
    this.tournamentService.getTournamentGroupedMatches(this.tournamentId).subscribe(
      matches => {
        this.winnersSide = matches.winnersSide;
        this.losersSide = matches.winnersSide;
      }
    );
  }

  getSomeMatches(count: number)
  {
    this.tournamentService.getSomeTournamentMatches(this.tournamentId, count).subscribe(
      matches => {
        this.previewMatches = matches;
      }
    );
  }
}
