import { Injectable } from '@angular/core';
import { apiURL } from 'src/environments/environment';
import {HttpClient} from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { User } from 'src/Schemas/interfaces'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'access_token'
  private user = 'current_user'
  private apiUrl = `${apiURL}/auth`;
  private loggedIn = new BehaviorSubject<boolean>(this.isAuthenticated()); 
  loggedInStatus = this.loggedIn.asObservable();

  constructor(public http: HttpClient,  public router: Router) { }

  login(email: string, password: string): Observable<{ access_token: string; user: User }> {
    return this.http.post<{access_token: string; user: User}>(`${this.apiUrl}/login`, {email, password}).pipe(
      tap((response) => {
        localStorage.setItem(this.tokenKey,response.access_token)
        this.setCurrentUser(response.user)
        this.loggedIn.next(true);
      })
    )
  }

  autoLogin(user: User, token: string): void{
    localStorage.setItem(this.tokenKey, token);
    this.setCurrentUser(user);
    this.loggedIn.next(true);
    this.router.navigate(['/home'])
  }

  logout(): void{
    localStorage.removeItem(this.tokenKey)
    localStorage.removeItem(this.user)
    this.loggedIn.next(false);
    this.router.navigate(["/home"])
  }

  setCurrentUser(user: User): void{
    localStorage.setItem(this.user, JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): User{
    return JSON.parse(localStorage.getItem(this.user) || '{}');
  }

  isAuthenticated(): boolean{
    return !!this.getToken();
  }

  isAdmin(): boolean{
    const user = this.getCurrentUser();
    return user?.role === 'admin'
  }
}



