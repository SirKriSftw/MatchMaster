import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { ApiConfigService } from './api-config.service';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());
  private apiUrl = `${this.apiConfig.apiUrl}/authentication`; 
  constructor(private http: HttpClient, private apiConfig: ApiConfigService) { }

  register(username: string, email: string, password: string)
  {
    var body = {username: username, email: email, password: password}
    return this.http.post(`${this.apiUrl}/register`, body);
  }

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

  getCurrentUserId() 
  {
    const userDataString = localStorage.getItem('userData');
    if (userDataString)
    {
      const userData = JSON.parse(userDataString);
      const userId = userData.userId;
      return userId;
    }
  }

  isLoggedIn(): boolean
  {
    return localStorage.getItem('userData') != null
  }

  get isLoggedIn$(): Observable<boolean> 
  {
    return this.loggedIn.asObservable();
  }

  setLoggedIn(value: boolean)
  {
    this.loggedIn.next(value);
  }

  logout()
  {
    localStorage.removeItem('userData');
  }
}
