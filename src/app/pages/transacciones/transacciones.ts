import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TransaccionService } from '../../services/transaccion';
import { CuentaService } from '../../services/cuenta';
import { CategoriaService } from '../../services/categoria';
import { ContactService } from '../../services/contact';
import { TransaccionDto, TransaccionCreateDto, TransaccionUpdateDto } from '../../models/transaccion.model';
import { CuentaDto } from '../../models/cuenta.model';
import { CategoriaDto } from '../../models/categoria.model';
import { ContactDto } from '../../models/contact.model';
import { PagedResponse } from '../../models/base-response.model';
import { readPaginationFromRoute } from '../../shared/route-pagination';

@Component({
  selector: 'app-transacciones',
  imports: [FormsModule, CurrencyPipe, DatePipe],
  templateUrl: './transacciones.html',
  styleUrls: ['./transacciones.css', '../../shared/crud-styles.css'],
})
export class Transacciones implements OnInit {
  items: TransaccionDto[] = [];
  cuentas: CuentaDto[] = [];
  categorias: CategoriaDto[] = [];
  contactos: ContactDto[] = [];
  pagedData: PagedResponse<TransaccionDto> | null = null;
  pageNumber = 1;
  pageSize = 10;
  isDescending = false;

  showModal = false;
  isEditing = false;
  formData: any = { transaccionId: 0, accountId: 0, categoryId: 0, contactsId: null, monto: 0, moneda: 'USD', descripcion: '', fecha: '' };
  errorMessage = '';

  constructor(
    private transaccionService: TransaccionService,
    private cuentaService: CuentaService,
    private categoriaService: CategoriaService,
    private contactService: ContactService,
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

    this.loadRelatedData();
  }

  loadData(): void {
    this.transaccionService.getPaginated({
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      isDescending: this.isDescending,
    }).subscribe({
      next: (res) => { if (res.isSuccess) { this.pagedData = res.data; this.items = res.data.items; } },
      error: () => this.errorMessage = 'Error al cargar transacciones'
    });
  }

  loadRelatedData(): void {
    this.cuentaService.getPaginated({ pageNumber: 1, pageSize: 100 }).subscribe({
      next: (res) => { if (res.isSuccess) this.cuentas = res.data.items; }
    });
    this.categoriaService.getAll().subscribe({
      next: (res) => { if (res.isSuccess) this.categorias = res.data; }
    });
    this.contactService.getPaginated({ pageNumber: 1, pageSize: 100 }).subscribe({
      next: (res) => { if (res.isSuccess) this.contactos = res.data.items; }
    });
  }

  openCreate(): void {
    this.isEditing = false;
    this.formData = { transaccionId: 0, accountId: 0, categoryId: 0, contactsId: null, monto: 0, moneda: 'USD', descripcion: '', fecha: new Date().toISOString().slice(0, 16) };
    this.errorMessage = '';
    this.showModal = true;
  }

  openEdit(item: TransaccionDto): void {
    this.router.navigate(['/transacciones', item.transaccionId, 'editar']);
  }

  save(): void {
    this.errorMessage = '';
    const data = { ...this.formData, contactsId: this.formData.contactsId || null };
    if (this.isEditing) {
      const dto: TransaccionUpdateDto = data;
      this.transaccionService.update(dto).subscribe({
        next: (res) => { if (res.isSuccess) { this.showModal = false; this.loadData(); } else this.errorMessage = res.message; },
        error: () => this.errorMessage = 'Error al actualizar'
      });
    } else {
      const { transaccionId, ...rest } = data;
      const dto: TransaccionCreateDto = rest;
      this.transaccionService.create(dto).subscribe({
        next: (res) => { if (res.isSuccess) { this.showModal = false; this.loadData(); } else this.errorMessage = res.message; },
        error: () => this.errorMessage = 'Error al crear'
      });
    }
  }

  deleteItem(id: number): void {
    if (!confirm('¿Está seguro de eliminar esta transacción?')) return;
    this.transaccionService.delete(id).subscribe({
      next: (res) => { if (res.isSuccess) this.loadData(); },
      error: () => this.errorMessage = 'Error al eliminar'
    });
  }

  prevPage(): void { if (this.pagedData?.hasPreviousPage) { this.pageNumber--; this.loadData(); } }
  nextPage(): void { if (this.pagedData?.hasNextPage) { this.pageNumber++; this.loadData(); } }
}
