import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TransaccionService } from '../../services/transaccion';
import { CuentaService } from '../../services/cuenta';
import { CategoriaService } from '../../services/categoria';
import { ContactService } from '../../services/contact';
import { TransaccionUpdateDto } from '../../models/transaccion.model';
import { CuentaDto } from '../../models/cuenta.model';
import { CategoriaDto } from '../../models/categoria.model';
import { ContactDto } from '../../models/contact.model';

@Component({
  selector: 'app-transaccion-edit',
  imports: [FormsModule, RouterLink],
  templateUrl: './transaccion-edit.html',
  styleUrls: ['../../shared/entity-edit.css', '../../shared/crud-styles.css'],
})
export class TransaccionEdit implements OnInit {
  transaccionId = 0;
  cuentas: CuentaDto[] = [];
  categorias: CategoriaDto[] = [];
  contactos: ContactDto[] = [];
  formData: TransaccionUpdateDto = {
    transaccionId: 0,
    accountId: 0,
    categoryId: 0,
    contactsId: null,
    monto: 0,
    moneda: 'USD',
    descripcion: '',
    fecha: '',
  };
  errorMessage = '';
  successMessage = '';
  isLoading = true;
  isSaving = false;

  constructor(
    private transaccionService: TransaccionService,
    private cuentaService: CuentaService,
    private categoriaService: CategoriaService,
    private contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRelatedData();

    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));

      if (!Number.isInteger(id) || id <= 0) {
        this.isLoading = false;
        this.errorMessage = 'El ID de la transacción no es válido.';
        return;
      }

      this.transaccionId = id;
      this.loadTransaction(id);
    });
  }

  loadRelatedData(): void {
    this.cuentaService.getPaginated({ pageNumber: 1, pageSize: 100 }).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.cuentas = res.data.items;
        }
      }
    });

    this.categoriaService.getAll().subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.categorias = res.data;
        }
      }
    });

    this.contactService.getPaginated({ pageNumber: 1, pageSize: 100 }).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.contactos = res.data.items;
        }
      }
    });
  }

  loadTransaction(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.transaccionService.getById(id).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.isSuccess) {
          this.formData = {
            transaccionId: res.data.transaccionId,
            accountId: res.data.accountId,
            categoryId: res.data.categoryId,
            contactsId: res.data.contactsId,
            monto: res.data.monto,
            moneda: res.data.moneda,
            descripcion: res.data.descripcion,
            fecha: res.data.fecha ? res.data.fecha.slice(0, 16) : '',
          };
        } else {
          this.errorMessage = res.message;
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Error al cargar la transacción';
      }
    });
  }

  save(): void {
    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const dto: TransaccionUpdateDto = {
      ...this.formData,
      contactsId: this.formData.contactsId || null,
    };

    this.transaccionService.update(dto).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res.isSuccess) {
          this.successMessage = 'Transacción actualizada correctamente';
          this.formData = {
            transaccionId: res.data.transaccionId,
            accountId: res.data.accountId,
            categoryId: res.data.categoryId,
            contactsId: res.data.contactsId,
            monto: res.data.monto,
            moneda: res.data.moneda,
            descripcion: res.data.descripcion,
            fecha: res.data.fecha ? res.data.fecha.slice(0, 16) : '',
          };
        } else {
          this.errorMessage = res.message;
        }
      },
      error: () => {
        this.isSaving = false;
        this.errorMessage = 'Error al actualizar la transacción';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/transacciones']);
  }
}
