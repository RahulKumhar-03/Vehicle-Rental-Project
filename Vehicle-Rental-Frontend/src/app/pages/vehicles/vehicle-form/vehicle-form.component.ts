import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleService } from 'src/app/services/vehicle/vehicle.service';
import { Vehicle } from 'src/Schemas/interfaces';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent {
  @Input() vehicle!: Vehicle | null;
  @Output() close = new EventEmitter<boolean>()

  currentDate: string = new Date().toISOString().split('T')[0]
  vehicleForm: FormGroup;
  isEditMode: boolean = false

  constructor(private vehicleService: VehicleService, private fb: FormBuilder,public authService: AuthService){
    this.vehicleForm = this.fb.group({
      model: [{value: '', disabled: false}, [Validators.required, Validators.maxLength(100)]],
      type: [{value: '', disabled: false}, [Validators.required, Validators.maxLength(20)]],
      rental_rate: [0,[ Validators.required, Validators.min(5000)]],
      imageUrl: [''],
      license_plate_no: [{value: '', disabled: false},[Validators.required, Validators.maxLength(20)]],
      gearType: [{value: '', disabled: false}, Validators.required],
      description: [''],
      range: ['', Validators.required],
      location:['', [Validators.required, Validators.maxLength(100)]],
      next_maintenance:['']
    })
  }
  ngOnInit(): void{
    if(this.vehicle){
      this.isEditMode = true
      this.vehicleForm.patchValue({
        model: this.vehicle.model,
        license_plate_no: this.vehicle.license_plate_no,
        type: this.vehicle.type,
        location: this.vehicle.location,
        rental_rate: this.vehicle.rental_rate,
        description: this.vehicle.description || '',
        imageUrl: this.vehicle.imageUrl || '',
        range: this.vehicle.range || '',
        gearType: this.vehicle.gearType || '',
      })
      this.vehicleForm.get('model')?.disable()
      this.vehicleForm.get('type')?.disable()
      this.vehicleForm.get('license_plate_no')?.disable()
      this.vehicleForm.get('gearType')?.disable()
    } else {
      this.vehicleForm.get('model')?.enable()
      this.vehicleForm.get('type')?.enable()
      this.vehicleForm.get('license_plate_no')?.enable()
      this.vehicleForm.get('gearType')?.enable()
    }
  }

  onSubmit(){
    if(this.vehicleForm.valid){
      const vehicleData = {
        model: this.vehicleForm.value.model,
        type: this.vehicleForm.value.type,
        license_plate_no: this.vehicleForm.value.license_plate_no,
        rental_rate: this.vehicleForm.value.rental_rate,
        imageUrl: this.vehicleForm.value.imageUrl,
        gearType: this.vehicleForm.value.gearType,
        description: this.vehicleForm.value.description,
        range: this.vehicleForm.value.range,
        location: this.vehicleForm.value.location,
        status: this.vehicleForm.value.status
      }
      if(this.isEditMode && this.vehicle?.id){
        const updateData = {
          model: this.vehicle.model!,
          type: this.vehicle.type!,
          license_plate_no: this.vehicleForm.value.license_plate_no,
          rental_rate: this.vehicleForm.value.rental_rate,
          imageUrl: this.vehicleForm.value.imageUrl || null,
          gearType: this.vehicleForm.value.gearType || null,
          description: this.vehicleForm.value.description || null,
          range: this.vehicleForm.value.range || null,
          location: this.vehicleForm.value.location,
        }
        this.vehicleService.updateVehicle(this.vehicle.id, updateData).subscribe({
          next: () => {
            alert('Vehicle Details Updated Successfully');
            this.isEditMode = false
            this.close.emit(true)
          },
          error: (err) => console.error('Error while updating vehicle details: ',err)
        })
      } else {
        this.vehicleService.createVehicle(vehicleData).subscribe({
          next: () => {
            alert(`${this.vehicleForm.value.model} created successfully!`);
            this.close.emit(true)
          },
          error: (err) => console.error('Error while creating new vehicle: ',err)
        })
      }
    }
  }
  closeModal(): void{
    this.close.emit(false)
  }
}
