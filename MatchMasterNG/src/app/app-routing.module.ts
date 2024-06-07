import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TournamentComponent } from './components/tournament/tournament.component';
import { AllTournamentsComponent } from './components/all-tournaments/all-tournaments.component';
import { LoginComponent } from './components/login/login.component';
import { UserComponent } from './components/user/user.component';
import { NewTournamentComponent } from './components/new-tournament/new-tournament.component';

const routes: Routes = 
[
  {path: "tournaments", component: AllTournamentsComponent, title: "Tournaments"},
  {path: "tournament/:id", component: TournamentComponent},
  {path: "login", component: LoginComponent},
  {path: "profile", component: UserComponent},
  {path: "create", component: NewTournamentComponent},
  {path: "", redirectTo: "tournaments", pathMatch: "full"},
  {path: "**", redirectTo: "tournaments"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
