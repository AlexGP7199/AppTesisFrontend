import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CuentaService } from '../../services/cuenta';
import { UsuarioService } from '../../services/usuario';
import { CuentaUpdateDto } from '../../models/cuenta.model';
import { UsuarioDto } from '../../models/usuario.model';

@Component({
  selector: 'app-cuenta-edit',
  imports: [FormsModule, RouterLink],
  templateUrl: './cuenta-edit.html',
  styleUrls: ['../../shared/entity-edit.css', '../../shared/crud-styles.css'],
})
export class CuentaEdit implements OnInit {
  accountId = 0;
  usuarios: UsuarioDto[] = [];
  formData: CuentaUpdateDto = { accountId: 0, userId: 0, accountName: '', currency: 'USD' };
  errorMessage = '';
  successMessage = '';
  isLoading = true;
  isSaving = false;

  constructor(
    private cuentaService: CuentaService,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsuarios();

    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));

      if (!Number.isInteger(id) || id <= 0) {
        this.isLoading = false;
        this.errorMessage = 'El ID de la cuenta no es válido.';
        return;
      }

      this.accountId = id;
      this.loadAccount(id);
    });
  }

  loadUsuarios(): void {
    this.usuarioService.getAll().subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.usuarios = res.data;
        }
      }
    });
  }

  loadAccount(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.cuentaService.getById(id).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.isSuccess) {
          this.formData = {
            accountId: res.data.accountId,
            userId: res.data.userId,
            accountName: res.data.accountName,
            currency: res.data.currency,
          };
        } else {
          this.errorMessage = res.message;
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Error al cargar la cuenta';
      }
    });
  }

  save(): void {
    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.cuentaService.update(this.formData).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res.isSuccess) {
          this.successMessage = 'Cuenta actualizada correctamente';
          this.formData = { ...this.formData, ...res.data };
        } else {
          this.errorMessage = res.message;
        }
      },
      error: () => {
        this.isSaving = false;
        this.errorMessage = 'Error al actualizar la cuenta';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/cuentas']);
  }
}
