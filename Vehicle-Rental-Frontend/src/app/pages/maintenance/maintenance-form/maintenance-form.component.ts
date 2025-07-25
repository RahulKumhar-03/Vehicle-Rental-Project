import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Maintenance } from 'src/Schemas/interfaces';
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
  @Output() close = new EventEmitter<boolean>()
  isEditMode: boolean = false
  currentDate = new Date().toISOString().split('T')[0]

  maintenanceForm: FormGroup;

  constructor(private fb: FormBuilder, private maintenanceService: MaintenanceService){
    this.maintenanceForm = this.fb.group({
      vehicle_id: [{value: '', disabled: false}, [Validators.required, Validators.maxLength(100)]],
      vehicle_name: [{value: '', disabled: false}, [Validators.required, Validators.maxLength(100)]],
      maintenance_date: ['', Validators.required],
      description:['', [Validators.required, Validators.maxLength(100)]]
    })
  }

  ngOnInit():void{
    if(this.maintenance){
      this.isEditMode = true
      this.maintenanceForm.patchValue({
        vehicle_id: this.maintenance.vehicle_id,
        vehicle_name: this.maintenance.vehicle_name,
        maintenance_date: this.maintenance.maintenance_date,
      })
      this.maintenanceForm.get('vehicle_id')?.disable()
      this.maintenanceForm.get('vehicle_name')?.disable()
    } else {
      this.maintenanceForm.get('vehicle_id')?.enable()
      this.maintenanceForm.get('vehicle_name')?.enable()
    }
  }

  onSubmit(){
    if(this.maintenanceForm.valid){
      const maintenanceData = {
        vehicle_id: this.maintenanceForm.value.vehicle_id,
        vehicle_name: this.maintenanceForm.value.vehicle_name,
        description: this.maintenanceForm.value.description,
        maintenance_date: this.maintenanceForm.value.maintenance_date
      }
      if(this.maintenance?.id && this.isEditMode){
        const updatedData = {
          vehicle_id: this.maintenance.vehicle_id,
          vehicle_name: this.maintenance.vehicle_name,
          maintenance_date: this.maintenanceForm.value.maintenance_date,
          description: this.maintenanceForm.value.description
        }
        this.maintenanceService.updateMaintenance(this.maintenance.id, updatedData).subscribe({
          next: () => {
            alert('Maintenance Details Updated Successfully')
            this.isEditMode = false
            this.close.emit(true)
          },
          error: (err) => {
            console.error('Error while updating the maintenance details: ',err)
          }
        })
      } else {
        this.maintenanceService.createMaintenance(maintenanceData).subscribe({
          next: () => {
            alert('Maintenance Record Created Successfully')
            this.close.emit(true)
          },
          error: (err) => console.error('Error while creating maintenance record: ', err)
        })
      }
    }
  }
  closeModal(): void{
    this.close.emit(false)
  }
}
