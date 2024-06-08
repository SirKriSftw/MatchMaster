import { Component, Input } from '@angular/core';
import { TournamentService } from '../../services/tournament.service';
import { Tournament } from '../../models/tournament.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrl: './tournament.component.css'
})
export class TournamentComponent {
  tournamentToEdit: Tournament | undefined;

  constructor(private route: ActivatedRoute, 
              private router: Router, 
              private tournamentService: TournamentService){}

  ngOnInit()
  {
    const tournamentId = Number(this.route.snapshot.paramMap.get("id"));
    if(tournamentId)
    {
      this.tournamentService.getTournamentById(tournamentId).subscribe(t => this.tournamentToEdit = t);
    }
  }

  createTournament(form: any)
  {
    var tournament: Tournament = 
    {
      "tournamentId": this.tournamentToEdit ? this.tournamentToEdit.tournamentId : 0,
      "creatorId": this.tournamentToEdit ? this.tournamentToEdit.creatorId : 0,
      "title": form.title,
      "description": form.description,
      "tournamentStart": form.tournamentStart
    }

    if(this.tournamentToEdit)
    {
      this.tournamentService.updateTournament(tournament)
      .subscribe(
       (r) => this.router.navigate(["/"]) 
      );
    }
    else
    {
      this.tournamentService.createTournament(tournament)
      .subscribe(
       (r) => this.router.navigate(["/"]) 
      );
    }

  }
}

