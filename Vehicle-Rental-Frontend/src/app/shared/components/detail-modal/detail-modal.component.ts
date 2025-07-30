import { Component, Inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog'
@Component({
  selector: 'app-detail-modal',
  standalone: true,
  imports: [CommonModule, DetailModalComponent, MatButtonModule, MatDialogModule],
  templateUrl: './detail-modal.component.html',
  styleUrls: ['./detail-modal.component.css']
})
export class DetailModalComponent {

  constructor(public dialogRef: MatDialogRef<DetailModalComponent>, @Inject(MAT_DIALOG_DATA) public data:{item: any, itemType: string}){}

  onClose():void{
    this.dialogRef.close()
  }

  getObjectKeys(object: any): string[]{
    return object ? Object.keys(object) : [];
  }
}
