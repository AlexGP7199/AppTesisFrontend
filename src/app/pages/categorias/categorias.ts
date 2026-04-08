import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../services/categoria';
import { CategoriaDto, CategoriaCreateDto, CategoriaUpdateDto } from '../../models/categoria.model';
import { PagedResponse } from '../../models/base-response.model';

@Component({
  selector: 'app-categorias',
  imports: [FormsModule],
  templateUrl: './categorias.html',
  styleUrls: ['./categorias.css', '../../shared/crud-styles.css'],
})
export class Categorias implements OnInit {
  items: CategoriaDto[] = [];
  pagedData: PagedResponse<CategoriaDto> | null = null;
  pageNumber = 1;
  pageSize = 10;

  showModal = false;
  isEditing = false;
  formData = { categoryId: 0, name: '', operationType: 'Egreso' };
  errorMessage = '';

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.categoriaService.getPaginated({ pageNumber: this.pageNumber, pageSize: this.pageSize }).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.pagedData = res.data;
          this.items = res.data.items;
        }
      },
      error: () => this.errorMessage = 'Error al cargar categorías'
    });
  }

  openCreate(): void {
    this.isEditing = false;
    this.formData = { categoryId: 0, name: '', operationType: 'Egreso' };
    this.errorMessage = '';
    this.showModal = true;
  }

  openEdit(item: CategoriaDto): void {
    this.isEditing = true;
    this.formData = { ...item };
    this.errorMessage = '';
    this.showModal = true;
  }

  save(): void {
    this.errorMessage = '';
    if (this.isEditing) {
      const dto: CategoriaUpdateDto = { ...this.formData };
      this.categoriaService.update(dto).subscribe({
        next: (res) => { if (res.isSuccess) { this.showModal = false; this.loadData(); } else this.errorMessage = res.message; },
        error: () => this.errorMessage = 'Error al actualizar'
      });
    } else {
      const dto: CategoriaCreateDto = { name: this.formData.name, operationType: this.formData.operationType };
      this.categoriaService.create(dto).subscribe({
        next: (res) => { if (res.isSuccess) { this.showModal = false; this.loadData(); } else this.errorMessage = res.message; },
        error: () => this.errorMessage = 'Error al crear'
      });
    }
  }

  deleteItem(id: number): void {
    if (!confirm('¿Está seguro de eliminar esta categoría?')) return;
    this.categoriaService.delete(id).subscribe({
      next: (res) => { if (res.isSuccess) this.loadData(); },
      error: () => this.errorMessage = 'Error al eliminar'
    });
  }

  prevPage(): void { if (this.pagedData?.hasPreviousPage) { this.pageNumber--; this.loadData(); } }
  nextPage(): void { if (this.pagedData?.hasNextPage) { this.pageNumber++; this.loadData(); } }
}
