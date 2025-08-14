import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginRegisterComponent } from './components/login-register/login-register.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/user/user.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NavBarComponent,
    FooterComponent,
    LoginRegisterComponent,
    HttpClientModule,
  ],
  exports: [
    NavBarComponent,
    FooterComponent,
    LoginRegisterComponent,
    HttpClientModule,
  ], 
  providers: [
    AuthService, 
    UserService
  ]
})
export class SharedModule { }
