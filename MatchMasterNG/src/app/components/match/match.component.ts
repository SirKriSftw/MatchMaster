import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Match } from '../../models/match.model';
import { User } from '../../models/user.model';
import { MatchService } from '../../services/match.service';
import { AuthenticationService } from '../../services/authentication.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  @Output() deleteMatchEvent = new EventEmitter();

  currentUserId = -1;
  isCreator: boolean = false;
  participants: User[] = [];
  matchForm: FormGroup;

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
        this.participants.push({userId: 0, username: "", email: ""});
        this.participants.push({userId: 0, username: "", email: ""});
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
    this.editEvent.emit([parseInt(this.matchLevel), this.matchIndex]);
  }

  emitDeleteEvent()
  {
    this.deleteMatchEvent.emit();
  }

  initForm()
  {
    const participantCtrls = this.participants.map(p => this.formBuilder.control(p.userId))

    this.matchForm = this.formBuilder.group({
      title: this.match.matchTitle,
      description: this.match.description,
      participants: this.formBuilder.array(participantCtrls),
      time: this.formatDate(this.match.matchStart)
    });
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
    console.log(this.matchForm.value);
  }

  startEditing()
  {
    this.isEditing = true;
    this.emitEditEvent();
  }

  deleteMatch(matchId: number)
  {
    this.matchService.deleteMatch(matchId).subscribe(() => this.emitDeleteEvent());
  }
}
