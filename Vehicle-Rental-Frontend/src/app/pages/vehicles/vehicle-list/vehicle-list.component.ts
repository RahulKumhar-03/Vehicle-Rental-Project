import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Maintenance, Vehicle, CarType } from 'src/Schemas/interfaces';
import { VehicleService } from 'src/app/services/vehicle/vehicle.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { VehicleFormComponent } from '../vehicle-form/vehicle-form.component';
import { BookingFormComponent } from '../../bookings/booking-form/booking-form.component';
import { BookingService } from 'src/app/services/booking/booking.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CreateMaintenanceModalComponent } from '../../maintenance/create-maintenance-modal/create-maintenance-modal.component';
import { Router } from '@angular/router';
import { MatSelectModule} from '@angular/material/select'
import { MatInputModule} from '@angular/material/input'
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MaintenanceService } from 'src/app/services/maintenance/maintenance.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [CommonModule, VehicleFormComponent, BookingFormComponent, MatTableModule, CreateMaintenanceModalComponent, MatSelectModule, MatInputModule, MatNativeDateModule, MatDatepickerModule, FormsModule, MatButtonModule],
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit {

  bookingModalOpened: boolean = false
  vehicleModalOpened: boolean = false
  maintenanceModalOpened: boolean = false

  selectedVehicle: Vehicle | null = null

  vehicles: Vehicle[] = []
  filteredVehicles: Vehicle[] = []

  currentDate: string = new Date().toISOString()

  displayedColumns: string[] = ['vehicle_name','license_plate', 'rental_rate','range', 'location', 'type', 'action'];
  dataSource = new MatTableDataSource<Vehicle>();

  startDate: string = ''
  endDate: string = ''
  selectedType: string = 'None'

  carTypes: CarType[] = [
    {value:'None', viewValue:'Select Car Type'},
    {value: 'Sports', viewValue: 'Sports'},
    {value: 'Sedan', viewValue: 'Sedan'},
    {value: 'Hatchback', viewValue: 'Hatchback'},
    {value: 'SUV', viewValue: 'SUV'},
    {value: 'Off-roader', viewValue: 'Off-Roader'},
    {value: 'Coupe', viewValue: 'Coupe'},
  ]

  constructor( 
    public vehicleService: VehicleService,
    public authService: AuthService,
    public bookingService: BookingService,
    public maintenanceService: MaintenanceService,
    private router: Router
  ){}

  ngOnInit():void{
    this.loadVehicles();
  }

  loadVehicles():void{
    this.vehicleService.getVehicles().subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles
        this.dataSource.data = this.vehicles
      },
      error: (err) => {
        console.error('Error fetching vehicles: ',err),
        this.vehicles = []
      }
    })
  }
  
  filterByType():void{
    if(this.selectedType){
      this.filteredVehicles = this.vehicles.filter(vehicle => this.selectedType.toLowerCase() === vehicle.type.toLowerCase())
    }
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

  openCreateMaintenanceModal(vehicle: Vehicle){
    if(!this.authService.isAuthenticated()){
      alert('Admin must be logged in!!')
      return;
    }
    this.selectedVehicle = vehicle
    this.maintenanceModalOpened = true
  }

  closeCreateMaintenanceModal(maintenanceData: Maintenance){
    if(maintenanceData){
      this.maintenanceService.createMaintenance(maintenanceData).subscribe({
        next: (response) => {
          alert(`${maintenanceData.vehicle_name} maintenance scheduled on ${maintenanceData.maintenance_date}.`)
          this.maintenanceModalOpened = false
          this.selectedVehicle = null
          this.router.navigate(['/maintenance-list'])
        }, 
        error: (err) => console.error('Error while booking', err)
      })
    }
    else {
      this.maintenanceModalOpened = false
    }
  }
  applyCombinedSearch(){
    const start_date = new Date(this.startDate).toISOString();
    const end_date = new Date(this.endDate).toISOString();
    console.log(`Start Date: ${start_date}, End Date: ${end_date}, Selected Type: ${this.selectedType}`);
    if(start_date >= end_date){
      alert('Start date must be before end date.');
      return;
    }
    
    if(start_date && end_date){
      this.vehicleService.availableVehicles(start_date, end_date, this.selectedType).subscribe({
        next: (vehicles) => {
          console.log(vehicles);
          this.filteredVehicles = vehicles;
        },
        error: (err) => {
          alert('No vehicles available for the selected dates and type!! Please try again');
          console.error('Error fetching available vehicles: ', err);
          window.location.reload()
        }
      })
    }
  }
}

