import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vehicle } from 'src/Schemas/interfaces';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-maintenance-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-maintenance-modal.component.html',
  styleUrls: ['./create-maintenance-modal.component.css']
})
export class CreateMaintenanceModalComponent {
  @Input() vehicle!: Vehicle;
  @Output() close = new EventEmitter<any>()
  maintenanceForm: FormGroup;
  currentDate: string = new Date().toISOString().split('T')[0]

  constructor(private fb: FormBuilder){
    this.maintenanceForm = this.fb.group({
      maintenance_date:['',Validators.required]
    })
  }

  onSubmit(){
    if(this.maintenanceForm.valid && this.vehicle){
      const maintenanceData = {
        vehicle_id: this.vehicle.id!,
        vehicle_name: this.vehicle.model,
        maintenance_date: this.maintenanceForm.value.maintenance_date,
      }
      this.close.emit(maintenanceData);
    }
  }
  closeModal():void{
    this.close.emit(null)
  }
}
