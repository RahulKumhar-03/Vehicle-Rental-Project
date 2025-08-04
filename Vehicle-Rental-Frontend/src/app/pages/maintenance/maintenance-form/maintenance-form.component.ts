import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Maintenance, Vehicle } from 'src/Schemas/interfaces';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-maintenance-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './maintenance-form.component.html',
  styleUrls: ['./maintenance-form.component.css']
})
export class MaintenanceFormComponent {
  @Input() maintenance!: Maintenance | null
  @Output() close = new EventEmitter<any>()
  currentDate = new Date().toISOString().split('T')[0]

  maintenanceForm: FormGroup;

  constructor(private fb: FormBuilder){
    this.maintenanceForm = this.fb.group({
      vehicle_id: ['', Validators.required],
      vehicle_name: ['', Validators.required],
      maintenance_date: ['', Validators.required],
    })
  }

  ngOnInit():void{
    if(this.maintenance){
      this.maintenanceForm.patchValue({
        vehicle_id: this.maintenance.vehicle_id,
        vehicle_name: this.maintenance.vehicle_name,
        maintenance_date: this.maintenance.maintenance_date,
      })
    }
  }

  onSubmit(){
    if(this.maintenanceForm.valid){
      const updatedData = {
        vehicle_id: this.maintenance?.vehicle_id,
        vehicle_name: this.maintenance?.vehicle_name,
        maintenance_date: this.maintenanceForm.value.maintenance_date,
      }
      this.close.emit(updatedData);
    }
  }
  closeModal(): void{
    this.close.emit(null)
  }
}
