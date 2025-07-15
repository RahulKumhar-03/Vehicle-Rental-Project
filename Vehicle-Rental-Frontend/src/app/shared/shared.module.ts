import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { SliderComponent } from './components/slider/slider.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NavBarComponent,
    FooterComponent,
    SliderComponent
  ],
  exports: [
    NavBarComponent,
    FooterComponent,
    SliderComponent
  ]
})
export class SharedModule { }
