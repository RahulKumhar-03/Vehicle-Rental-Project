import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { apiUrl } from 'src/environments/environment';
import { Vehicle } from 'src/Schemas/interfaces';
@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private apiUrl = `${apiUrl}/vehicle`

  constructor(private http: HttpClient, private router: Router) { }

  getVehicles(): Observable<Vehicle[]>{
    return this.http.get<Vehicle[]>(`${this.apiUrl}/`)
  }

  updateVehicle(vehicleId: string, vehicle: Partial<Vehicle>): Observable<Vehicle>{
    const token = this.getToken();
    if (!token) {
      throw new Error('No authentication token available');
    }
    return this.http.put<Vehicle>(`${this.apiUrl}/${vehicleId}`, vehicle, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
    });
  }

  private getToken(): string | null{
    return localStorage.getItem('access_token');
  }

  createVehicle(vehicle: {
    model: string, 
    type: string, 
    rental_rate: number, 
    gearType: string, 
    license_plate_no: string,
    location: string,
    description?: string,
    status: string,
    imageUrl?: string,
    range?: number }): Observable<Vehicle> {
      const token = this.getToken();
    if (!token) {
      throw new Error('No authentication token available');
    }
    return this.http.post<Vehicle>(`${this.apiUrl}/`, vehicle, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
    });
  }

  deleteVehicle(vehicle_id: string): Observable<void>{
    const token = this.getToken();
    if (!token) {
      throw new Error('No authentication token available');
    }
    return this.http.delete<void>(`${this.apiUrl}/${vehicle_id}`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
    });
  }
}
