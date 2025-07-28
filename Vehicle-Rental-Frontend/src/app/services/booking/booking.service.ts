import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { Booking, Vehicle } from 'src/Schemas/interfaces';
import { apiUrl } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${apiUrl}`;

  constructor(private http: HttpClient) { }

  getAllBookings(): Observable<Booking[]>{
    const token = this.getToken()

    if(!token){
      throw new Error('No Authorization token available')
    }
    return this.http.get<Booking[]>(`${this.apiUrl}/booking/`,{
      headers: new HttpHeaders({Authorization: `Bearer ${token}`})
    })
  }

  updateBooking(booking_id: string, bookingData: Partial<Booking>): Observable<Booking>{
    const token = this.getToken()

    if(!token){
      throw new Error('No Authorization token available')
    }
    return this.http.put<Booking>(`${this.apiUrl}/booking/${booking_id}`, bookingData, {
      headers: new HttpHeaders({Authorization: `Bearer ${token}`})
    })
  }

  createBooking(bookingData: {vehicle_id: string; vehicle_name: string; user_id: string; start_date: string; end_date: string}): Observable<Booking>{
    const token = this.getToken()

    if(!token){
      throw new Error('No Authorization token available')
    }
    return this.http.post<Booking>(`${this.apiUrl}/booking/`, bookingData, {
      headers: new HttpHeaders({Authorization: `Bearer ${token}`}),
    })
  }

  deleteBooking(booking_id: string): Observable<void>{
    const token = this.getToken()
    
    if(!token){
      throw new Error('No Authorization token available')
    }
    return this.http.delete<void>(`${this.apiUrl}/booking/${booking_id}`, {
      headers: new HttpHeaders({Authorization: `Bearer ${token}`})
    })
  }

  getVehicleById(vehicle_id: string):Observable<Vehicle>{
    return this.http.get<Vehicle>(`${this.apiUrl}/vehicle/${vehicle_id}`)
  }

  private getToken(): string | null{
    return localStorage.getItem('access_token');
  }
}
