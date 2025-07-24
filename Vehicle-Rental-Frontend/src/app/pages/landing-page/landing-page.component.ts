import { Component} from '@angular/core';
import { CommonModule} from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  cardVehicles = [
        { name: 'Mercedes-AMG A 45 S', price: '40000', image: 'assets/images/AMG-A45.png', bodyType: 'Hatchback', range: 2000 },
        { name: 'BMW M5', price: '50000', image: 'assets/images/BMW-M5.png', bodyType: 'Sedan', range:2200 },
        { name: 'Audi R8', price: '30000', image: 'assets/images/Audi-R8.png', bodyType: 'Sports', range: 1500 }
    ];
}
