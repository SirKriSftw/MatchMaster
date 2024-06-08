import { Component } from '@angular/core';

@Component({
  selector: 'app-new-tournament',
  templateUrl: './new-tournament.component.html',
  styleUrl: './new-tournament.component.css'
})
export class NewTournamentComponent {

  createTournament(form: any)
  {
    console.log(form)
  }
}
