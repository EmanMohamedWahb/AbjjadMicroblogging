import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + 'api/auth'; 
  private currentUserSubject: BehaviorSubject<string | null>;
  public currentUser: Observable<string | null>;

  constructor(private http: HttpClient, private router: Router) {
    const storedToken = localStorage.getItem('jwtToken');
    this.currentUserSubject = new BehaviorSubject<string | null>(storedToken ? this.getUsernameFromToken(storedToken) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(username: string, password: string): Observable<void> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { username, password }).pipe(
      map(response => {
        localStorage.setItem('jwtToken', response.token);
        const usernamew = this.getUsernameFromToken(response.token);
        localStorage.setItem('username', username);
        this.currentUserSubject.next(usernamew); 
      })
    );
  }

  logout(): void {
    localStorage.removeItem('jwtToken');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    try {      
      const decodedToken: any = jwtDecode(token);
      if (decodedToken.exp) {
        const currentTime = Math.floor(Date.now() / 1000); 
        return decodedToken.exp > currentTime; 
      }

      return false; 
    } catch (error) {
      console.error('Error decoding token:', error);
      return false; 
    }
  }

  getUsernameFromToken(token: string): string {
    const payload = JSON.parse(atob(token.split('.')[1])); 
    return payload.unique_name || payload.sub || 'Unknown User';
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }
}