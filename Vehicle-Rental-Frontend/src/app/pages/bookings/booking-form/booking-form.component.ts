import { Component,Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vehicle } from 'src/Schemas/interfaces';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

  constructor(private fb: FormBuilder){
    this.bookingForm = this.fb.group({
      startDate: ['', Validators.required], //Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(20)\d{2}$/)]],
      endDate: ['', Validators.required], //Validators.pattern(/^(0[1-9]|[1-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/)]]
    })
  }

  onSubmit(){
    if(this.bookingForm.valid){
      const bookingData = {
        vehicleId: this.vehicle.id,
        ...this.bookingForm.value,
      };
      this.close.emit(bookingData)
    }
  }
   closeModal(): void{
    this.close.emit(null)
   }
}
