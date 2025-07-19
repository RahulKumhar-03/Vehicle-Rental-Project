import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginRegisterComponent } from '../login-register/login-register.component';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule,RouterModule, LoginRegisterComponent],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  modalOpened: boolean = false
  isLoggedIn: boolean = false

  constructor(private authService: AuthService){
    this.authService.loggedInStatus.subscribe((status)=>{
      this.isLoggedIn = status
    })
  }

  logout(){
    this.authService.logout();
  }
}
