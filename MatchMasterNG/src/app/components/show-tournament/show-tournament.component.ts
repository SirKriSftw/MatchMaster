import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Tournament } from '../../models/tournament.model';
import { Match } from '../../models/match.model';
import { User } from '../../models/user.model';
import { TournamentService } from '../../services/tournament.service';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';
import { MatchService } from '../../services/match.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-show-tournament',
  templateUrl: './show-tournament.component.html',
  styleUrl: './show-tournament.component.css'
})
export class ShowTournamentComponent {
  tournament: Tournament = {
    tournamentId: 0,
    creatorId: 0,
    categoryId: 1,
    title: '',
    description: '',
    tournamentStart: new Date(),
    acceptingParticipants: true
  }; // Initialize to an empty object with default values

  creatorUsername: string = "";
  matches: Match[] = [];
  newMatches: Match[] = [];
  participants: User[] = [];
  currentUserId: number = -1;
  tournamentId: number = -1;

  isEditing = false;
  editingParticipants = false;
  originalTitle = "";
  originalDescription = "";
  originalStart = new Date;


  constructor(private tournamentService: TournamentService,
              private matchService: MatchService,
              private userService: UserService,
              private authService: AuthenticationService, 
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit(): void {
    this.tournamentId = parseInt(this.route.snapshot.paramMap.get("id")!);
    this.currentUserId = this.authService.getCurrentUserId();
    this.getTournament();
    this.getMatches();
    this.getParticipants();

  }

  getTournament()
  {
    this.tournamentService.getTournamentById(this.tournamentId)
    .subscribe(tournament => {
      this.tournament = tournament
      this.originalTitle = this.tournament.title;
      this.originalDescription = this.tournament.description;
      this.originalStart = this.tournament.tournamentStart;
      this.getCreatorName();
    });
  }

  getMatches()
  {
    this.tournamentService.getTournamentMatches(this.tournamentId)
    .subscribe(matches => this.matches = matches)
  }

  getParticipants()
  {
    this.tournamentService.getTournamentParticipants(this.tournamentId)
    .subscribe(participants => this.participants = participants)
  }

  getCreatorName()
  {
    this.userService.getUserInfo(this.tournament.creatorId).subscribe(
      (r) => {
        this.creatorUsername = r.username;
      }
    );
  }

  joinTournament()
  {
    this.userService.joinTournament(this.currentUserId, this.tournament.tournamentId).subscribe(
      (r) => {
        this.getParticipants()
      }
    );
  }

  leaveTournament()
  {
    this.userService.leaveTournament(this.currentUserId, this.tournament.tournamentId).subscribe(
      (r) => {
        this.getParticipants()
      }
    );
  }

  isParticipating()
  {
    return this.participants.some(participant => participant.userId == this.currentUserId)
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
    if(this.currentUserId == this.tournament.creatorId)
    {
      this.isEditing = true;
    }
    
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

  removeParticipant(userId: number)
  {
    this.tournamentService.removeParticipant(this.tournament.tournamentId, userId).subscribe(
      (r) => {
        this.getParticipants();
      }
    );
  }

  makeMatch()
  {
    let newMatch = {
      tournamentId: this.tournament.tournamentId,
      matchTitle: "New Match Title",
      description: "",
      matchStart: new Date()
    }
    this.newMatches.push(newMatch);
  }

  deleteMatch(matchId: number)
  {
    this.matchService.deleteMatch(matchId).subscribe(
      (r) => {
        this.getMatches();
      }
    );
  }
}

