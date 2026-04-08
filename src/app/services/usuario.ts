import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseResponse, PagedResponse, PaginationParams } from '../models/base-response.model';
import { UsuarioDto, UsuarioCreateDto, UsuarioUpdateDto } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private url = `${environment.apiUrl}/Usuario`;

  constructor(private http: HttpClient) {}

  getPaginated(params: PaginationParams): Observable<BaseResponse<PagedResponse<UsuarioDto>>> {
    let httpParams = new HttpParams()
      .set('PageNumber', params.pageNumber)
      .set('PageSize', params.pageSize);
    if (params.isDescending) httpParams = httpParams.set('IsDescending', true);
    return this.http.get<BaseResponse<PagedResponse<UsuarioDto>>>(this.url, { params: httpParams });
  }

  getAll(): Observable<BaseResponse<UsuarioDto[]>> {
    return this.http.get<BaseResponse<UsuarioDto[]>>(`${this.url}/all`);
  }

  getById(id: number): Observable<BaseResponse<UsuarioDto>> {
    return this.http.get<BaseResponse<UsuarioDto>>(`${this.url}/${id}`);
  }

  existsEmail(email: string): Observable<BaseResponse<boolean>> {
    return this.http.get<BaseResponse<boolean>>(`${this.url}/exists-email/${email}`);
  }

  create(dto: UsuarioCreateDto): Observable<BaseResponse<UsuarioDto>> {
    return this.http.post<BaseResponse<UsuarioDto>>(this.url, dto);
  }

  update(dto: UsuarioUpdateDto): Observable<BaseResponse<UsuarioDto>> {
    return this.http.put<BaseResponse<UsuarioDto>>(this.url, dto);
  }

  delete(id: number): Observable<BaseResponse<boolean>> {
    return this.http.delete<BaseResponse<boolean>>(`${this.url}/${id}`);
  }
}
