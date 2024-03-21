import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IWorkInProgressOverview, getWorkInProgressOverviewIdentifier } from '../work-in-progress-overview.model';

export type EntityResponseType = HttpResponse<IWorkInProgressOverview>;
export type EntityArrayResponseType = HttpResponse<IWorkInProgressOverview[]>;

@Injectable({ providedIn: 'root' })
export class WorkInProgressOverviewService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/work-in-progress-overviews');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/work-in-progress-overviews');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IWorkInProgressOverview>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IWorkInProgressOverview[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IWorkInProgressOverview[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  addWorkInProgressOverviewToCollectionIfMissing(
    workInProgressOverviewCollection: IWorkInProgressOverview[],
    ...workInProgressOverviewsToCheck: (IWorkInProgressOverview | null | undefined)[]
  ): IWorkInProgressOverview[] {
    const workInProgressOverviews: IWorkInProgressOverview[] = workInProgressOverviewsToCheck.filter(isPresent);
    if (workInProgressOverviews.length > 0) {
      const workInProgressOverviewCollectionIdentifiers = workInProgressOverviewCollection.map(
        workInProgressOverviewItem => getWorkInProgressOverviewIdentifier(workInProgressOverviewItem)!
      );
      const workInProgressOverviewsToAdd = workInProgressOverviews.filter(workInProgressOverviewItem => {
        const workInProgressOverviewIdentifier = getWorkInProgressOverviewIdentifier(workInProgressOverviewItem);
        if (
          workInProgressOverviewIdentifier == null ||
          workInProgressOverviewCollectionIdentifiers.includes(workInProgressOverviewIdentifier)
        ) {
          return false;
        }
        workInProgressOverviewCollectionIdentifiers.push(workInProgressOverviewIdentifier);
        return true;
      });
      return [...workInProgressOverviewsToAdd, ...workInProgressOverviewCollection];
    }
    return workInProgressOverviewCollection;
  }
}
