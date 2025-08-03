import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent {
  @Output() closeModal = new EventEmitter<void>()

  message = '';
  messageType: 'success' | 'error' | '' = '';

  activeTab: 'login' | 'register' = 'login'

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private userService: UserService){}

  form = this.fb.group({
    name: [''],
    address: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  })

  onSubmit(){
    if(this.form.valid){
      const email = this.form.value.email!
      const password = this.form.value.password!
      if(this.activeTab === 'login'){
        this.authService.login(email,password).subscribe({
          next: (response) => {
            if(response.access_token){
              this.showMessage('Login Successful!', 'success')
              setTimeout(() => this.closeModal.emit(),1000);
            } else {
              this.showMessage('Invalid Login Response', 'error');
            }
            this.router.navigate(['/home'])
          },
          error: (err) =>{
            console.error('Login Failed', err)
          }
        })
      } 
      else{
        const registerData = {
          name: this.form.value.name!,
          email: this.form.value.email!,
          address: this.form.value.address!,
          password: this.form.value.password!,
        };

        this.userService.register(registerData).subscribe({
          next: (res: any) => {
            this.authService.autoLogin(res.user, res.access_token);
            this.closeModal.emit()
            this.router.navigate(['/home'])
          },
          error: (err) => {
            console.error('Registration Failed', err)
          }
        })
      }
    }
  }

  showMessage(msg: string, messageType: 'success' | 'error'){
    this.message = msg;
    this.messageType = messageType;
    setTimeout(() => {
      this.message = '';
      this.messageType = '';
    },3000)
  }
}
