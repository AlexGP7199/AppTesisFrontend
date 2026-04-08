import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService } from '../../services/contact';
import { UsuarioService } from '../../services/usuario';
import { ContactDto, ContactCreateDto, ContactUpdateDto } from '../../models/contact.model';
import { UsuarioDto } from '../../models/usuario.model';
import { PagedResponse } from '../../models/base-response.model';
import { readPaginationFromRoute } from '../../shared/route-pagination';

@Component({
  selector: 'app-contactos',
  imports: [FormsModule],
  templateUrl: './contactos.html',
  styleUrls: ['./contactos.css', '../../shared/crud-styles.css'],
})
export class Contactos implements OnInit {
  items: ContactDto[] = [];
  usuarios: UsuarioDto[] = [];
  pagedData: PagedResponse<ContactDto> | null = null;
  pageNumber = 1;
  pageSize = 10;
  isDescending = false;

  showModal = false;
  isEditing = false;
  formData = { contactsId: 0, userId: 0, name: '', type: 'Cliente', email: '', phone: '' };
  errorMessage = '';

  constructor(
    private contactService: ContactService,
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
    this.contactService.getPaginated({
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      isDescending: this.isDescending,
    }).subscribe({
      next: (res) => { if (res.isSuccess) { this.pagedData = res.data; this.items = res.data.items; } },
      error: () => this.errorMessage = 'Error al cargar contactos'
    });
  }

  loadUsuarios(): void {
    this.usuarioService.getAll().subscribe({
      next: (res) => { if (res.isSuccess) this.usuarios = res.data; }
    });
  }

  openCreate(): void {
    this.isEditing = false;
    this.formData = { contactsId: 0, userId: 0, name: '', type: 'Cliente', email: '', phone: '' };
    this.errorMessage = '';
    this.showModal = true;
  }

  openEdit(item: ContactDto): void {
    this.router.navigate(['/contactos', item.contactsId, 'editar']);
  }

  save(): void {
    this.errorMessage = '';
    if (this.isEditing) {
      const dto: ContactUpdateDto = { ...this.formData };
      this.contactService.update(dto).subscribe({
        next: (res) => { if (res.isSuccess) { this.showModal = false; this.loadData(); } else this.errorMessage = res.message; },
        error: () => this.errorMessage = 'Error al actualizar'
      });
    } else {
      const { contactsId, ...rest } = this.formData;
      const dto: ContactCreateDto = rest;
      this.contactService.create(dto).subscribe({
        next: (res) => { if (res.isSuccess) { this.showModal = false; this.loadData(); } else this.errorMessage = res.message; },
        error: () => this.errorMessage = 'Error al crear'
      });
    }
  }

  deleteItem(id: number): void {
    if (!confirm('¿Está seguro de eliminar este contacto?')) return;
    this.contactService.delete(id).subscribe({
      next: (res) => { if (res.isSuccess) this.loadData(); },
      error: () => this.errorMessage = 'Error al eliminar'
    });
  }

  prevPage(): void { if (this.pagedData?.hasPreviousPage) { this.pageNumber--; this.loadData(); } }
  nextPage(): void { if (this.pagedData?.hasNextPage) { this.pageNumber++; this.loadData(); } }
}
