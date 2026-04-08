import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CuentaService } from '../../services/cuenta';
import { UsuarioService } from '../../services/usuario';
import { CuentaDto, CuentaCreateDto, CuentaUpdateDto } from '../../models/cuenta.model';
import { UsuarioDto } from '../../models/usuario.model';
import { PagedResponse } from '../../models/base-response.model';
import { readPaginationFromRoute } from '../../shared/route-pagination';

@Component({
  selector: 'app-cuentas',
  imports: [FormsModule],
  templateUrl: './cuentas.html',
  styleUrls: ['./cuentas.css', '../../shared/crud-styles.css'],
})
export class Cuentas implements OnInit {
  items: CuentaDto[] = [];
  usuarios: UsuarioDto[] = [];
  pagedData: PagedResponse<CuentaDto> | null = null;
  pageNumber = 1;
  pageSize = 10;
  isDescending = false;

  showModal = false;
  isEditing = false;
  formData = { accountId: 0, userId: 0, accountName: '', currency: 'USD' };
  errorMessage = '';

  constructor(
    private cuentaService: CuentaService,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const pagination = readPaginationFromRoute(params, {
        pageNumber: 1,
        pageSize: 10,
        isDescending: false,
      });

      this.pageNumber = pagination.pageNumber;
      this.pageSize = pagination.pageSize;
      this.isDescending = pagination.isDescending;
      this.loadData();
    });

    this.loadUsuarios();
  }

  loadData(): void {
    this.cuentaService.getPaginated({
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      isDescending: this.isDescending,
    }).subscribe({
      next: (res) => { if (res.isSuccess) { this.pagedData = res.data; this.items = res.data.items; } },
      error: () => this.errorMessage = 'Error al cargar cuentas'
    });
  }

  loadUsuarios(): void {
    this.usuarioService.getAll().subscribe({
      next: (res) => { if (res.isSuccess) this.usuarios = res.data; }
    });
  }

  openCreate(): void {
    this.isEditing = false;
    this.formData = { accountId: 0, userId: 0, accountName: '', currency: 'USD' };
    this.errorMessage = '';
    this.showModal = true;
  }

  openEdit(item: CuentaDto): void {
    this.router.navigate(['/cuentas', item.accountId, 'editar']);
  }

  save(): void {
    this.errorMessage = '';
    if (this.isEditing) {
      const dto: CuentaUpdateDto = { ...this.formData };
      this.cuentaService.update(dto).subscribe({
        next: (res) => { if (res.isSuccess) { this.showModal = false; this.loadData(); } else this.errorMessage = res.message; },
        error: () => this.errorMessage = 'Error al actualizar'
      });
    } else {
      const dto: CuentaCreateDto = { userId: this.formData.userId, accountName: this.formData.accountName, currency: this.formData.currency };
      this.cuentaService.create(dto).subscribe({
        next: (res) => { if (res.isSuccess) { this.showModal = false; this.loadData(); } else this.errorMessage = res.message; },
        error: () => this.errorMessage = 'Error al crear'
      });
    }
  }

  deleteItem(id: number): void {
    if (!confirm('¿Está seguro de eliminar esta cuenta?')) return;
    this.cuentaService.delete(id).subscribe({
      next: (res) => { if (res.isSuccess) this.loadData(); },
      error: () => this.errorMessage = 'Error al eliminar'
    });
  }

  prevPage(): void { if (this.pagedData?.hasPreviousPage) { this.pageNumber--; this.loadData(); } }
  nextPage(): void { if (this.pagedData?.hasNextPage) { this.pageNumber++; this.loadData(); } }
}
