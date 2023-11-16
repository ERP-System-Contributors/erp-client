///
/// Erp System - Mark VII No 5 (Gideon Series) Client 1.5.8
/// Copyright © 2021 - 2023 Edwin Njeru (mailnjeru@gmail.com)
///
/// This program is free software: you can redistribute it and/or modify
/// it under the terms of the GNU General Public License as published by
/// the Free Software Foundation, either version 3 of the License, or
/// (at your option) any later version.
///
/// This program is distributed in the hope that it will be useful,
/// but WITHOUT ANY WARRANTY; without even the implied warranty of
/// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
/// GNU General Public License for more details.
///
/// You should have received a copy of the GNU General Public License
/// along with this program. If not, see <http://www.gnu.org/licenses/>.
///

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { ISourcesOfFundsTypeCode, getSourcesOfFundsTypeCodeIdentifier } from '../sources-of-funds-type-code.model';

export type EntityResponseType = HttpResponse<ISourcesOfFundsTypeCode>;
export type EntityArrayResponseType = HttpResponse<ISourcesOfFundsTypeCode[]>;

@Injectable({ providedIn: 'root' })
export class SourcesOfFundsTypeCodeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sources-of-funds-type-codes');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/sources-of-funds-type-codes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(sourcesOfFundsTypeCode: ISourcesOfFundsTypeCode): Observable<EntityResponseType> {
    return this.http.post<ISourcesOfFundsTypeCode>(this.resourceUrl, sourcesOfFundsTypeCode, { observe: 'response' });
  }

  update(sourcesOfFundsTypeCode: ISourcesOfFundsTypeCode): Observable<EntityResponseType> {
    return this.http.put<ISourcesOfFundsTypeCode>(
      `${this.resourceUrl}/${getSourcesOfFundsTypeCodeIdentifier(sourcesOfFundsTypeCode) as number}`,
      sourcesOfFundsTypeCode,
      { observe: 'response' }
    );
  }

  partialUpdate(sourcesOfFundsTypeCode: ISourcesOfFundsTypeCode): Observable<EntityResponseType> {
    return this.http.patch<ISourcesOfFundsTypeCode>(
      `${this.resourceUrl}/${getSourcesOfFundsTypeCodeIdentifier(sourcesOfFundsTypeCode) as number}`,
      sourcesOfFundsTypeCode,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISourcesOfFundsTypeCode>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISourcesOfFundsTypeCode[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISourcesOfFundsTypeCode[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  addSourcesOfFundsTypeCodeToCollectionIfMissing(
    sourcesOfFundsTypeCodeCollection: ISourcesOfFundsTypeCode[],
    ...sourcesOfFundsTypeCodesToCheck: (ISourcesOfFundsTypeCode | null | undefined)[]
  ): ISourcesOfFundsTypeCode[] {
    const sourcesOfFundsTypeCodes: ISourcesOfFundsTypeCode[] = sourcesOfFundsTypeCodesToCheck.filter(isPresent);
    if (sourcesOfFundsTypeCodes.length > 0) {
      const sourcesOfFundsTypeCodeCollectionIdentifiers = sourcesOfFundsTypeCodeCollection.map(
        sourcesOfFundsTypeCodeItem => getSourcesOfFundsTypeCodeIdentifier(sourcesOfFundsTypeCodeItem)!
      );
      const sourcesOfFundsTypeCodesToAdd = sourcesOfFundsTypeCodes.filter(sourcesOfFundsTypeCodeItem => {
        const sourcesOfFundsTypeCodeIdentifier = getSourcesOfFundsTypeCodeIdentifier(sourcesOfFundsTypeCodeItem);
        if (
          sourcesOfFundsTypeCodeIdentifier == null ||
          sourcesOfFundsTypeCodeCollectionIdentifiers.includes(sourcesOfFundsTypeCodeIdentifier)
        ) {
          return false;
        }
        sourcesOfFundsTypeCodeCollectionIdentifiers.push(sourcesOfFundsTypeCodeIdentifier);
        return true;
      });
      return [...sourcesOfFundsTypeCodesToAdd, ...sourcesOfFundsTypeCodeCollection];
    }
    return sourcesOfFundsTypeCodeCollection;
  }
}
