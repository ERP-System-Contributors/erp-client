///
/// Erp System - Mark VII No 4 (Gideon Series) Client 1.5.6
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
import { IAssetRegistration, getAssetRegistrationIdentifier } from '../asset-registration.model';
import { DATE_FORMAT } from '../../../../config/input.constants';
import * as dayjs from 'dayjs';
import { map } from 'rxjs/operators';

export type EntityResponseType = HttpResponse<IAssetRegistration>;
export type EntityArrayResponseType = HttpResponse<IAssetRegistration[]>;

@Injectable({ providedIn: 'root' })
export class AssetRegistrationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/fixed-asset/asset-registrations');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/fixed-asset/_search/asset-registrations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(assetRegistration: IAssetRegistration): Observable<EntityResponseType> {
    return this.http.post<IAssetRegistration>(this.resourceUrl, assetRegistration, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)))
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(assetRegistration: IAssetRegistration): Observable<EntityResponseType> {
    return this.http.put<IAssetRegistration>(
      `${this.resourceUrl}/${getAssetRegistrationIdentifier(assetRegistration) as number}`,
      assetRegistration,
      { observe: 'response' }
    )
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(assetRegistration: IAssetRegistration): Observable<EntityResponseType> {
    return this.http.patch<IAssetRegistration>(
      `${this.resourceUrl}/${getAssetRegistrationIdentifier(assetRegistration) as number}`,
      assetRegistration,
      { observe: 'response' }
    )
    .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAssetRegistration>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAssetRegistration[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAssetRegistration[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  addAssetRegistrationToCollectionIfMissing(
    assetRegistrationCollection: IAssetRegistration[],
    ...assetRegistrationsToCheck: (IAssetRegistration | null | undefined)[]
  ): IAssetRegistration[] {
    const assetRegistrations: IAssetRegistration[] = assetRegistrationsToCheck.filter(isPresent);
    if (assetRegistrations.length > 0) {
      const assetRegistrationCollectionIdentifiers = assetRegistrationCollection.map(
        assetRegistrationItem => getAssetRegistrationIdentifier(assetRegistrationItem)!
      );
      const assetRegistrationsToAdd = assetRegistrations.filter(assetRegistrationItem => {
        const assetRegistrationIdentifier = getAssetRegistrationIdentifier(assetRegistrationItem);
        if (assetRegistrationIdentifier == null || assetRegistrationCollectionIdentifiers.includes(assetRegistrationIdentifier)) {
          return false;
        }
        assetRegistrationCollectionIdentifiers.push(assetRegistrationIdentifier);
        return true;
      });
      return [...assetRegistrationsToAdd, ...assetRegistrationCollection];
    }
    return assetRegistrationCollection;
  }

  protected convertDateFromClient(assetRegistration: IAssetRegistration): IAssetRegistration {
    return Object.assign({}, assetRegistration, {
      capitalizationDate: assetRegistration.capitalizationDate?.isValid()
        ? assetRegistration.capitalizationDate.format(DATE_FORMAT)
        : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.capitalizationDate = res.body.capitalizationDate ? dayjs(res.body.capitalizationDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((assetRegistration: IAssetRegistration) => {
        assetRegistration.capitalizationDate = assetRegistration.capitalizationDate
          ? dayjs(assetRegistration.capitalizationDate)
          : undefined;
      });
    }
    return res;
  }
}
