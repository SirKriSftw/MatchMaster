import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tournament } from '../models/tournament.model';
import { Match } from '../models/match.model';
import { ApiConfigService } from './api-config.service';
import { AuthenticationService } from './authentication.service';
import { User } from '../models/user.model';
import { Dictionary } from '../models/dictionary.model';

interface group {
  winnersSide: Dictionary<Match[]>,
  losersSide: Dictionary<Match[]>
}

@Injectable({
  providedIn: 'root'
})
export class TournamentService {
  private apiUrl = `${this.apiConfig.apiUrl}/tournaments`;
  constructor(private http: HttpClient, private authService: AuthenticationService, private apiConfig: ApiConfigService) { }

  getAllTournaments(): Observable<Tournament[]> {
    return this.http.get<Tournament[]>(this.apiUrl);
  }

  getTournamentMatches(tournamentId: number): Observable<Match[]> {
    return this.http.get<Match[]>(`${this.apiUrl}/${tournamentId}/Matches`);
  }

  getSomeTournamentMatches(tournamentId: number, count: number): Observable<Match[]> {
    return this.http.get<Match[]>(`${this.apiUrl}/${tournamentId}/Matches/${count}`);
  }

  getTournamentGroupedMatches(tournamentId: number): Observable<any> {
    return this.http.get<group>(`${this.apiUrl}/${tournamentId}/Matches/Group`);
  }

  getTournamentById(tournamentId: number): Observable<Tournament> {
    return this.http.get<Tournament>(`${this.apiUrl}/${tournamentId}`);
  }

  getTournamentParticipants(tournamentId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/${tournamentId}/participants`);
  }

  createTournament(tournament: Tournament)
  {
    tournament.creatorId = this.authService.getCurrentUserId();
    return this.http.post<Tournament>(this.apiUrl, tournament);
  }

  updateTournament(tournament: Tournament)
  {
    return this.http.put<Tournament>(`${this.apiUrl}/${tournament.tournamentId}`, tournament);
  }
  
  deleteTournament(tournamentId: number)
  {
    return this.http.delete(`${this.apiUrl}/${tournamentId}`);
  }

  removeParticipant(tournamentId: number, userId: number)
  {
    return this.http.delete(`${this.apiUrl}/${tournamentId}/participant/${userId}`);
  }
}
