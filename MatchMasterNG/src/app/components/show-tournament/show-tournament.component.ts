import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Tournament } from '../../models/tournament.model';
import { Match } from '../../models/match.model';
import { User } from '../../models/user.model';
import { TournamentService } from '../../services/tournament.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-show-tournament',
  templateUrl: './show-tournament.component.html',
  styleUrl: './show-tournament.component.css'
})
export class ShowTournamentComponent {
  tournament: Tournament = {
    tournamentId: 0,
    creatorId: 0,
    title: '',
    description: '',
    tournamentStart: new Date()
  }; // Initialize to an empty object with default values

  matches: Match[] = [];
  newMatches: Match[] = [];
  participants: User[] = [];
  currentUserId: number = -1;

  isEditing = false;
  originalTitle = "";
  originalDescription = "";
  originalStart = new Date;


  constructor(private tournamentService: TournamentService,
              private authService: AuthenticationService, 
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit(): void {
    const tournamentId = this.route.snapshot.paramMap.get("id");
    this.currentUserId = this.authService.getCurrentUserId();
    if(tournamentId)
    {
      this.getTournament(parseInt(tournamentId))
      if(this.tournament)
      {
        this.getMatches(parseInt(tournamentId))
        this.getParticipants(parseInt(tournamentId))
      }
    }
  }

  getTournament(tournamentId: number)
  {
    this.tournamentService.getTournamentById(tournamentId)
    .subscribe(tournament => {
      this.tournament = tournament
      this.originalTitle = this.tournament.title;
      this.originalDescription = this.tournament.description;
      this.originalStart = this.tournament.tournamentStart;
    });
  }

  getMatches(tournamentId: number)
  {
    this.tournamentService.getTournamentMatches(tournamentId)
    .subscribe(matches => this.matches = matches)
  }

  getParticipants(tournamentId: number)
  {
    this.tournamentService.getTournamentParticipants(tournamentId)
    .subscribe(participants => this.participants = participants)
  }

  showAllTournaments()
  {
    this.router.navigate(["/tournaments"]);
  }

  deleteTournament(tournamentId: number)
  {
    this.tournamentService.deleteTournament(tournamentId)
     .subscribe(
      (r) => this.router.navigate(["/"])
     );
  }

  editTournament()
  {
    this.isEditing = true;
  }

  cancelEdit()
  {
    this.isEditing = false;
    this.tournament.title = this.originalTitle;
    this.tournament.description = this.originalDescription;
    this.tournament.tournamentStart = this.originalStart;
  }

  saveChanges()
  {
    this.tournamentService.updateTournament(this.tournament).subscribe(
      (r) => {
        this.originalTitle = this.tournament.title;
        this.originalDescription = this.tournament.description;
        this.originalStart = this.tournament.tournamentStart;
      }
    );
    this.isEditing = false;
  }

  makeMatch()
  {
    let newMatch = {
      matchId: -1,
      winnerId: -1,
      tournamentId: this.tournament.tournamentId,
      matchTitle: "New Match Title",
      description: "",
      matchStart: new Date()
    }
    this.newMatches.push(newMatch);
    console.log(this.newMatches);
  }


}

