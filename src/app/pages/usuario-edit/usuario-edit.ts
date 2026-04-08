import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../services/usuario';
import { UsuarioUpdateDto } from '../../models/usuario.model';

@Component({
  selector: 'app-usuario-edit',
  imports: [FormsModule, RouterLink],
  templateUrl: './usuario-edit.html',
  styleUrls: ['../../shared/entity-edit.css', '../../shared/crud-styles.css'],
})
export class UsuarioEdit implements OnInit {
  userId = 0;
  formData: UsuarioUpdateDto = { userId: 0, fullName: '', email: '' };
  errorMessage = '';
  successMessage = '';
  isLoading = true;
  isSaving = false;

  constructor(
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));

      if (!Number.isInteger(id) || id <= 0) {
        this.isLoading = false;
        this.errorMessage = 'El ID del usuario no es válido.';
        return;
      }

      this.userId = id;
      this.loadUser(id);
    });
  }

  loadUser(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.usuarioService.getById(id).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.isSuccess) {
          this.formData = { ...res.data };
        } else {
          this.errorMessage = res.message;
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Error al cargar el usuario';
      }
    });
  }

  save(): void {
    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.usuarioService.update(this.formData).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res.isSuccess) {
          this.successMessage = 'Usuario actualizado correctamente';
          this.formData = { ...res.data };
        } else {
          this.errorMessage = res.message;
        }
      },
      error: () => {
        this.isSaving = false;
        this.errorMessage = 'Error al actualizar el usuario';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/usuarios']);
  }
}
