import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  apiUrl = 'http://localhost:5207/api';
}
