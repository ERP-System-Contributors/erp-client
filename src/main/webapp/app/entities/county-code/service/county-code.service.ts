import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { ICountyCode, getCountyCodeIdentifier } from '../county-code.model';

export type EntityResponseType = HttpResponse<ICountyCode>;
export type EntityArrayResponseType = HttpResponse<ICountyCode[]>;

@Injectable({ providedIn: 'root' })
export class CountyCodeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/county-codes');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/county-codes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(countyCode: ICountyCode): Observable<EntityResponseType> {
    return this.http.post<ICountyCode>(this.resourceUrl, countyCode, { observe: 'response' });
  }

  update(countyCode: ICountyCode): Observable<EntityResponseType> {
    return this.http.put<ICountyCode>(`${this.resourceUrl}/${getCountyCodeIdentifier(countyCode) as number}`, countyCode, {
      observe: 'response',
    });
  }

  partialUpdate(countyCode: ICountyCode): Observable<EntityResponseType> {
    return this.http.patch<ICountyCode>(`${this.resourceUrl}/${getCountyCodeIdentifier(countyCode) as number}`, countyCode, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICountyCode>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICountyCode[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICountyCode[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  addCountyCodeToCollectionIfMissing(
    countyCodeCollection: ICountyCode[],
    ...countyCodesToCheck: (ICountyCode | null | undefined)[]
  ): ICountyCode[] {
    const countyCodes: ICountyCode[] = countyCodesToCheck.filter(isPresent);
    if (countyCodes.length > 0) {
      const countyCodeCollectionIdentifiers = countyCodeCollection.map(countyCodeItem => getCountyCodeIdentifier(countyCodeItem)!);
      const countyCodesToAdd = countyCodes.filter(countyCodeItem => {
        const countyCodeIdentifier = getCountyCodeIdentifier(countyCodeItem);
        if (countyCodeIdentifier == null || countyCodeCollectionIdentifiers.includes(countyCodeIdentifier)) {
          return false;
        }
        countyCodeCollectionIdentifiers.push(countyCodeIdentifier);
        return true;
      });
      return [...countyCodesToAdd, ...countyCodeCollection];
    }
    return countyCodeCollection;
  }
}