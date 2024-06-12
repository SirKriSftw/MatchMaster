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

  emptyMatch: Match = {
    tournamentId: this.tournament.tournamentId,
    matchTitle: "",
    description: "",
    matchStart: new Date()
  };

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

  goToProfile(userId: number)
  {
    this.router.navigate(["/profile", userId]). then(() =>{
      window.location.reload();
    });
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
    this.matches = [];
    this.tournamentService.getTournamentMatches(this.tournamentId)
    .subscribe(
      matches => 
        {
        this.matches = matches;
        this.updateMatchesList();
        })
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

  isParticipating()
  {
    return this.participants.some(participant => participant.userId == this.currentUserId)
  }

  makeMatch()
  {
    this.matches.unshift(this.emptyMatch);
    this.updateMatchesList();
  }

  joinTournament()
  {
    this.userService.joinTournament(this.currentUserId, this.tournament.tournamentId).subscribe(
      (r) => {
        this.getParticipants()
      }
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

  leaveTournament()
  {
    this.userService.leaveTournament(this.currentUserId, this.tournament.tournamentId).subscribe(
      (r) => {
        this.getParticipants()
      }
    );
  }

  deleteTournament(tournamentId: number)
  {
    this.tournamentService.deleteTournament(tournamentId)
     .subscribe(
      (r) => this.router.navigate(["/"])
     );
  }

  removeParticipant(userId: number)
  {
    this.tournamentService.removeParticipant(this.tournament.tournamentId, userId).subscribe(
      (r) => {
        this.getParticipants();
      }
    );
  }

  deleteMatch(matchId: number)
  {
    this.matchService.deleteMatch(matchId).subscribe(
      (r) => {
        this.getMatches();
      }
    );
  }

  cancelMatch(index: number)
  {
    this.matches.splice(index, 1)
    this.updateMatchesList();
  }

  // Helper function to update the matches list after ever add/delete from the list
  updateMatchesList()
  {
    // For some reason the list display wont update if it references the same 
    // list in memory, so I use temp to make a new list in memory then 
    // make this.matches point to the new one
    let temp: Match[] = [];
    temp = temp.concat(this.matches);
    this.matches = [];
    this.matches = temp;
  }
}

