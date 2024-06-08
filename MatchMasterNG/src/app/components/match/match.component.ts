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

  // Flags for when to show description or edit
  showDescription = false;
  isEditing = false;
  changed = false;

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
  }

  saveEditing()
  {
    console.log(this.participantIds)
    if(this.match.matchTitle != "")
    {
      this.matchService.updateMatch(this.match).subscribe();
    }

    // If a match participant was changed
    if(this.changed)
    {
      this.changed = false;
      const changedOptions = this.participantIds.filter(p => p.new !== p.old);
      changedOptions.forEach(e => {
          this.matchService.updateMatchParticipants(this.match.matchId, e.old, e.new).subscribe(
            (r) => this.getParticipants()
          );
      })
    }
    this.isEditing = false;
  }

  hasChanged()
  {
    this.changed = true;
  }

}
