import { Component, Input } from '@angular/core';
import { TournamentService } from '../../services/tournament.service';
import { Tournament } from '../../models/tournament.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrl: './tournament.component.css'
})
export class TournamentComponent {
  tournamentToEdit: Tournament | undefined;
  tournamentForm: FormGroup;
  categories: Category[] = [];

  constructor(private route: ActivatedRoute, 
              private router: Router,
              private formBuilder: FormBuilder, 
              private tournamentService: TournamentService,
              private categoryService: CategoryService)
              {
                this.tournamentForm = this.formBuilder.group({
                  title: [],
                  description: [],
                  tournamentStart: [],
                  category: [],
                  accepting: []
                });
              }

  ngOnInit()
  {
    const tournamentId = Number(this.route.snapshot.paramMap.get("id"));
    if(tournamentId)
    {
      this.tournamentService.getTournamentById(tournamentId).subscribe(t => this.tournamentToEdit = t);
    }

    this.getCategories();
  }

  getCategories()
  {
    this.categoryService.getCategories().subscribe(
      (r) => {
        this.categories = r;
        this.initForm();
      }
    );
  }

  initForm()
  {
    this.tournamentForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', []],
      tournamentStart: [new Date().toISOString().slice(0, 16), []],
      category: [this.categories.length > 0 ? this.categories[0].categoryId : null,[]],
      accepting: [true, []]
    });

    console.log(this.tournamentForm)
  }

  validateAndCreateTournament()
  {
    if(this.tournamentForm.valid)
      this.createTournament();
  }

  createTournament()
  {
    var tournament: Tournament = 
    {
      "tournamentId": this.tournamentToEdit ? this.tournamentToEdit.tournamentId : 0,
      "creatorId": this.tournamentToEdit ? this.tournamentToEdit.creatorId : 0,
      "categoryId": this.tournamentForm.get("category")?.value,
      "title": this.tournamentForm.get("title")?.value,
      "description": this.tournamentForm.get("description")?.value,
      "tournamentStart": this.tournamentForm.get("tournamentStart")?.value,
      "acceptingParticipants": this.tournamentForm.get("accepting")?.value
    }

    if(this.tournamentToEdit)
    {
      this.tournamentService.updateTournament(tournament)
      .subscribe(
       (r) => this.router.navigate(["/"]) 
      );
    }
    else
    {
      this.tournamentService.createTournament(tournament)
      .subscribe(
       (r) => this.router.navigate(["/"]) 
      );
    }

  }
}

