import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vehicle } from 'src/Schemas/interfaces';
import { VehicleService } from 'src/app/services/vehicle/vehicle.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { VehicleFormComponent } from '../vehicle-form/vehicle-form.component';
import { BookingFormComponent } from '../../bookings/booking-form/booking-form.component';
import { BookingService } from 'src/app/services/booking/booking.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [CommonModule, VehicleFormComponent, BookingFormComponent, ReactiveFormsModule],
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit {

  isCreating: boolean = false
  bookingModalOpened: boolean = false
  vehicleModalOpened: boolean = false
  selectedVehicle: Vehicle | null = null
  vehicles: Vehicle[] = []
  searchForm: FormGroup;
  currentDate: string = new Date().toISOString()

  constructor( 
    public vehicleService: VehicleService,
    public authService: AuthService,
    public bookingService: BookingService,
    private fb: FormBuilder
  ){
    this.searchForm = this.fb.group({
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      vehicle_type: ['']
    })
  }

  ngOnInit():void{
    this.loadVehicles();
    this.searchForm.valueChanges.subscribe((values) => {
      if(!values.start_date && !values.end_date && !values.vehicle_type){
        this.loadVehicles();
      } else {
        this.filterVehicles();
      }
    })
  }
  loadVehicles():void{
    this.vehicleService.getVehicles().subscribe({
      next: (vehicles) => (this.vehicles = vehicles),
      error: (err) => {
        console.error('Error fetching vehicles: ',err),
        this.vehicles = []
      }
    })
  }

  openBookingModal(vehicle: Vehicle):void{
    if(!this.authService.isAuthenticated()){
      alert('Please log in to rent a vehicle.!!')
      return;
    }
    this.selectedVehicle = vehicle
    this.bookingModalOpened = true
  }

  closeBookingModal(bookingData: any){
    this.bookingModalOpened = false
    this.selectedVehicle = null
    if(bookingData){
      this.bookingService.createBooking(bookingData as any).subscribe({
        next: (response) => {
          alert(`${bookingData.vehicle_name} successfully booked from ${bookingData.start_date} to ${bookingData.end_date}`)
          this.bookingModalOpened = false
          this.selectedVehicle = null
        }, 
        error: (err) => console.error('Error while booking', err)
      })
    }
  }
  
  openVehicleModal(vehicle?: Vehicle): void{
      this.selectedVehicle = vehicle || null
      this.vehicleModalOpened = true
  }

  closeVehicleModal(refresh: boolean){
    this.vehicleModalOpened = false
    this.selectedVehicle = null
    if(refresh){
      this.loadVehicles()
    }
  }
 
  deleteVehicle(vehicle_id: string):void{
    if(confirm('Are you sure you want to delete this vehicle?')){
      this.vehicleService.deleteVehicle(vehicle_id).subscribe({
        next: () => this.loadVehicles(),
        error: (err) => console.error('Error while deleting vehicle: ',err)
      })
    }
  }

  filterVehicles(): void {
    const { start_date, end_date, vehicle_type } = this.searchForm.value;
    const params: { start_date?: string; end_date?: string; vehicle_type?: string } = {};
    if (start_date) params.start_date = start_date;
    if (end_date) params.end_date = end_date;
    if (vehicle_type) params.vehicle_type = vehicle_type;

    this.vehicleService.getAvailableVehicles(params).subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
      },
      error: (err) => {
        console.error('Error filtering vehicles:', err);
        this.vehicles = [];
      },
    });
  }
}
