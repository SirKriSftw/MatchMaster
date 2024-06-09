import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Match } from '../models/match.model';
import { User } from '../models/user.model';
import { ApiConfigService } from './api-config.service';
import { MatchParticipant } from '../models/match-participant.model';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private apiUrl = `${this.apiConfig.apiUrl}/matches`;
  constructor(private http: HttpClient, private apiConfig: ApiConfigService) { }

  getAllMatches(): Observable<Match[]> {
    return this.http.get<Match[]>(this.apiUrl);
  }

  getMatchParticipants(id: number)
  {
    return this.http.get<User[]>(`${this.apiUrl}/${id}/participants`);
  }

  newMatch(match: Match)
  {
    return this.http.post<Match>(`${this.apiUrl}`, match)
  }

  updateMatch(match: Match)
  {
    return this.http.put<Match>(`${this.apiUrl}/${match.matchId}`, match)
  }

  newMatchParticipant(matchId: number, userId: number)
  {
    var body = {id: matchId, userId: userId};
    return this.http.post<MatchParticipant>(`${this.apiUrl}/${matchId}/participant/${userId}`, body)
  }

  updateMatchParticipant(matchId: number, userId: number, newUserId: number)
  {
    var body = { userId: userId, newUserId: newUserId}
    return this.http.put<Match>(`${this.apiUrl}/${matchId}/participant/${userId}/${newUserId}`, body);
  }

  removeMatchParticipant(matchId: number, userId: number)
  {
    return this.http.delete<MatchParticipant>(`${this.apiUrl}/${matchId}/participant/${userId}`)
  }
}
