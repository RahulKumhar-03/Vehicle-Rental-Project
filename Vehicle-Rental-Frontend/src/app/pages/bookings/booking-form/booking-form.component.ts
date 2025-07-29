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
    
      const bookingData = {
        vehicle_id: this.vehicle.id!,
        vehicle_name: this.vehicle.model,
        user_id: this.authService.getCurrentUser().id!,
        user_name: this.authService.getCurrentUser().name,
        start_date: new Date(this.bookingForm.value.start_date).toISOString(),
        end_date: new Date(this.bookingForm.value.end_date).toISOString(),
      };
      this.close.emit(bookingData)
    }
  }
   closeModal(): void{
    this.close.emit(null)
   }
}
