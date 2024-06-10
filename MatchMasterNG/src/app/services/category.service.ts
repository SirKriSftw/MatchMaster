import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from './api-config.service';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${this.apiConfig.apiUrl}/categories`; 
  constructor(private http: HttpClient, private apiConfig: ApiConfigService) { }

  getCategories()
  {
    return this.http.get<Category[]>(`${this.apiUrl}`);
  }
}
