import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario';
import { UsuarioDto, UsuarioCreateDto, UsuarioUpdateDto } from '../../models/usuario.model';
import { PagedResponse } from '../../models/base-response.model';

@Component({
  selector: 'app-usuarios',
  imports: [FormsModule],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.css', '../../shared/crud-styles.css'],
})
export class Usuarios implements OnInit {
  items: UsuarioDto[] = [];
  pagedData: PagedResponse<UsuarioDto> | null = null;
  pageNumber = 1;
  pageSize = 10;

  showModal = false;
  isEditing = false;
  formData = { userId: 0, fullName: '', email: '', password: '' };
  errorMessage = '';

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void { this.loadData(); }

  loadData(): void {
    this.usuarioService.getPaginated({ pageNumber: this.pageNumber, pageSize: this.pageSize }).subscribe({
      next: (res) => { if (res.isSuccess) { this.pagedData = res.data; this.items = res.data.items; } },
      error: () => this.errorMessage = 'Error al cargar usuarios'
    });
  }

  openCreate(): void {
    this.isEditing = false;
    this.formData = { userId: 0, fullName: '', email: '', password: '' };
    this.errorMessage = '';
    this.showModal = true;
  }

  openEdit(item: UsuarioDto): void {
    this.isEditing = true;
    this.formData = { ...item, password: '' };
    this.errorMessage = '';
    this.showModal = true;
  }

  save(): void {
    this.errorMessage = '';
    if (this.isEditing) {
      const dto: UsuarioUpdateDto = { userId: this.formData.userId, fullName: this.formData.fullName, email: this.formData.email };
      this.usuarioService.update(dto).subscribe({
        next: (res) => { if (res.isSuccess) { this.showModal = false; this.loadData(); } else this.errorMessage = res.message; },
        error: () => this.errorMessage = 'Error al actualizar'
      });
    } else {
      const dto: UsuarioCreateDto = { fullName: this.formData.fullName, email: this.formData.email, password: this.formData.password };
      this.usuarioService.create(dto).subscribe({
        next: (res) => { if (res.isSuccess) { this.showModal = false; this.loadData(); } else this.errorMessage = res.message; },
        error: () => this.errorMessage = 'Error al crear'
      });
    }
  }

  deleteItem(id: number): void {
    if (!confirm('¿Está seguro de eliminar este usuario?')) return;
    this.usuarioService.delete(id).subscribe({
      next: (res) => { if (res.isSuccess) this.loadData(); },
      error: () => this.errorMessage = 'Error al eliminar'
    });
  }

  prevPage(): void { if (this.pagedData?.hasPreviousPage) { this.pageNumber--; this.loadData(); } }
  nextPage(): void { if (this.pagedData?.hasNextPage) { this.pageNumber++; this.loadData(); } }
}
