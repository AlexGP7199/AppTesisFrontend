import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseResponse, PagedResponse, PaginationParams } from '../models/base-response.model';
import { CategoriaDto, CategoriaCreateDto, CategoriaUpdateDto } from '../models/categoria.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private url = `${environment.apiUrl}/Categoria`;

  constructor(private http: HttpClient) {}

  getPaginated(params: PaginationParams): Observable<BaseResponse<PagedResponse<CategoriaDto>>> {
    let httpParams = new HttpParams()
      .set('PageNumber', params.pageNumber)
      .set('PageSize', params.pageSize);
    if (params.isDescending) httpParams = httpParams.set('IsDescending', true);
    return this.http.get<BaseResponse<PagedResponse<CategoriaDto>>>(this.url, { params: httpParams });
  }

  getAll(): Observable<BaseResponse<CategoriaDto[]>> {
    return this.http.get<BaseResponse<CategoriaDto[]>>(`${this.url}/all`);
  }

  getById(id: number): Observable<BaseResponse<CategoriaDto>> {
    return this.http.get<BaseResponse<CategoriaDto>>(`${this.url}/${id}`);
  }

  getByType(operationType: string): Observable<BaseResponse<CategoriaDto[]>> {
    return this.http.get<BaseResponse<CategoriaDto[]>>(`${this.url}/tipo/${operationType}`);
  }

  create(dto: CategoriaCreateDto): Observable<BaseResponse<CategoriaDto>> {
    return this.http.post<BaseResponse<CategoriaDto>>(this.url, dto);
  }

  update(dto: CategoriaUpdateDto): Observable<BaseResponse<CategoriaDto>> {
    return this.http.put<BaseResponse<CategoriaDto>>(this.url, dto);
  }

  delete(id: number): Observable<BaseResponse<boolean>> {
    return this.http.delete<BaseResponse<boolean>>(`${this.url}/${id}`);
  }
}
