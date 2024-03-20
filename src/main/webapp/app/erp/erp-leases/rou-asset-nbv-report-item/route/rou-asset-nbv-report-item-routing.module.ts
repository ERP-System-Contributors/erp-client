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

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RouAssetNBVReportItemComponent } from '../list/rou-asset-nbv-report-item.component';
import { RouAssetNBVReportItemDetailComponent } from '../detail/rou-asset-nbv-report-item-detail.component';
import { RouAssetNBVReportItemRoutingResolveService } from './rou-asset-nbv-report-item-routing-resolve.service';

const rouAssetNBVReportItemRoute: Routes = [
  {
    path: '',
    component: RouAssetNBVReportItemComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RouAssetNBVReportItemDetailComponent,
    resolve: {
      rouAssetNBVReportItem: RouAssetNBVReportItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(rouAssetNBVReportItemRoute)],
  exports: [RouterModule],
})
export class RouAssetNBVReportItemRoutingModule {}
