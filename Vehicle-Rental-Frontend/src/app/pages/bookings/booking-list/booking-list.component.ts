import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from 'src/app/services/booking/booking.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Booking, Vehicle } from 'src/Schemas/interfaces';
import { EditBookingModalComponent } from '../edit-booking-modal/edit-booking-modal.component';
import { Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { DetailModalComponent } from 'src/app/shared/components/detail-modal/detail-modal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, EditBookingModalComponent,MatTableModule, DetailModalComponent, MatDialogModule],
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.css']
})
export class BookingListComponent implements OnInit {
  bookings: Booking[] = []
  isLoading: boolean = false
  bookingModalOpened: boolean = false
  selectedBooking: Booking | null = null
  selectedVehicle: Vehicle | null = null

  displayedColumns: string[] = []
  dataSource = new MatTableDataSource<Booking>()
  
  constructor(
    private bookingService: BookingService, 
    public authService: AuthService, 
    private router: Router,
    public dialog: MatDialog,
  ) {}
  
  ngOnInit(): void{
    this.setDisplayedColumns();
    this.loadBookings();
  }

  setDisplayedColumns():void{
    if(this.authService.isAdmin()){
      this.displayedColumns = ['user_name','vehicle_id','start_date','end_date'];
    }
    else if(this.authService.isCustomer()){
      this.displayedColumns = ['booking_id', 'vehicle_name', 'start_date','end_date','action']
    }
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
        console.log('Filter Bookings: ',this.bookings)
        this.dataSource.data = this.bookings;
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

  closeEditBookingModal(bookingData: any) {
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

  openBookingDetails(booking: Booking){
    this.dialog.open(DetailModalComponent, {
      width: '400px',
      data: {item: booking, itemType: 'Booking'},
      position:{ top:'-540px', left:'400px' },
      panelClass:'custom-dialog'
    })
  }
}
