import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VehicleService } from 'src/app/services/vehicle/vehicle.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent implements OnInit{
  vehicles: VehicleCard[] = [];
  displayedCards: VehicleCard[] = [];

  constructor(private vehicleService: VehicleService) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.vehicleService.getVehicles().subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles.map((vehicle) => {
          return {
            name: vehicle.model,
            price: vehicle.rental_rate,
            image: vehicle.imageUrl!,
            bodyType: vehicle.type,
            range: vehicle.range!,
          };
        });
        this.updateDailyCards();
      },
      error: (err) => {
        alert('Failed to load vehicles. Please try again later.');
        console.error('Error loading vehicles:', err);
      },
    });
  }
  updateDailyCards() {
    const cardsPerDay = 3;
    const totalSets = Math.ceil(this.vehicles.length / cardsPerDay);
    
    const dayIndex = (new Date().getDate() - 1) % totalSets;

    const startIndex = dayIndex * cardsPerDay;
    
    const endIndex = startIndex + cardsPerDay;
    if (startIndex >= this.vehicles.length) {
      this.displayedCards = this.vehicles.slice(0, cardsPerDay);
      return;
    }
    this.displayedCards = this.vehicles.slice(startIndex, endIndex);
    
  }
}
export interface VehicleCard {
  name: string;
  price: number;
  image: string;
  bodyType: string;
  range: number;
}
