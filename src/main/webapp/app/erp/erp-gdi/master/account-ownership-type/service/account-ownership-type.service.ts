///
/// Erp System - Mark IX No 3 (Iddo Series) Client 1.6.4
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
import { IAccountOwnershipType, getAccountOwnershipTypeIdentifier } from '../account-ownership-type.model';

export type EntityResponseType = HttpResponse<IAccountOwnershipType>;
export type EntityArrayResponseType = HttpResponse<IAccountOwnershipType[]>;

@Injectable({ providedIn: 'root' })
export class AccountOwnershipTypeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/account-ownership-types');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/account-ownership-types');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAccountOwnershipType>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAccountOwnershipType[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAccountOwnershipType[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  addAccountOwnershipTypeToCollectionIfMissing(
    accountOwnershipTypeCollection: IAccountOwnershipType[],
    ...accountOwnershipTypesToCheck: (IAccountOwnershipType | null | undefined)[]
  ): IAccountOwnershipType[] {
    const accountOwnershipTypes: IAccountOwnershipType[] = accountOwnershipTypesToCheck.filter(isPresent);
    if (accountOwnershipTypes.length > 0) {
      const accountOwnershipTypeCollectionIdentifiers = accountOwnershipTypeCollection.map(
        accountOwnershipTypeItem => getAccountOwnershipTypeIdentifier(accountOwnershipTypeItem)!
      );
      const accountOwnershipTypesToAdd = accountOwnershipTypes.filter(accountOwnershipTypeItem => {
        const accountOwnershipTypeIdentifier = getAccountOwnershipTypeIdentifier(accountOwnershipTypeItem);
        if (accountOwnershipTypeIdentifier == null || accountOwnershipTypeCollectionIdentifiers.includes(accountOwnershipTypeIdentifier)) {
          return false;
        }
        accountOwnershipTypeCollectionIdentifiers.push(accountOwnershipTypeIdentifier);
        return true;
      });
      return [...accountOwnershipTypesToAdd, ...accountOwnershipTypeCollection];
    }
    return accountOwnershipTypeCollection;
  }
}
