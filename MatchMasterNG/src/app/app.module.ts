import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TournamentComponent } from './components/tournament/tournament.component';
import { HttpClientModule } from '@angular/common/http';
import { MatchComponent } from './components/match/match.component';
import { AllTournamentsComponent } from './components/all-tournaments/all-tournaments.component';

@NgModule({
  declarations: [
    AppComponent,
    TournamentComponent,
    MatchComponent,
    AllTournamentsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
