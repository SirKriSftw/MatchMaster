import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Match } from '../models/match.model';
import { User } from '../models/user.model';
import { ApiConfigService } from './api-config.service';

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

  updateMatch(match: Match)
  {
    return this.http.put<Match>(`${this.apiUrl}/${match.matchId}`, match)
  }
}
