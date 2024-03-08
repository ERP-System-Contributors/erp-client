///
/// Erp System - Mark X No 5 (Jehoiada Series) Client 1.7.3
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
import { IRouModelMetadata, getRouModelMetadataIdentifier } from '../rou-model-metadata.model';

export type EntityResponseType = HttpResponse<IRouModelMetadata>;
export type EntityArrayResponseType = HttpResponse<IRouModelMetadata[]>;

@Injectable({ providedIn: 'root' })
export class RouModelMetadataService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/leases/rou-model-metadata');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/leases/_search/rou-model-metadata');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(rouModelMetadata: IRouModelMetadata): Observable<EntityResponseType> {
    return this.http.post<IRouModelMetadata>(this.resourceUrl, rouModelMetadata, { observe: 'response' });
  }

  update(rouModelMetadata: IRouModelMetadata): Observable<EntityResponseType> {
    return this.http.put<IRouModelMetadata>(
      `${this.resourceUrl}/${getRouModelMetadataIdentifier(rouModelMetadata) as number}`,
      rouModelMetadata,
      { observe: 'response' }
    );
  }

  partialUpdate(rouModelMetadata: IRouModelMetadata): Observable<EntityResponseType> {
    return this.http.patch<IRouModelMetadata>(
      `${this.resourceUrl}/${getRouModelMetadataIdentifier(rouModelMetadata) as number}`,
      rouModelMetadata,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRouModelMetadata>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRouModelMetadata[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRouModelMetadata[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  addRouModelMetadataToCollectionIfMissing(
    rouModelMetadataCollection: IRouModelMetadata[],
    ...rouModelMetadataToCheck: (IRouModelMetadata | null | undefined)[]
  ): IRouModelMetadata[] {
    const rouModelMetadata: IRouModelMetadata[] = rouModelMetadataToCheck.filter(isPresent);
    if (rouModelMetadata.length > 0) {
      const rouModelMetadataCollectionIdentifiers = rouModelMetadataCollection.map(
        rouModelMetadataItem => getRouModelMetadataIdentifier(rouModelMetadataItem)!
      );
      const rouModelMetadataToAdd = rouModelMetadata.filter(rouModelMetadataItem => {
        const rouModelMetadataIdentifier = getRouModelMetadataIdentifier(rouModelMetadataItem);
        if (rouModelMetadataIdentifier == null || rouModelMetadataCollectionIdentifiers.includes(rouModelMetadataIdentifier)) {
          return false;
        }
        rouModelMetadataCollectionIdentifiers.push(rouModelMetadataIdentifier);
        return true;
      });
      return [...rouModelMetadataToAdd, ...rouModelMetadataCollection];
    }
    return rouModelMetadataCollection;
  }
}
