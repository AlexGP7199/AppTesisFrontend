import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseResponse, PagedResponse, PaginationParams } from '../models/base-response.model';
import { TransaccionDto, TransaccionCreateDto, TransaccionUpdateDto } from '../models/transaccion.model';

@Injectable({
  providedIn: 'root',
})
export class TransaccionService {
  private url = `${environment.apiUrl}/Transaccion`;

  constructor(private http: HttpClient) {}

  getPaginated(params: PaginationParams): Observable<BaseResponse<PagedResponse<TransaccionDto>>> {
    let httpParams = new HttpParams()
      .set('PageNumber', params.pageNumber)
      .set('PageSize', params.pageSize);
    if (params.isDescending) httpParams = httpParams.set('IsDescending', true);
    return this.http.get<BaseResponse<PagedResponse<TransaccionDto>>>(this.url, { params: httpParams });
  }

  getById(id: number): Observable<BaseResponse<TransaccionDto>> {
    return this.http.get<BaseResponse<TransaccionDto>>(`${this.url}/${id}`);
  }

  getByAccountId(accountId: number): Observable<BaseResponse<TransaccionDto[]>> {
    return this.http.get<BaseResponse<TransaccionDto[]>>(`${this.url}/cuenta/${accountId}`);
  }

  getByCategoryId(categoryId: number): Observable<BaseResponse<TransaccionDto[]>> {
    return this.http.get<BaseResponse<TransaccionDto[]>>(`${this.url}/categoria/${categoryId}`);
  }

  getTotalByType(accountId: number, operationType: string): Observable<BaseResponse<number>> {
    return this.http.get<BaseResponse<number>>(`${this.url}/cuenta/${accountId}/total/${operationType}`);
  }

  getBalance(accountId: number): Observable<BaseResponse<number>> {
    return this.http.get<BaseResponse<number>>(`${this.url}/cuenta/${accountId}/balance`);
  }

  create(dto: TransaccionCreateDto): Observable<BaseResponse<TransaccionDto>> {
    return this.http.post<BaseResponse<TransaccionDto>>(this.url, dto);
  }

  update(dto: TransaccionUpdateDto): Observable<BaseResponse<TransaccionDto>> {
    return this.http.put<BaseResponse<TransaccionDto>>(this.url, dto);
  }

  delete(id: number): Observable<BaseResponse<boolean>> {
    return this.http.delete<BaseResponse<boolean>>(`${this.url}/${id}`);
  }
}
