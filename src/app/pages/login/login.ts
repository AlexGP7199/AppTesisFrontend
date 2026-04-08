import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.errorMessage = '';
    this.loading = true;

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.isSuccess) {
          this.router.navigate(['/home']);
        } else {
          this.errorMessage = res.message || 'Credenciales incorrectas';
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Error al conectar con el servidor';
      }
    });
  }
}
