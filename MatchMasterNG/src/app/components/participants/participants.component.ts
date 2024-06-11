import { Component, Input } from '@angular/core';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrl: './participants.component.css'
})
export class ParticipantsComponent {
  @Input() participantsList: User[] = [];

  constructor(private router: Router) {}

  goToProfile(userId: number)
  {
    this.router.navigate(["/profile", userId]). then(() =>{
      window.location.reload();
    });
  }
}
