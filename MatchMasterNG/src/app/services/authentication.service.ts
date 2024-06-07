import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from './api-config.service';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiUrl = `${this.apiConfig.apiUrl}/authentication`; 
  constructor(private http: HttpClient, private apiConfig: ApiConfigService) { }

  login(email: string, password: string): Observable<any> 
  {
    const loginUrl = `${this.apiUrl}/login`;
    var body = 
    { 
      'email' : email, 
      'password': password 
    }

    return this.http.post<any>(loginUrl, body, {headers:new HttpHeaders({'Content-Type':'application/json'})});
  }

  getCurrentUserId(): number 
  {
    const userDataString = localStorage.getItem('userData');
    if (userDataString)
    {
      const userData = JSON.parse(userDataString);
      const userId = userData.userId;
      return userId;
    }
    else
    {
      return -1;
    }
  }

  isLoggedIn()
  {
    return localStorage.getItem('userData') != null
  }
}
