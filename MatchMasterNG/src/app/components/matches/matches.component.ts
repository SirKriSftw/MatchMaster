import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Dictionary } from '../../models/dictionary.model';
import { Match } from '../../models/match.model';
import { TournamentService } from '../../services/tournament.service';
import { MatchService } from '../../services/match.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrl: './matches.component.css'
})
export class MatchesComponent {
  @Input() tournamentId!: number;
  @Input() preview: boolean = false;
  
  previewMatches: Match[] = [];
  winnersSide: Dictionary<Match> = {};
  hasWinners: boolean = false;
  losersSide: Dictionary<Match> = {};
  hasLosers: boolean = false;

  mouseDown: boolean = false;
  startX : any;
  scrollLeft: any;

  constructor(private tournamentService: TournamentService,
              private matchService: MatchService
              ) {}

  ngOnInit() {
    const previewCount: number = 3;

    if(this.preview)
    {
      this.getSomeMatches(previewCount);
    }
    else
    {
      this.getGroupedMatches();
    }
  }

  getGroupedMatches() 
  {
    this.tournamentService.getTournamentGroupedMatches(this.tournamentId).subscribe(
      matches => {
        this.winnersSide = matches.winnersSide;
        if (this.winnersSide[0].length > 1)
        {
          this.hasWinners = true;
        }
        this.losersSide = matches.losersSide;
        if (this.losersSide[1])
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
    console.log(e);
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
