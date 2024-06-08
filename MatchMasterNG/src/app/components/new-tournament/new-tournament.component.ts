import { Component } from '@angular/core';
import { TournamentService } from '../../services/tournament.service';
import { Tournament } from '../../models/tournament.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-tournament',
  templateUrl: './new-tournament.component.html',
  styleUrl: './new-tournament.component.css'
})
export class NewTournamentComponent {

  constructor(private router: Router,private tournamentService: TournamentService){}

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
     .subscribe(
      (r) => this.router.navigate(["/"]) 
     );
  }
}
