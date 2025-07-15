import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {HttpClient} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User } from 'src/Schemas/interfaces'
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'access_token'
  private userKey = 'current_user'
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(public http: HttpClient,  public router: Router) { }

  login(email: string, password: string): Observable<{ access_token: string; user: User }> {
    return this.http.post<{access_token: string; user: User}>(`${this.apiUrl}/login`, {email, password}).pipe(
      tap((response) => {
        localStorage.setItem(this.tokenKey,response.access_token)
        this.setCurrentUser(response.user)
      })
    )
  }

  logout(): void{
    localStorage.removeItem(this.tokenKey)
    localStorage.removeItem(this.userKey)
    this.router.navigate(["/login"])
  }

  setCurrentUser(user: User): void{
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): User{
    return JSON.parse(localStorage.getItem(this.userKey) || '{}');
  }

  isAuthenticated(): boolean{
    return !!this.getToken();
  }

  isAdmin(): boolean{
    const user = this.getCurrentUser();
    return user?.role === 'admin'
  }
}
export const authGuard = () => {
  return (next: any, state: any) => {
    const authService = new AuthService(next.injector.get(HttpClient), next.injector.get(Router));
    if (authService.isAuthenticated()){
      return true;
    }
    else{
      authService.router.navigate(['/login'])
      return false
    }
  }
}

export const adminGuard = () => {
  return (next: any, state: any) => {
    const authService = new AuthService(next.injector.get(HttpClient), next.injector.get(Router));
    if(authService.isAuthenticated() && authService.isAdmin()){
      return true
    }
    else{
      authService.router.navigate(['/vehicle-list'])
      return false
    }
  }
}
