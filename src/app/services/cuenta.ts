import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseResponse, PagedResponse, PaginationParams } from '../models/base-response.model';
import { CuentaDto, CuentaCreateDto, CuentaUpdateDto } from '../models/cuenta.model';

@Injectable({
  providedIn: 'root',
})
export class CuentaService {
  private url = `${environment.apiUrl}/Cuenta`;

  constructor(private http: HttpClient) {}

  getPaginated(params: PaginationParams): Observable<BaseResponse<PagedResponse<CuentaDto>>> {
    let httpParams = new HttpParams()
      .set('PageNumber', params.pageNumber)
      .set('PageSize', params.pageSize);
    if (params.isDescending) httpParams = httpParams.set('IsDescending', true);
    return this.http.get<BaseResponse<PagedResponse<CuentaDto>>>(this.url, { params: httpParams });
  }

  getById(id: number): Observable<BaseResponse<CuentaDto>> {
    return this.http.get<BaseResponse<CuentaDto>>(`${this.url}/${id}`);
  }

  getByUserId(userId: number): Observable<BaseResponse<CuentaDto[]>> {
    return this.http.get<BaseResponse<CuentaDto[]>>(`${this.url}/usuario/${userId}`);
  }

  create(dto: CuentaCreateDto): Observable<BaseResponse<CuentaDto>> {
    return this.http.post<BaseResponse<CuentaDto>>(this.url, dto);
  }

  update(dto: CuentaUpdateDto): Observable<BaseResponse<CuentaDto>> {
    return this.http.put<BaseResponse<CuentaDto>>(this.url, dto);
  }

  delete(id: number): Observable<BaseResponse<boolean>> {
    return this.http.delete<BaseResponse<boolean>>(`${this.url}/${id}`);
  }
}
