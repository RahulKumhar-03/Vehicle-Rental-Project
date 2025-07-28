import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from 'src/app/services/booking/booking.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Booking, Vehicle } from 'src/Schemas/interfaces';
import { EditBookingModalComponent } from '../edit-booking-modal/edit-booking-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, EditBookingModalComponent],
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.css']
})
export class BookingListComponent implements OnInit {
  bookings: Booking[] = []
  isLoading: boolean = false
  bookingModalOpened: boolean = false
  selectedBooking: Booking | null = null
  selectedVehicle: Vehicle | null = null

  constructor(private bookingService: BookingService, public authService: AuthService, private router: Router) {}

  ngOnInit(): void{
    this.loadBookings()
  }

  loadBookings():void{
    this.isLoading = true
    this.bookingService.getAllBookings().subscribe({
      next: (bookings : Booking[]) => {
        if(this.authService.isAdmin()){
          this.bookings = bookings
        } else {
          const currentUser = this.authService.getCurrentUser().id;
          this.bookings = bookings.filter(booking => booking.user_id === currentUser)
        }
        this.isLoading = false
      },
      error: (err) => {
        console.error('Error while fetching bookings',err)
        this.isLoading = false
      }
    })
  }

  deleteBooking(booking_id: string){
    if(confirm('Are you sure? You want to delete booking!!!')){
      this.bookingService.deleteBooking(booking_id).subscribe({
        next: () => this.loadBookings(),
        error: (err) => console.error('Error while deleting the booking!',err)
      })
    }
  }

  async openEditBookingModal(booking?: Booking): Promise<void>{
    this.selectedBooking = booking || null;
    if(this.selectedBooking){
      try {
        const vehicle = await this.bookingService.getVehicleById(this.selectedBooking.vehicle_id).toPromise();
        this.selectedVehicle = vehicle || null;
      } catch (error) {
        console.error('Error fetching vehicle:',error)
        this.selectedVehicle = null
      }
    } else{
      this.selectedVehicle = null
    }
    this.bookingModalOpened = true
  }

  closeBookingModal(bookingData: any) {
    this.bookingModalOpened = false;
    
    if (bookingData) {
      if (this.selectedBooking) {
        this.bookingService.updateBooking(this.selectedBooking.id!, bookingData).subscribe({
          next: () => {
            this.loadBookings();
            this.router.navigate(['/booking'])
          },
          error: (err) => console.error('Error while updating the booking!', err),
        });
      }
    }
    this.selectedBooking = null;
    this.selectedVehicle = null;
  }
}
