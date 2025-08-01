import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Maintenance, Vehicle } from 'src/Schemas/interfaces';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { MaintenanceService } from 'src/app/services/maintenance/maintenance.service';

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

  constructor(private fb: FormBuilder, private maintenanceService: MaintenanceService){
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
      /* const maintenanceData = {
        vehicle_id: this.maintenance?.vehicle_id,
        vehicle_name: this.maintenance?.vehicle_name,
        description: this.maintenanceForm.value.description,
        maintenance_date: this.maintenanceForm.value.maintenance_date
      } */
        const updatedData = {
          vehicle_id: this.maintenance?.vehicle_id,
          vehicle_name: this.maintenance?.vehicle_name,
          maintenance_date: this.maintenanceForm.value.maintenance_date,
        }
        this.close.emit(updatedData);
        /*else {
        this.maintenanceService.createMaintenance(maintenanceData).subscribe({
          next: () => {
            alert('Maintenance Record Created Successfully')
            this.close.emit(true)
          },
          error: (err) => console.error('Error while creating maintenance record: ', err)
        })
      } */
    }
  }
  closeModal(): void{
    this.close.emit(null)
  }
}
