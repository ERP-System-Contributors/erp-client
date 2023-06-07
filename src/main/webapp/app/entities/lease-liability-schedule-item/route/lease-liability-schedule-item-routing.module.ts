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

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LeaseLiabilityScheduleItemComponent } from '../list/lease-liability-schedule-item.component';
import { LeaseLiabilityScheduleItemDetailComponent } from '../detail/lease-liability-schedule-item-detail.component';
import { LeaseLiabilityScheduleItemUpdateComponent } from '../update/lease-liability-schedule-item-update.component';
import { LeaseLiabilityScheduleItemRoutingResolveService } from './lease-liability-schedule-item-routing-resolve.service';

const leaseLiabilityScheduleItemRoute: Routes = [
  {
    path: '',
    component: LeaseLiabilityScheduleItemComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LeaseLiabilityScheduleItemDetailComponent,
    resolve: {
      leaseLiabilityScheduleItem: LeaseLiabilityScheduleItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LeaseLiabilityScheduleItemUpdateComponent,
    resolve: {
      leaseLiabilityScheduleItem: LeaseLiabilityScheduleItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LeaseLiabilityScheduleItemUpdateComponent,
    resolve: {
      leaseLiabilityScheduleItem: LeaseLiabilityScheduleItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(leaseLiabilityScheduleItemRoute)],
  exports: [RouterModule],
})
export class LeaseLiabilityScheduleItemRoutingModule {}
