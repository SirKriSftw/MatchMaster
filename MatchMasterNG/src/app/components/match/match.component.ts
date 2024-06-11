import { Component, Input } from '@angular/core';
import { Match } from '../../models/match.model';
import { User } from '../../models/user.model';
import { MatchService } from '../../services/match.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  currentUserId = -1;
  isCreator: boolean = false;
  participants: User[] = [];
  participantIds: Options[] = [];
  participantsToAdd: number[] = [];
  matchForm: FormGroup;

  // Flags for when to show description or edit
  @Input() isEditing = false;
  changed = false;
  addingParticipant = false;

  // Used for cancelling edit
  originalTitle = "";
  originalDescription = "";
  originalTime!: Date;

  constructor(private authService: AuthenticationService,
              private formBuilder: FormBuilder,
              private matchService: MatchService) 
  {
    this.matchForm = this.formBuilder.group({
      title: [],
      description: [],
      matchDate: new Date(),
      matchTime: {},
    });
  }   

  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUserId();
    if(this.currentUserId == this.creatorId)
    {
      this.isCreator = true;
    }
    this.initForm();
  }

  initForm()
  {
    this.matchForm = this.formBuilder.group({
      title: [this.match.matchTitle, [Validators.required]],
      description: [this.match.description, []],
      matchDate: [this.match.matchStart],
      // For some STRANGE reason you need to recreate the date obj to be able to use functions like getHours()
      matchTime: [this.getTimeFromDate(new Date(this.match.matchStart))]
    });

    console.log(this.combineDateTime(this.matchForm.get("matchDate")?.value,this.matchForm.get("matchTime")?.value))
  }

  getTimeFromDate(dateTime: Date)
  {
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    const timeString = `${this.padZeroTime(hours)}:${this.padZeroTime(minutes)}`;
    return timeString;
  }

  padZeroTime(n: number)
  {
    return n < 10 ? `0${n}` : `${n}`;
  }

  startEditing()
  {
    if(this.currentUserId == this.creatorId)
    {
      this.isEditing = true;
      this.originalTitle = this.match.matchTitle;
      this.originalDescription = this.match.description;
      this.originalTime = this.match.matchStart;
    }
  }

  cancelEditing()
  {
    this.match.matchTitle = this.originalTitle;
    this.match.description = this.originalDescription;
    this.match.matchStart = this.originalTime;
    this.isEditing = false;
    this.addingParticipant = false;
  }

  validateAndSaveMatch()
  {
    if(this.matchForm.valid)
    {
      this.saveMatch();
    }
  }

  saveMatch()
  {
    const localDateTime = this.combineDateTime(this.matchForm.get("matchDate")?.value,this.matchForm.get("matchTime")?.value)
    const utcDateTime = new Date(localDateTime.getTime() - (localDateTime.getTimezoneOffset() * 60000))
    let match : Match =
    {
      "tournamentId": this.tournamentId,
      "matchId": this.match ? this.match.matchId : 0,
      "matchTitle": this.matchForm.get("title")?.value,
      "description": this.matchForm.get("description")?.value,
      "matchStart": utcDateTime,
    }

    if(match.matchId != 0)
    {
      this.matchService.updateMatch(match).subscribe(
        (r) => {
          this.matchService.getMatch(this.match.matchId!).subscribe(
            (r) => {
              this.match = r;
              console.log(this.match.matchStart)
            }
          )
          this.isEditing = false;
        }
      );
    }
    else
    {
      this.matchService.newMatch(match).subscribe(
        (r) => {
          this.match = r;
          this.isEditing = false;
        }
      );
    }
  }

  combineDateTime(date: Date, time: string)
  {
    console.log(time);
    // For some STRANGE reason you need to recreate the date obj to be able to use functions like getFullYear()
    date = new Date(date);
    const splitTime = time.split(":");
    const hours = parseInt(splitTime[0]);
    const minutes = parseInt(splitTime[1]);

    const combinedDateTime: Date = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hours,
      minutes
    )

    console.log(time);
    return combinedDateTime
  }


  saveEditing()
  {
    console.log(this.participantIds)
    if(this.match.matchId == null)
    {
      this.saveNewMatch();
    }
    
    else
    {
      if(this.match.matchTitle != "")
      {
        this.matchService.updateMatch(this.match).subscribe();
      }

      // If a match participant was changed
      if(this.changed)
      {
        this.updateParticipants();
      }

      // If adding a new participant
      if(this.addingParticipant)
      {
        this.saveNewParticipants();   
      }
    }

    this.isEditing = false;    
  }

  saveNewMatch()
  {
    this.matchService.newMatch(this.match).subscribe(
      (r) => {
        this.match.matchId = r.matchId;
        this.saveNewParticipants();
      }
    );
  }

  updateParticipants()
  {
    this.changed = false;
    const changedOptions = this.participantIds.filter(p => p.new !== p.old);
    changedOptions.forEach(p => {
        if(p.new == -1)
        {
          this.matchService.removeMatchParticipant(this.match.matchId!, p.old).subscribe(
            (r) => this.getParticipants()
          );
        }
        else
        {
          this.matchService.updateMatchParticipant(this.match.matchId!, p.old, p.new).subscribe(
            (r) => this.getParticipants()
          );
        }
    })
  }

  saveNewParticipants()
  {
    this.addingParticipant = false;
      this.participantsToAdd.forEach(p => {
        if(p != -1)
        {
          this.matchService.newMatchParticipant(this.match.matchId!, p).subscribe(
            (r) => {
              this.getParticipants();
            }
        
          )
        }
      })
      this.participantsToAdd = [];
  }

  hasChanged()
  {
    this.changed = true;
  }

  addParticipant()
  {
    this.addingParticipant = true;
    this.participantsToAdd.push(-1);
  }

  loadParticipants()
  {
    console.log("Loading participants");
    this.getParticipants();
  }

  getParticipants()
  {
    this.matchService.getMatchParticipants(this.match.matchId!)
     .subscribe(
      (r) => {
        this.participants = r;
        this.participantIds = this.participants.map(participant => ({new: participant.userId, old: participant.userId}));
      },
      (e) => {
        this.participants = [];
        this.participantIds = [];
      }
     )
  }

}
