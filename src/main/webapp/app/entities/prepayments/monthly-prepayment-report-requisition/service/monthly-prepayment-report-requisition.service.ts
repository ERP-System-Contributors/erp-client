///
/// Erp System - Mark X No 6 (Jehoiada Series) Client 1.7.4
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
import {
  IMonthlyPrepaymentReportRequisition,
  getMonthlyPrepaymentReportRequisitionIdentifier,
} from '../monthly-prepayment-report-requisition.model';

export type EntityResponseType = HttpResponse<IMonthlyPrepaymentReportRequisition>;
export type EntityArrayResponseType = HttpResponse<IMonthlyPrepaymentReportRequisition[]>;

@Injectable({ providedIn: 'root' })
export class MonthlyPrepaymentReportRequisitionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/monthly-prepayment-report-requisitions');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/monthly-prepayment-report-requisitions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(monthlyPrepaymentReportRequisition: IMonthlyPrepaymentReportRequisition): Observable<EntityResponseType> {
    return this.http.post<IMonthlyPrepaymentReportRequisition>(this.resourceUrl, monthlyPrepaymentReportRequisition, {
      observe: 'response',
    });
  }

  update(monthlyPrepaymentReportRequisition: IMonthlyPrepaymentReportRequisition): Observable<EntityResponseType> {
    return this.http.put<IMonthlyPrepaymentReportRequisition>(
      `${this.resourceUrl}/${getMonthlyPrepaymentReportRequisitionIdentifier(monthlyPrepaymentReportRequisition) as number}`,
      monthlyPrepaymentReportRequisition,
      { observe: 'response' }
    );
  }

  partialUpdate(monthlyPrepaymentReportRequisition: IMonthlyPrepaymentReportRequisition): Observable<EntityResponseType> {
    return this.http.patch<IMonthlyPrepaymentReportRequisition>(
      `${this.resourceUrl}/${getMonthlyPrepaymentReportRequisitionIdentifier(monthlyPrepaymentReportRequisition) as number}`,
      monthlyPrepaymentReportRequisition,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMonthlyPrepaymentReportRequisition>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMonthlyPrepaymentReportRequisition[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMonthlyPrepaymentReportRequisition[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  addMonthlyPrepaymentReportRequisitionToCollectionIfMissing(
    monthlyPrepaymentReportRequisitionCollection: IMonthlyPrepaymentReportRequisition[],
    ...monthlyPrepaymentReportRequisitionsToCheck: (IMonthlyPrepaymentReportRequisition | null | undefined)[]
  ): IMonthlyPrepaymentReportRequisition[] {
    const monthlyPrepaymentReportRequisitions: IMonthlyPrepaymentReportRequisition[] =
      monthlyPrepaymentReportRequisitionsToCheck.filter(isPresent);
    if (monthlyPrepaymentReportRequisitions.length > 0) {
      const monthlyPrepaymentReportRequisitionCollectionIdentifiers = monthlyPrepaymentReportRequisitionCollection.map(
        monthlyPrepaymentReportRequisitionItem => getMonthlyPrepaymentReportRequisitionIdentifier(monthlyPrepaymentReportRequisitionItem)!
      );
      const monthlyPrepaymentReportRequisitionsToAdd = monthlyPrepaymentReportRequisitions.filter(
        monthlyPrepaymentReportRequisitionItem => {
          const monthlyPrepaymentReportRequisitionIdentifier = getMonthlyPrepaymentReportRequisitionIdentifier(
            monthlyPrepaymentReportRequisitionItem
          );
          if (
            monthlyPrepaymentReportRequisitionIdentifier == null ||
            monthlyPrepaymentReportRequisitionCollectionIdentifiers.includes(monthlyPrepaymentReportRequisitionIdentifier)
          ) {
            return false;
          }
          monthlyPrepaymentReportRequisitionCollectionIdentifiers.push(monthlyPrepaymentReportRequisitionIdentifier);
          return true;
        }
      );
      return [...monthlyPrepaymentReportRequisitionsToAdd, ...monthlyPrepaymentReportRequisitionCollection];
    }
    return monthlyPrepaymentReportRequisitionCollection;
  }
}
