import { Injectable } from '@angular/core';
import { User } from 'src/Schemas/interfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { apiUrl } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private api = `${apiUrl}/auth`;
  private token = 'access_token'

  constructor(public http: HttpClient) { }

  register(user: {name: string, email: string, address: string, password: string}): Observable<{user: User; access_token: string; token_type: string}> {
    return this.http.post<{user: User; access_token: string; token_type: string}>(`${this.api}/register`, user)
  };

  getProfile(): Observable<User> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.getToken()}`});

    return this.http.get<User>(`${this.api}/profile`, { headers });
  }

  private getToken(): string | null{
    return localStorage.getItem(this.token)
  }
  
}
