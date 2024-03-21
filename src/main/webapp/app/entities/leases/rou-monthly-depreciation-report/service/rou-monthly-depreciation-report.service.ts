import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IRouMonthlyDepreciationReport, getRouMonthlyDepreciationReportIdentifier } from '../rou-monthly-depreciation-report.model';

export type EntityResponseType = HttpResponse<IRouMonthlyDepreciationReport>;
export type EntityArrayResponseType = HttpResponse<IRouMonthlyDepreciationReport[]>;

@Injectable({ providedIn: 'root' })
export class RouMonthlyDepreciationReportService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/rou-monthly-depreciation-reports');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/rou-monthly-depreciation-reports');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(rouMonthlyDepreciationReport: IRouMonthlyDepreciationReport): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(rouMonthlyDepreciationReport);
    return this.http
      .post<IRouMonthlyDepreciationReport>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(rouMonthlyDepreciationReport: IRouMonthlyDepreciationReport): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(rouMonthlyDepreciationReport);
    return this.http
      .put<IRouMonthlyDepreciationReport>(
        `${this.resourceUrl}/${getRouMonthlyDepreciationReportIdentifier(rouMonthlyDepreciationReport) as number}`,
        copy,
        { observe: 'response' }
      )
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(rouMonthlyDepreciationReport: IRouMonthlyDepreciationReport): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(rouMonthlyDepreciationReport);
    return this.http
      .patch<IRouMonthlyDepreciationReport>(
        `${this.resourceUrl}/${getRouMonthlyDepreciationReportIdentifier(rouMonthlyDepreciationReport) as number}`,
        copy,
        { observe: 'response' }
      )
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IRouMonthlyDepreciationReport>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IRouMonthlyDepreciationReport[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IRouMonthlyDepreciationReport[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  addRouMonthlyDepreciationReportToCollectionIfMissing(
    rouMonthlyDepreciationReportCollection: IRouMonthlyDepreciationReport[],
    ...rouMonthlyDepreciationReportsToCheck: (IRouMonthlyDepreciationReport | null | undefined)[]
  ): IRouMonthlyDepreciationReport[] {
    const rouMonthlyDepreciationReports: IRouMonthlyDepreciationReport[] = rouMonthlyDepreciationReportsToCheck.filter(isPresent);
    if (rouMonthlyDepreciationReports.length > 0) {
      const rouMonthlyDepreciationReportCollectionIdentifiers = rouMonthlyDepreciationReportCollection.map(
        rouMonthlyDepreciationReportItem => getRouMonthlyDepreciationReportIdentifier(rouMonthlyDepreciationReportItem)!
      );
      const rouMonthlyDepreciationReportsToAdd = rouMonthlyDepreciationReports.filter(rouMonthlyDepreciationReportItem => {
        const rouMonthlyDepreciationReportIdentifier = getRouMonthlyDepreciationReportIdentifier(rouMonthlyDepreciationReportItem);
        if (
          rouMonthlyDepreciationReportIdentifier == null ||
          rouMonthlyDepreciationReportCollectionIdentifiers.includes(rouMonthlyDepreciationReportIdentifier)
        ) {
          return false;
        }
        rouMonthlyDepreciationReportCollectionIdentifiers.push(rouMonthlyDepreciationReportIdentifier);
        return true;
      });
      return [...rouMonthlyDepreciationReportsToAdd, ...rouMonthlyDepreciationReportCollection];
    }
    return rouMonthlyDepreciationReportCollection;
  }

  protected convertDateFromClient(rouMonthlyDepreciationReport: IRouMonthlyDepreciationReport): IRouMonthlyDepreciationReport {
    return Object.assign({}, rouMonthlyDepreciationReport, {
      timeOfRequest: rouMonthlyDepreciationReport.timeOfRequest?.isValid()
        ? rouMonthlyDepreciationReport.timeOfRequest.toJSON()
        : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.timeOfRequest = res.body.timeOfRequest ? dayjs(res.body.timeOfRequest) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((rouMonthlyDepreciationReport: IRouMonthlyDepreciationReport) => {
        rouMonthlyDepreciationReport.timeOfRequest = rouMonthlyDepreciationReport.timeOfRequest
          ? dayjs(rouMonthlyDepreciationReport.timeOfRequest)
          : undefined;
      });
    }
    return res;
  }
}
