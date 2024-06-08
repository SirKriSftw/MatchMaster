import { Component, Input } from '@angular/core';
import { Match } from '../../models/match.model';
import { User } from '../../models/user.model';
import { MatchService } from '../../services/match.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrl: './match.component.css'
})
export class MatchComponent {
  @Input() match!: Match;
  @Input() ownerId: number = -1;
  currentUserId = -1;
  participants: User[] = [];
  showDescription = false;
  isEditing = false;
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
      (r) => this.participants = r
     )
  }

  startEditing()
  {
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
    console.log(`Saving title: ${this.match.matchTitle}`);
    if(this.match.matchTitle != "")
      {
        this.matchService.updateMatch(this.match).subscribe();
      }
    this.isEditing = false;
  }
}
