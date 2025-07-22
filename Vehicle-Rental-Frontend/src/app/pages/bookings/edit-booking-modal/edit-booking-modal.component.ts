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
  @Input() booking!: Booking; // Required booking data
  @Input() vehicle!: Vehicle; // Required vehicle data
  @Output() close = new EventEmitter<any>();

  editForm: FormGroup;
  currentDate: string = new Date().toISOString().split('T')[0]; // Normalize to date string

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.editForm = this.fb.group({
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.booking) {
      const startDate = new Date(this.booking.start_date).toISOString().split('T')[0];
      const endDate = new Date(this.booking.end_date).toISOString().split('T')[0];
      this.editForm.patchValue({
        start_date: startDate,
        end_date: endDate,
      });
    }
  }

  onSubmit() {
    if (this.editForm.valid) {
      const startDate = new Date(this.editForm.value.start_date).toISOString();
      const endDate = new Date(this.editForm.value.end_date).toISOString();

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
      this.close.emit(bookingData);
    }
  }

  closeModal(): void {
    this.close.emit(null);
  }
}
