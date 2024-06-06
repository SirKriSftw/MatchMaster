import { Component } from '@angular/core';
import { Match } from '../../models/match.model';
import { MatchService } from '../../services/match.service';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrl: './match.component.css'
})
export class MatchComponent {
  matches : Match[] = [];

  constructor(private matchService: MatchService) {}

  ngOnInit(): void {
    this.getAllMatches();
  }

  getAllMatches(): void {
    this.matchService.getAllMatches()
      .subscribe(matches => this.matches = matches);
  }
}
