///
/// Erp System - Mark X No 9 (Jehoiada Series) Client 1.7.7
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

import { RouterModule, Routes } from '@angular/router';
import { UserRouteAccessService } from '../../../../core/auth/user-route-access.service';
import { NgModule } from '@angular/core';
import { LeaseAmortizationCalculationUpdateComponent } from '../update/lease-amortization-calculation-update.component';
import { LeaseAmortizationCalculationRoutingResolveService } from './lease-amortization-calculation-routing-resolve.service';

const leaseAmortizationCalculationCopyRoute: Routes = [
  {
    path: ':id/copy',
    component: LeaseAmortizationCalculationUpdateComponent,
    resolve: {
      iFRS16LeaseContract: LeaseAmortizationCalculationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(leaseAmortizationCalculationCopyRoute)],
  exports: [RouterModule],
})
export class LeaseAmortizationCalculationRoutingCustomModule {
}