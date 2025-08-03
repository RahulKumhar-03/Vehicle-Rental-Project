import { Injectable } from '@angular/core';
import { apiUrl } from 'src/environments/environment';
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
  private apiUrl = `${apiUrl}/auth`;

  private loggedIn = new BehaviorSubject<boolean>(this.isAuthenticated()); 
  loggedInStatus = this.loggedIn.asObservable();

  private currentUserCache: User | null = null;

  constructor(public http: HttpClient,  public router: Router) { }

  login(email: string, password: string): Observable<{ access_token: string; user: User }> {
    return this.http.post<{access_token: string; user: User}>(`${this.apiUrl}/login`, {email, password}).pipe(
      tap((response) => {
        localStorage.setItem(this.tokenKey,response.access_token)
        this.currentUserCache = response.user;
        this.loggedIn.next(true);
      })
    )
  }

  autoLogin(user: User, token: string): void{
    localStorage.setItem(this.tokenKey, token);
    this.currentUserCache = user;
    this.loggedIn.next(true);
    this.router.navigate(['/home'])
  }

  logout(): void{
    localStorage.removeItem(this.tokenKey)
    this.currentUserCache = null;
    this.loggedIn.next(false);
    this.router.navigate(["/home"])
  }

  // setCurrentUser(user: User): void{
  //   localStorage.setItem(this.user, JSON.stringify(user));
  // }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): User{
    // return JSON.parse(localStorage.getItem(this.user) || '{}');
    if (this.currentUserCache) {
      return this.currentUserCache;
    }
    
    // If cache is empty but token exists, decode user from token
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // You'll need to store user info in JWT payload during login
        return payload.user || {} as User;
      } catch (error) {
        console.error('Error decoding token:', error);
        return {} as User;
      }
    }
    
    return {} as User;
  }

  isAuthenticated(): boolean{
    return !!this.getToken();
  }

  isAdmin(): boolean{
    const user = this.getCurrentUser();
    return user?.role === 'admin'
  }

  isCustomer(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'customer';
  }
}



