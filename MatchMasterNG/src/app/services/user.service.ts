import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tournament } from '../models/tournament.model';
import { ApiConfigService } from './api-config.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${this.apiConfig.apiUrl}/users`;
  constructor(private http: HttpClient, private apiConfig: ApiConfigService) { }

  getMyTournaments(userId: number)
  {
    return this.http.get<Tournament[]>(`${this.apiUrl}/${userId}/Created/Tournaments`);
  }
}
