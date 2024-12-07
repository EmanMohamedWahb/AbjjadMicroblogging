import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TimelineService {
  private apiUrl = environment.apiUrl + 'api/posts';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<any[]> {
    const screenWidth = window.innerWidth;
    return this.http.get<any[]>(this.apiUrl+'/'+screenWidth);
  }
}