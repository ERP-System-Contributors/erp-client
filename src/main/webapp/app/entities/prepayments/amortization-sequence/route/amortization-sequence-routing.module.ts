///
/// Erp System - Mark III No 17 (Caleb Series) Client 1.3.9
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
import { AmortizationSequenceComponent } from '../list/amortization-sequence.component';
import { AmortizationSequenceDetailComponent } from '../detail/amortization-sequence-detail.component';
import { AmortizationSequenceUpdateComponent } from '../update/amortization-sequence-update.component';
import { AmortizationSequenceRoutingResolveService } from './amortization-sequence-routing-resolve.service';

const amortizationSequenceRoute: Routes = [
  {
    path: '',
    component: AmortizationSequenceComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AmortizationSequenceDetailComponent,
    resolve: {
      amortizationSequence: AmortizationSequenceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AmortizationSequenceUpdateComponent,
    resolve: {
      amortizationSequence: AmortizationSequenceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AmortizationSequenceUpdateComponent,
    resolve: {
      amortizationSequence: AmortizationSequenceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(amortizationSequenceRoute)],
  exports: [RouterModule],
})
export class AmortizationSequenceRoutingModule {}
