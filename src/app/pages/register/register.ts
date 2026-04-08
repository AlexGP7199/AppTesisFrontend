import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(): void {
    this.errorMessage = '';

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.loading = true;

    this.authService.register({
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword
    }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.isSuccess) {
          this.router.navigate(['/home']);
        } else {
          this.errorMessage = res.message || 'Error al registrarse';
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Error al conectar con el servidor';
      }
    });
  }
}
