import { Component, Input } from '@angular/core';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-match-participants',
  templateUrl: './match-participants.component.html',
  styleUrl: './match-participants.component.css'
})
export class MatchParticipantsComponent {
  @Input() matchParticipants: User[] = [];
  @Input() tournamentId!: number;


  
}
