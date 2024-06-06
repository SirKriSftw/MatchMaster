import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tournament } from '../models/tournament.model';
import { Match } from '../models/match.model';
import { ApiConfigService } from './api-config.service';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {
  private apiUrl = `${this.apiConfig.apiUrl}/tournaments`;
  constructor(private http: HttpClient, private apiConfig: ApiConfigService) { }

  getAllTournaments(): Observable<Tournament[]> {
    return this.http.get<Tournament[]>(this.apiUrl);
  }

  getTournamentMatches(tournamentId: number): Observable<Match[]> {
    return this.http.get<Match[]>(this.apiUrl  + "/" + tournamentId + '/Matches');
  }

  getTournamentById(tournamentId: number): Observable<Tournament> {
    return this.http.get<Tournament>(this.apiUrl  + "/" + tournamentId);
  }
}
