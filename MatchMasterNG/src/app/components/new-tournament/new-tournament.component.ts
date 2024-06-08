import { Component } from '@angular/core';
import { TournamentService } from '../../services/tournament.service';
import { Tournament } from '../../models/tournament.model';

@Component({
  selector: 'app-new-tournament',
  templateUrl: './new-tournament.component.html',
  styleUrl: './new-tournament.component.css'
})
export class NewTournamentComponent {

  constructor(private tournamentService: TournamentService){}

  createTournament(form: any)
  {
    var tournament: Tournament = 
    {
      "tournamentId": 0,
      "creatorId": 0,
      "title": form.title,
      "description": form.description,
      "tournamentStart": form.tournamentStart
    }

    this.tournamentService.createTournament(tournament)
     .subscribe();
  }
}
