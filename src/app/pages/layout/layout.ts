import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  userName = '';

  constructor(private authService: AuthService) {
    const user = this.authService.getUser();
    this.userName = user?.fullName || '';
  }

  onLogout(): void {
    this.authService.logout();
  }
}
