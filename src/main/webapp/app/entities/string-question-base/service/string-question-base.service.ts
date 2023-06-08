///
/// Erp System - Mark III No 15 (Caleb Series) Client 1.3.7
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
import { IStringQuestionBase, getStringQuestionBaseIdentifier } from '../string-question-base.model';

export type EntityResponseType = HttpResponse<IStringQuestionBase>;
export type EntityArrayResponseType = HttpResponse<IStringQuestionBase[]>;

@Injectable({ providedIn: 'root' })
export class StringQuestionBaseService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/string-question-bases');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/string-question-bases');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(stringQuestionBase: IStringQuestionBase): Observable<EntityResponseType> {
    return this.http.post<IStringQuestionBase>(this.resourceUrl, stringQuestionBase, { observe: 'response' });
  }

  update(stringQuestionBase: IStringQuestionBase): Observable<EntityResponseType> {
    return this.http.put<IStringQuestionBase>(
      `${this.resourceUrl}/${getStringQuestionBaseIdentifier(stringQuestionBase) as number}`,
      stringQuestionBase,
      { observe: 'response' }
    );
  }

  partialUpdate(stringQuestionBase: IStringQuestionBase): Observable<EntityResponseType> {
    return this.http.patch<IStringQuestionBase>(
      `${this.resourceUrl}/${getStringQuestionBaseIdentifier(stringQuestionBase) as number}`,
      stringQuestionBase,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IStringQuestionBase>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IStringQuestionBase[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IStringQuestionBase[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  addStringQuestionBaseToCollectionIfMissing(
    stringQuestionBaseCollection: IStringQuestionBase[],
    ...stringQuestionBasesToCheck: (IStringQuestionBase | null | undefined)[]
  ): IStringQuestionBase[] {
    const stringQuestionBases: IStringQuestionBase[] = stringQuestionBasesToCheck.filter(isPresent);
    if (stringQuestionBases.length > 0) {
      const stringQuestionBaseCollectionIdentifiers = stringQuestionBaseCollection.map(
        stringQuestionBaseItem => getStringQuestionBaseIdentifier(stringQuestionBaseItem)!
      );
      const stringQuestionBasesToAdd = stringQuestionBases.filter(stringQuestionBaseItem => {
        const stringQuestionBaseIdentifier = getStringQuestionBaseIdentifier(stringQuestionBaseItem);
        if (stringQuestionBaseIdentifier == null || stringQuestionBaseCollectionIdentifiers.includes(stringQuestionBaseIdentifier)) {
          return false;
        }
        stringQuestionBaseCollectionIdentifiers.push(stringQuestionBaseIdentifier);
        return true;
      });
      return [...stringQuestionBasesToAdd, ...stringQuestionBaseCollection];
    }
    return stringQuestionBaseCollection;
  }
}
