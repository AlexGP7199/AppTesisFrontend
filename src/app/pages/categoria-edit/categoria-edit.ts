import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoriaService } from '../../services/categoria';
import { CategoriaUpdateDto } from '../../models/categoria.model';

@Component({
  selector: 'app-categoria-edit',
  imports: [FormsModule, RouterLink],
  templateUrl: './categoria-edit.html',
  styleUrls: ['../../shared/entity-edit.css', '../../shared/crud-styles.css'],
})
export class CategoriaEdit implements OnInit {
  categoryId = 0;
  formData: CategoriaUpdateDto = { categoryId: 0, name: '', operationType: 'Egreso' };
  errorMessage = '';
  successMessage = '';
  isLoading = true;
  isSaving = false;

  constructor(
    private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));

      if (!Number.isInteger(id) || id <= 0) {
        this.isLoading = false;
        this.errorMessage = 'El ID de la categoría no es válido.';
        return;
      }

      this.categoryId = id;
      this.loadCategory(id);
    });
  }

  loadCategory(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.categoriaService.getById(id).subscribe({
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
        this.errorMessage = 'Error al cargar la categoría';
      }
    });
  }

  save(): void {
    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.categoriaService.update(this.formData).subscribe({
      next: (res) => {
        this.isSaving = false;

        if (res.isSuccess) {
          this.successMessage = 'Categoría actualizada correctamente';
          this.formData = { ...res.data };
        } else {
          this.errorMessage = res.message;
        }
      },
      error: () => {
        this.isSaving = false;
        this.errorMessage = 'Error al actualizar la categoría';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/categorias']);
  }
}
