import { Component, Input } from '@angular/core';
import { Match } from '../../models/match.model';
import { User } from '../../models/user.model';
import { MatchService } from '../../services/match.service';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrl: './match.component.css'
})
export class MatchComponent {
  @Input() match!: Match;
  participants: User[] = [];

  constructor(private matchService: MatchService) {}   

  ngOnInit(): void {
    this.getParticipants();
  }

  getParticipants()
  {
    this.matchService.getMatchParticipants(this.match.matchId)
     .subscribe(
      (r) => this.participants = r
     )
  }
}
