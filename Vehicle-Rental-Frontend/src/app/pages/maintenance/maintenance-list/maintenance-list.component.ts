import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Maintenance} from 'src/Schemas/interfaces';
import { MaintenanceService } from 'src/app/services/maintenance/maintenance.service';
import { MaintenanceFormComponent } from '../maintenance-form/maintenance-form.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DetailModalComponent } from 'src/app/shared/components/detail-modal/detail-modal.component';

@Component({
  selector: 'app-maintenance-list',
  standalone: true,
  imports: [CommonModule, MaintenanceFormComponent, MatTableModule, MatDialogModule, DetailModalComponent],
  templateUrl: './maintenance-list.component.html',
  styleUrls: ['./maintenance-list.component.css']
})
export class MaintenanceListComponent implements OnInit {
  maintenances: Maintenance[] = []
  isLoading: boolean = false
  maintenanceModalOpened: boolean = false
  selectedMaintenance: Maintenance | null = null
  displayedColumns: string[] = ['vehicle_name','maintenance_date', 'maintenance_status','action'];
  dataSource = new MatTableDataSource<Maintenance>();

  constructor(
    private maintenanceService: MaintenanceService,
    public dialog: MatDialog,
   ){}

  ngOnInit(): void {
    this.loadMaintenances()
  }

  loadMaintenances(): void{
    this.isLoading = true
    this.maintenanceService.getAllMaintenance().subscribe({
      next: (response: Maintenance[]) => {
        this.maintenances = response
        this.dataSource.data = this.maintenances
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

  openMaintenanceDetails(maintenance: Maintenance){
    this.dialog.open(DetailModalComponent, {
      width: '350px',
      data: {item: maintenance, itemType: 'Maintenance'},
      position:{ top:'-450px', left:'400px' },
      panelClass:'custom-dialog'
    })
  }
}
