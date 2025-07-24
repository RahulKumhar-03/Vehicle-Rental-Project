import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Maintenance} from 'src/Schemas/interfaces';
import { MaintenanceService } from 'src/app/services/maintenance/maintenance.service';
import { MaintenanceFormComponent } from '../maintenance-form/maintenance-form.component';

@Component({
  selector: 'app-maintenance-list',
  standalone: true,
  imports: [CommonModule, MaintenanceFormComponent],
  templateUrl: './maintenance-list.component.html',
  styleUrls: ['./maintenance-list.component.css']
})
export class MaintenanceListComponent implements OnInit {
  maintenances: Maintenance[] = []
  isLoading: boolean = false
  maintenanceModalOpened: boolean = false
  selectedMaintenance: Maintenance | null = null

  constructor(private maintenanceService: MaintenanceService){}

  ngOnInit(): void {
    this.loadMaintenances()
  }

  loadMaintenances(): void{
    this.isLoading = true
    this.maintenanceService.getAllMaintenance().subscribe({
      next: (response: Maintenance[]) => {
        this.maintenances = response
        this.isLoading = false
      }, 
      error: (err) => {
        console.error('Error while fetching all maintenances of the vehicles: ',err)
        this.maintenances = []
      }
    })
  }
  
  openMaintenanceModal(maintenance?: Maintenance){
    this.selectedMaintenance = maintenance || null
    this.maintenanceModalOpened = true
  }

  closeMaintenanceModal(refresh: boolean){
    this.maintenanceModalOpened = false
    this.selectedMaintenance = null
    if(refresh){
      this.loadMaintenances();
    }
  }

  deleteMaintenance(maintenanceId: string):void{
      this.maintenanceService.deleteMaintenance(maintenanceId).subscribe({
        next: () => this.loadMaintenances(),
        error: (err) => console.error('Error while deleting maintenance!',err)
      })
    }
}
