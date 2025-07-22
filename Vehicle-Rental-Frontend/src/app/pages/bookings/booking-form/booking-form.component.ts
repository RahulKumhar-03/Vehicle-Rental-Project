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

  currentDate: string = new Date().toISOString()

  constructor(private fb: FormBuilder, private authService: AuthService){
    this.bookingForm = this.fb.group({
      start_date: ['', Validators.required], //Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(20)\d{2}$/)]],
      end_date: ['', Validators.required], //Validators.pattern(/^(0[1-9]|[1-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/)]]
    })
  }

  onSubmit(){
    if(this.bookingForm.valid && this.vehicle){
      const startDate = new Date(this.bookingForm.value.start_date!).toISOString();
      const endDate = new Date(this.bookingForm.value.end_date!).toISOString();
       // Normalize to start of day
      
      if (startDate < this.currentDate || endDate < this.currentDate) {
        alert('Booking dates cannot be in the past');
        return;
      }

      const bookingData = {
        vehicle_id: this.vehicle.id!,
        vehicle_name: this.vehicle.model,
        user_id: this.authService.getCurrentUser().id!,
        user_name: this.authService.getCurrentUser().name,
        start_date: startDate,
        end_date: endDate,
      };
      this.close.emit(bookingData)
    }
  }
   closeModal(): void{
    this.close.emit(null)
   }
}
