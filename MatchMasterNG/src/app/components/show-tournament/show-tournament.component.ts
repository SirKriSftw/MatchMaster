import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Tournament } from '../../models/tournament.model';
import { Match } from '../../models/match.model';
import { Dictionary } from '../../models/dictionary.model';
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
  tournament: Tournament = 
  {
    tournamentId: 0,
    creatorId: 0,
    categoryId: 1,
    title: '',
    description: '',
    tournamentStart: new Date(),
    acceptingParticipants: true
  }; 

  creatorUsername: string = "";
  matches: Dictionary<Match> = {};
  editingMatch: Match[] = [];
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
    this.tournamentService.getTournamentGroupedMatches(this.tournamentId)
    .subscribe(
      matches => 
      {
        this.matches = matches;
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

  isCreator()
  {
    return this.authService.getCurrentUserId() == this.tournament.creatorId;
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

  removeParticipant(userId: number)
  {
    this.tournamentService.removeParticipant(this.tournament.tournamentId, userId).subscribe(
      (r) => {
        this.getParticipants();
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

  addMatch(id: number | undefined, level: string)
  {
    if(id)
    {
      let newMatch = {
        tournamentId: this.tournament.tournamentId,
        matchTitle: "",
        description: "",
        matchStart: new Date(),
        prevMatch: id
      }

      if(this.matches[parseInt(level) + 1])
      {
        this.matches[parseInt(level) + 1].push(newMatch);
      }
      else
      {
        this.matches[parseInt(level) + 1] = [newMatch];
      }

      this.editingMatch.push(newMatch);
    }
  }

  editMatch(e: any)
  {
    console.log(e);
    this.editingMatch.push(this.matches[e[0]][e[1]]);
  }

  stopEdit(m: Match)
  {
    this.editingMatch = this.editingMatch.filter(match => m != match)
  }


}

