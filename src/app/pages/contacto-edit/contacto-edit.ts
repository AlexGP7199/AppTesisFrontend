import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ContactService } from '../../services/contact';
import { UsuarioService } from '../../services/usuario';
import { ContactUpdateDto } from '../../models/contact.model';
import { UsuarioDto } from '../../models/usuario.model';

@Component({
  selector: 'app-contacto-edit',
  imports: [FormsModule, RouterLink],
  templateUrl: './contacto-edit.html',
  styleUrls: ['../../shared/entity-edit.css', '../../shared/crud-styles.css'],
})
export class ContactoEdit implements OnInit {
  contactId = 0;
  usuarios: UsuarioDto[] = [];
  formData: ContactUpdateDto = { contactsId: 0, userId: 0, name: '', type: 'Cliente', email: '', phone: '' };
  errorMessage = '';
  successMessage = '';
  isLoading = true;
  isSaving = false;

  constructor(
    private contactService: ContactService,
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
        this.errorMessage = 'El ID del contacto no es válido.';
        return;
      }

      this.contactId = id;
      this.loadContact(id);
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

  loadContact(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.contactService.getById(id).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.isSuccess) {
          this.formData = {
            contactsId: res.data.contactsId,
            userId: res.data.userId,
            name: res.data.name,
            type: res.data.type,
            email: res.data.email,
            phone: res.data.phone,
          };
        } else {
          this.errorMessage = res.message;
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Error al cargar el contacto';
      }
    });
  }

  save(): void {
    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.contactService.update(this.formData).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res.isSuccess) {
          this.successMessage = 'Contacto actualizado correctamente';
          this.formData = { ...this.formData, ...res.data };
        } else {
          this.errorMessage = res.message;
        }
      },
      error: () => {
        this.isSaving = false;
        this.errorMessage = 'Error al actualizar el contacto';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/contactos']);
  }
}
