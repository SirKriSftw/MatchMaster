import { Component, Input } from '@angular/core';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-match-participants',
  templateUrl: './match-participants.component.html',
  styleUrl: './match-participants.component.css'
})
export class MatchParticipantsComponent {
  @Input() matchParticipants: User[] = [];
  @Input() tournamentId!: number;

  constructor(private router: Router) {}

  goToProfile(userId: number)
  {
    this.router.navigate(["/profile", userId]). then(() =>{
      window.location.reload();
    });
  }
  
}
