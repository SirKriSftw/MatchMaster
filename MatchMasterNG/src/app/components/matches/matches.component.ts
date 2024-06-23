import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Dictionary } from '../../models/dictionary.model';
import { Match } from '../../models/match.model';
import { TournamentService } from '../../services/tournament.service';
import { MatchService } from '../../services/match.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrl: './matches.component.css'
})
export class MatchesComponent {
  @Input() tournamentId!: number;
  @Input() creatorId!: number;
  @Input() preview: boolean = false;
  
  previewMatches: Match[] = [];
  matches: Dictionary<Match>[] = [];
  hasWinners: boolean = false;
  hasLosers: boolean = false;
  currentUserId: number = 0;

  mouseDown: boolean = false;
  startX : any;
  scrollLeft: any;

  constructor(private tournamentService: TournamentService,
              private matchService: MatchService,
              private authService: AuthenticationService
              ) {}

  ngOnInit() {
    const previewCount: number = 3;
    this.currentUserId = this.authService.getCurrentUserId();

    if(this.preview)
    {
      this.getSomeMatches(previewCount);
    }
    else
    {
      this.getGroupedMatches();
    }
  }

  isCreator()
  {
    return this.currentUserId == this.creatorId;
  }

  getGroupedMatches() 
  {
    this.tournamentService.getTournamentGroupedMatches(this.tournamentId).subscribe(
      matches => {
        this.matches[0] = matches.winnersSide;
        if (this.matches[0][0].length > 1)
        {
          this.hasWinners = true;
        }
        this.matches[1] = matches.losersSide;
        if (Object.keys(this.matches[1]).length !== 0)
        {
          this.hasLosers = true;
        }
      }
    );
  }

  getSomeMatches(count: number)
  {
    this.tournamentService.getSomeTournamentMatches(this.tournamentId, count).subscribe(
      matches => {
        this.previewMatches = matches;
      }
    );
  }

  startDragging(e: MouseEvent, slider: HTMLElement)
  {
    e.preventDefault();
    this.mouseDown = true;
    this.startX = e.pageX - slider.offsetLeft;
    this.scrollLeft = slider!.scrollLeft;
  }

  stopDragging()
  {
    this.mouseDown = false;
  }

  moveEvent(e: MouseEvent, slider: HTMLElement)
  {
    if (!this.mouseDown) return;
    e.preventDefault();

    const sliderSpeed = 2;
    const x = e.pageX - slider.offsetLeft;
    const scroll = (x - this.startX) * sliderSpeed;
    slider.scrollLeft = this.scrollLeft - scroll;
  }
}
