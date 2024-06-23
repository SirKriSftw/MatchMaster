import { Component, Input } from '@angular/core';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { MatchService } from '../../services/match.service';


@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrl: './participants.component.css'
})
export class ParticipantsComponent {
  @Input() participantsList: User[] = [];
  @Input() matchId: number | undefined;

  constructor(private router: Router,
              private matchService: MatchService
              ) {}

  ngOnInit() 
  {
    if(this.matchId)
    {
      this.getParticipants();
    }
  }

  goToProfile(userId: number)
  {
    this.router.navigate(["/profile", userId]). then(() =>{
      window.location.reload();
    });
  }

  getParticipants()
  {
    this.matchService.getMatchParticipants(this.matchId!).subscribe(
      participants => {
        this.participantsList = participants;
        if (this.participantsList.length == 1)
        {
          this.participantsList.push({userId: 0, username: "", email: ""});
        }
      },
      notFound => {
        this.participantsList = [{userId: 0, username: "", email: ""},{userId: 0, username: "", email: ""}];
      }
    );
  }
}
