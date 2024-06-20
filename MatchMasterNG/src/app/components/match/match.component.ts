import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Match } from '../../models/match.model';
import { User } from '../../models/user.model';
import { MatchService } from '../../services/match.service';
import { AuthenticationService } from '../../services/authentication.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';
import { MatchParticipant } from '../../models/match-participant.model';

interface Options {
  new: number;
  old: number;
}

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrl: './match.component.css'
})
export class MatchComponent {
  @Input() match!: Match;
  @Input() tournamentId!: number;
  @Input() creatorId: number = -1;
  @Input() tournamentParticipants: User[] = [];

  @Input() matchIndex: number = 0;
  @Input() matchLevel: string = "0";
  @Input() isEditing = false;

  @Output() editEvent = new EventEmitter();
  @Output() cancelEditEvent = new EventEmitter();
  @Output() deleteMatchEvent = new EventEmitter();

  currentUserId = -1;
  isCreator: boolean = false;
  participants: User[] = [];
  matchForm: FormGroup;
  oldForm: any;

  constructor(private authService: AuthenticationService,
              private formBuilder: FormBuilder,
              private matchService: MatchService) 
  {
    this.matchForm = this.formBuilder.group({
      title: '',
      description: '',
      participants: this.formBuilder.array([]),
      time: ''
    });
  }   

  ngOnInit(): void 
  {
    this.currentUserId = this.authService.getCurrentUserId();
    if(this.currentUserId == this.creatorId)
    {
      this.isCreator = true;
    }
    this.getParticipants(); 
    this.initForm();   
  }

  getParticipants()
  {
    this.matchService.getMatchParticipants(this.match.matchId!)
     .subscribe(
      (r) => {
        this.participants = r;
        if (this.participants.length == 1)
        {
          this.participants.push({userId: 0, username: "", email: ""});
        }
        this.initForm();
      },
      (e) => {
        this.participants = [{userId: 0, username: "", email: ""},{userId: 0, username: "", email: ""}];
        this.initForm();
      }
     )
  }

  get participantControls()
  {
    return (<FormArray>this.matchForm.get("participants")).controls;
  }

  emitEditEvent()
  {
    this.editEvent.emit([this.match.matchId,parseInt(this.matchLevel), this.matchIndex]);
  }

  emitDeleteEvent()
  {
    this.deleteMatchEvent.emit();
  }

  emitCancelEditEvent()
  {
    this.isEditing = false;
    this.cancelEditEvent.emit([this.match.matchId, parseInt(this.matchLevel), this.matchIndex]);
  }

  initForm()
  {
    const participantCtrls = this.participants.map(p => this.formBuilder.control(p.userId))

    this.matchForm = this.formBuilder.group({
      title: this.match.matchTitle,
      participants: this.formBuilder.array(participantCtrls),
      time: this.formatDate(this.match.matchStart)
    });
    this.oldForm = this.matchForm.value;
  }

  formatDate(dateToFormat: Date)
  {
    // Ensure the passed in arg is a date obj
    let date = new Date(dateToFormat);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  onSubmit()
  {
    this.saveMatch();
  }

  saveMatch()
  {
    this.match.matchTitle = this.matchForm.get("title")?.value;
    this.match.matchStart = this.matchForm.get("time")?.value;

    if(this.match.matchId)
    {
      this.matchService.updateMatch(this.match).subscribe((r) => {
        this.updateParticipants();
      });
    }
    
    else
    {
      this.matchService.newMatch(this.match).subscribe((r) => {
        this.match = r;
        this.newMatchParticipants();
      });
    }
  }

  updateParticipants()
  {
    if("participants" in this.oldForm)
    {
      let oldParticipantIds: number[] = this.oldForm["participants"];
      let newParticipantIds = this.matchForm.get("participants")?.value;

      let observables: Observable<MatchParticipant>[] = [];

      newParticipantIds.forEach( (id: number, i: number) => {
        if(id != oldParticipantIds[i])
        {
            if(oldParticipantIds[i] == 0)
            {
              console.log(`New match participant with matchId: ${this.match.matchId} and userId: ${id}`);
              observables.push(this.matchService.newMatchParticipant(this.match.matchId!, id));
            }
            else if(id == 0)
            {
              console.log(`Delete match participant with matchId: ${this.match.matchId} and userId: ${oldParticipantIds[i]}`);
              observables.push(this.matchService.removeMatchParticipant(this.match.matchId!,oldParticipantIds[i]));
            }
            else
            {
              console.log(`Change match participant with matchId: ${this.match.matchId} and userId: ${oldParticipantIds[i]} to newUserId: ${id}`);
              observables.push(this.matchService.updateMatchParticipant(this.match.matchId!,oldParticipantIds[i], id));
            }
        }
      });

      console.log(observables.length);
      if(observables.length > 0)
      {
        forkJoin(observables).subscribe(() => {
          this.getParticipants();
          this.emitCancelEditEvent();
        });
      }
      else
      {
        this.emitCancelEditEvent();
      }      
    }
  }

  newMatchParticipants()
  {
    let newParticipantIds = this.matchForm.get("participants")?.value;
    let observables: Observable<MatchParticipant>[] = [];

    newParticipantIds.forEach((id: number) => {
      if(id != 0)
      {
        observables.push(this.matchService.newMatchParticipant(this.match.matchId!, id));
      }      
    })

    if(observables.length > 0)
    {
      forkJoin(observables).subscribe(() => {
        this.getParticipants();
        this.emitCancelEditEvent();
      });
    }
    else
    {
      this.emitCancelEditEvent();
    }  
  }

  startEditing()
  {
    this.isEditing = true;
    this.oldForm = this.matchForm.value;
    this.emitEditEvent();
  }

  cancelEdit()
  {
    this.matchForm.patchValue(this.oldForm);
    this.emitCancelEditEvent();
  }

  deleteMatch(matchId: number)
  {
    this.matchService.deleteMatch(matchId).subscribe(() => this.emitDeleteEvent());
  }
}
