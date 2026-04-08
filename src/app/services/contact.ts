import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseResponse, PagedResponse, PaginationParams } from '../models/base-response.model';
import { ContactDto, ContactCreateDto, ContactUpdateDto } from '../models/contact.model';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private url = `${environment.apiUrl}/Contact`;

  constructor(private http: HttpClient) {}

  getPaginated(params: PaginationParams): Observable<BaseResponse<PagedResponse<ContactDto>>> {
    let httpParams = new HttpParams()
      .set('PageNumber', params.pageNumber)
      .set('PageSize', params.pageSize);
    if (params.isDescending) httpParams = httpParams.set('IsDescending', true);
    return this.http.get<BaseResponse<PagedResponse<ContactDto>>>(this.url, { params: httpParams });
  }

  getById(id: number): Observable<BaseResponse<ContactDto>> {
    return this.http.get<BaseResponse<ContactDto>>(`${this.url}/${id}`);
  }

  getByUserId(userId: number): Observable<BaseResponse<ContactDto[]>> {
    return this.http.get<BaseResponse<ContactDto[]>>(`${this.url}/usuario/${userId}`);
  }

  getByType(type: string): Observable<BaseResponse<ContactDto[]>> {
    return this.http.get<BaseResponse<ContactDto[]>>(`${this.url}/tipo/${type}`);
  }

  create(dto: ContactCreateDto): Observable<BaseResponse<ContactDto>> {
    return this.http.post<BaseResponse<ContactDto>>(this.url, dto);
  }

  update(dto: ContactUpdateDto): Observable<BaseResponse<ContactDto>> {
    return this.http.put<BaseResponse<ContactDto>>(this.url, dto);
  }

  delete(id: number): Observable<BaseResponse<boolean>> {
    return this.http.delete<BaseResponse<boolean>>(`${this.url}/${id}`);
  }
}
