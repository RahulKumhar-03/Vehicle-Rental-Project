import { Component,Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vehicle } from 'src/Schemas/interfaces';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent {
  @Input() vehicle!: Vehicle;
  @Output() close = new EventEmitter<any>()
  
  bookingForm: FormGroup;

  currentDate: string = new Date().toISOString().split('T')[0]

  constructor(private fb: FormBuilder, private authService: AuthService){
    this.bookingForm = this.fb.group({
      start_date: ['', Validators.required], 
      end_date: ['', Validators.required], 
    })
  }

  onSubmit(){
    if(this.bookingForm.valid && this.vehicle){
      const startDateValue = this.bookingForm.value.start_date;
      const endDateValue = this.bookingForm.value.end_date;

      if (!startDateValue || !endDateValue) {
        console.error('Start or end date is missing');
        return;
      }
      
      const startDate = new Date(startDateValue);
      const endDate = new Date(endDateValue);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.error('Invalid date values', { startDateValue, endDateValue });
        return;
      }

      const today = new Date()
      today.setHours(0, 0, 0, 0);
      if (startDate < today || endDate < today) {
        alert('Booking dates cannot be in the past');
        return;
      }

      const utcStartDate = new Date(startDateValue + 'T00:00:00Z')
      const utcEndDate = new Date(endDateValue + 'T00:00:00Z')

      const bookingData = {
        vehicle_id: this.vehicle.id!,
        vehicle_name: this.vehicle.model,
        user_id: this.authService.getCurrentUser().id!,
        user_name: this.authService.getCurrentUser().name,
        start_date: utcStartDate,
        end_date: utcEndDate,
      };
      this.close.emit(bookingData)
    }
  }
   closeModal(): void{
    this.close.emit(null)
   }
}
