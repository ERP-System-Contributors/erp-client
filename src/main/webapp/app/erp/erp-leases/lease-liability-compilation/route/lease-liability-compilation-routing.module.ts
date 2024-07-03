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

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LeaseLiabilityCompilationComponent } from '../list/lease-liability-compilation.component';
import { LeaseLiabilityCompilationDetailComponent } from '../detail/lease-liability-compilation-detail.component';
import { LeaseLiabilityCompilationUpdateComponent } from '../update/lease-liability-compilation-update.component';
import { LeaseLiabilityCompilationRoutingResolveService } from './lease-liability-compilation-routing-resolve.service';

const leaseLiabilityCompilationRoute: Routes = [
  {
    path: '',
    component: LeaseLiabilityCompilationComponent,
    data: {
      defaultSort: 'id,desc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LeaseLiabilityCompilationDetailComponent,
    resolve: {
      leaseLiabilityCompilation: LeaseLiabilityCompilationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LeaseLiabilityCompilationUpdateComponent,
    resolve: {
      leaseLiabilityCompilation: LeaseLiabilityCompilationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LeaseLiabilityCompilationUpdateComponent,
    resolve: {
      leaseLiabilityCompilation: LeaseLiabilityCompilationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(leaseLiabilityCompilationRoute)],
  exports: [RouterModule],
})
export class LeaseLiabilityCompilationRoutingModule {}
