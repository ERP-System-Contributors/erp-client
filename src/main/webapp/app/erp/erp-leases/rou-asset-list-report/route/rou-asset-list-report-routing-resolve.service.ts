///
/// Erp System - Mark X No 7 (Jehoiada Series) Client 1.7.5
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
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRouAssetListReport, RouAssetListReport } from '../rou-asset-list-report.model';
import { RouAssetListReportService } from '../service/rou-asset-list-report.service';

@Injectable({ providedIn: 'root' })
export class RouAssetListReportRoutingResolveService implements Resolve<IRouAssetListReport> {
  constructor(protected service: RouAssetListReportService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRouAssetListReport> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((rouAssetListReport: HttpResponse<RouAssetListReport>) => {
          if (rouAssetListReport.body) {
            return of(rouAssetListReport.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new RouAssetListReport());
  }
}
