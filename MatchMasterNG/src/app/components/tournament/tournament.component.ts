import { Component } from '@angular/core';
import { Tournament } from '../../models/tournament.model';
import { TournamentService } from '../../services/tournament.service';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrl: './tournament.component.css'
})
export class TournamentComponent {
  tournaments : Tournament[] = [];

  constructor(private tournamentService: TournamentService) {}

  ngOnInit(): void {
    this.getAllTournaments();
  }

  getAllTournaments(): void {
    this.tournamentService.getAllTournaments()
      .subscribe(tournaments => this.tournaments = tournaments);
  }
}
