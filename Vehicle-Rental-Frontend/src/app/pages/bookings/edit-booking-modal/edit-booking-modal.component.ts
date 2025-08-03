import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Booking, Vehicle} from 'src/Schemas/interfaces'
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-edit-booking-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-booking-modal.component.html',
  styleUrls: ['./edit-booking-modal.component.css']
})
export class EditBookingModalComponent {
  @Input() booking!: Booking; 
  @Input() vehicle!: Vehicle; 
  @Output() close = new EventEmitter<any>();

  editForm: FormGroup;
  currentDate: string = new Date().toISOString().split('T')[0];

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.editForm = this.fb.group({
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.booking) {
      const startDate = new Date(this.booking.start_date);
      const endDate = new Date(this.booking.end_date);
      
      const localStartDate = startDate.toLocaleDateString('en-CA'); 
      const localEndDate = endDate.toLocaleDateString('en-CA');

      this.editForm.patchValue({
        start_date: localStartDate,
        end_date: localEndDate,
      });
    }
  }

  onSubmit() {
    if (this.editForm.valid) {
      const startDateValue = this.editForm.value.start_date;
      const endDateValue = this.editForm.value.end_date;

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

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate < today || endDate < today) {
        alert('Booking dates cannot be in the past');
        return;
      }

      const bookingData = {
        vehicle_id: this.vehicle.id!,
        vehicle_name: this.vehicle.model,
        user_id: this.authService.getCurrentUser().id,
        user_name: this.authService.getCurrentUser().name,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      };
      this.close.emit(bookingData);
    }
  }

  closeModal(): void {
    this.close.emit(null);
  }
}
