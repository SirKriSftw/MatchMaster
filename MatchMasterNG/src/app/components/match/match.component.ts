import { Component, Input } from '@angular/core';
import { Match } from '../../models/match.model';
import { MatchService } from '../../services/match.service';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrl: './match.component.css'
})
export class MatchComponent {
  @Input() match: any;

  constructor(private matchService: MatchService) {}   

  ngOnInit(): void {

  }
}
