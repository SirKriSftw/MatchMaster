import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TournamentComponent } from './components/tournament/tournament.component';

const routes: Routes = 
[
  {path: "tournaments", component: TournamentComponent, title: "Tournaments"},
  {path: "", redirectTo: "tournaments", pathMatch: "full"},
  {path: "**", redirectTo: "tournaments"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
