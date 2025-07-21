import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleService } from 'src/app/services/vehicle/vehicle.service';
import { Router } from '@angular/router';
import { Vehicle } from 'src/Schemas/interfaces';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent {
  @Input() vehicle: Vehicle | null = null;
  @Output() close = new EventEmitter<boolean>()
  
  selectedFile: File | null = null;

  constructor(private vehicleService: VehicleService, private router: Router){}

  /*onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        vehicle.imageUrl = reader.result as string; // Base64 string
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  createVehicle(){
    this.vehicleService.createVehicle(vehicle).subscribe({
      next: () => setTimeout(() => this.close.emit(),1500),
      error: (err) => console.error('Error while creating vehicle!!! : ', err)
    })
  } */
}
