import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CreatePostService {
  private apiUrl = environment.apiUrl + 'api/posts'; 

  constructor(private http: HttpClient) {}

  createPost(formData: FormData): Observable<void> {
    return this.http.post<void>(this.apiUrl, formData); 
  }
}