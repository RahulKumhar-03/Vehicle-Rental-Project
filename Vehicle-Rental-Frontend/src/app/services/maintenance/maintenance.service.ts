import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { Maintenance } from 'src/Schemas/interfaces';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  private apiUrl = `${apiUrl}/maintenance`;

  constructor(private http: HttpClient) { }

  getAllMaintenance(): Observable<Maintenance[]>{
    const token = this.getToken();
    if(!token){
      throw new Error('No Authorization token available')
    }
    return this.http.get<Maintenance[]>(`${this.apiUrl}/`, {
      headers: new HttpHeaders({Authorization : `Bearer ${token}`})
    })
  }

  createMaintenance(maintenance: {
    vehicle_id: string;
    vehicle_name: string;
    maintenance_date: string;
  }): Observable<Maintenance>{
    const token = this.getToken();
    if(!token){
      throw new Error('No Authorization token available')
    }
    return this.http.post<Maintenance>(`${this.apiUrl}/`, maintenance, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}`})
    })
  }

  updateMaintenance(maintenanceId: string, maintenanceData: Partial<Maintenance>): Observable<Maintenance>{
    const token = this.getToken();
    if(!token){
      throw new Error('No Authorization token available')
    }
    return this.http.put<Maintenance>(`${this.apiUrl}/${maintenanceId}`, maintenanceData, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}`})
    })
  }

  deleteMaintenance(maintenanceId: string): Observable<void>{
    const token = this.getToken()
    if(!token){
      throw new Error('No Authorization token available')
    }
    return this.http.delete<void>(`${this.apiUrl}/${maintenanceId}`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}`})
    })
  }

  private getToken(): string | null{
    return localStorage.getItem('access_token')
  }
}
