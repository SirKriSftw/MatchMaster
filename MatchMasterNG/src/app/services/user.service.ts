import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tournament } from '../models/tournament.model';
import { ApiConfigService } from './api-config.service';
import { User } from '../models/user.model';
import { Match } from '../models/match.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${this.apiConfig.apiUrl}/users`;
  constructor(private http: HttpClient, private apiConfig: ApiConfigService) { }

  getUserInfo(userId: number)
  { 
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }

  getCreatedTournaments(userId: number)
  {
    return this.http.get<Tournament[]>(`${this.apiUrl}/${userId}/created/tournaments`)
  }

  getUpcomingTournaments(userId: number)
  {
    return this.http.get<Tournament[]>(`${this.apiUrl}/${userId}/upcoming/tournaments`)
  }

  getPastTournaments(userId: number)
  {
    return this.http.get<Tournament[]>(`${this.apiUrl}/${userId}/past/tournaments`)
  }
  
  getUpcomingMatches(userId: number)
  {
    return this.http.get<Match[]>(`${this.apiUrl}/${userId}/upcoming/matches`)
  }

  getPastMatches(userId: number)
  {
    return this.http.get<Match[]>(`${this.apiUrl}/${userId}/past/matches`)
  }

  joinTournament(userId: number, tournamentId: number)
  {
    return this.http.post(`${this.apiUrl}/${userId}/tournament/${tournamentId}`,{})
  }

  leaveTournament(userId: number, tournamentId: number)
  {
    return this.http.delete(`${this.apiUrl}/${userId}/tournament/${tournamentId}`)
  }
}
