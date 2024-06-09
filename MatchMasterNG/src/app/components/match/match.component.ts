import { Component, Input } from '@angular/core';
import { Match } from '../../models/match.model';
import { User } from '../../models/user.model';
import { MatchService } from '../../services/match.service';
import { AuthenticationService } from '../../services/authentication.service';

interface Options {
  new: number;
  old: number;
}

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrl: './match.component.css'
})
export class MatchComponent {
  @Input() match!: Match;
  @Input() ownerId: number = -1;
  @Input() tournamentParticipants: User[] = [];
  currentUserId = -1;
  participants: User[] = [];
  participantIds: Options[] = [];
  participantsToAdd: number[] = [];

  // Flags for when to show description or edit
  showDescription = false;
  @Input() isEditing = false;
  changed = false;
  addingParticipant = false;

  // Used for cancelling edit
  originalTitle = "";
  originalDescription = "";
  originalTime!: Date;

  constructor(private authService: AuthenticationService,
              private matchService: MatchService) {}   

  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUserId();
    this.getParticipants();
  }

  getParticipants()
  {
    this.matchService.getMatchParticipants(this.match.matchId)
     .subscribe(
      (r) => {
        this.participants = r;
        this.participantIds = this.participants.map(participant => ({new: participant.userId, old: participant.userId}));
      },
      (e) => {
        this.participants = [];
        this.participantIds = [];
      }
     )
  }

  startEditing()
  {
    console.log(this.participantIds);
    if(this.currentUserId == this.ownerId)
    {
    this.isEditing = true;
    this.originalTitle = this.match.matchTitle;
    this.originalDescription = this.match.description;
    this.originalTime = this.match.matchStart;
    }
  }

  cancelEditing()
  {
    console.log("Canceling title edit");
    this.match.matchTitle = this.originalTitle;
    this.match.description = this.originalDescription;
    this.match.matchStart = this.originalTime;
    this.isEditing = false;
    this.addingParticipant = false;
  }

  saveEditing()
  {
    console.log(this.participantIds)
    if(this.match.matchId == -1)
    {
      console.log(this.match)
      this.saveNewMatch();
    }
    
    else
    {
      if(this.match.matchTitle != "")
      {
        this.matchService.updateMatch(this.match).subscribe();
      }

      // If a match participant was changed
      if(this.changed)
      {
        this.updateParticipants();
      }

      // If adding a new participant
      if(this.addingParticipant)
      {
        this.saveNewParticipants();   
      }
    }

    this.isEditing = false;    
  }

  saveNewMatch()
  {
    this.matchService.newMatch(this.match).subscribe(
      (r) => {
        this.match.matchId = r.matchId;
        this.saveNewParticipants();
      }
    );
  }

  updateParticipants()
  {
    this.changed = false;
    const changedOptions = this.participantIds.filter(p => p.new !== p.old);
    changedOptions.forEach(p => {
        if(p.new == -1)
        {
          this.matchService.removeMatchParticipant(this.match.matchId, p.old).subscribe(
            (r) => this.getParticipants()
          );
        }
        else
        {
          this.matchService.updateMatchParticipant(this.match.matchId, p.old, p.new).subscribe(
            (r) => this.getParticipants()
          );
        }
    })
  }

  saveNewParticipants()
  {
    this.addingParticipant = false;
      this.participantsToAdd.forEach(p => {
        if(p != -1)
        {
          this.matchService.newMatchParticipant(this.match.matchId, p).subscribe(
            (r) => {
              this.getParticipants();
            }
        
          )
        }
      })
      this.participantsToAdd = [];
  }

  hasChanged()
  {
    this.changed = true;
  }

  addParticipant()
  {
    this.addingParticipant = true;
    this.participantsToAdd.push(-1);
  }

}
