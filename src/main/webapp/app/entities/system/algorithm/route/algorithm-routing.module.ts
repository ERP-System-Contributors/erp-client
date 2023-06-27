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
import { AlgorithmComponent } from '../list/algorithm.component';
import { AlgorithmDetailComponent } from '../detail/algorithm-detail.component';
import { AlgorithmUpdateComponent } from '../update/algorithm-update.component';
import { AlgorithmRoutingResolveService } from './algorithm-routing-resolve.service';

const algorithmRoute: Routes = [
  {
    path: '',
    component: AlgorithmComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AlgorithmDetailComponent,
    resolve: {
      algorithm: AlgorithmRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AlgorithmUpdateComponent,
    resolve: {
      algorithm: AlgorithmRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AlgorithmUpdateComponent,
    resolve: {
      algorithm: AlgorithmRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(algorithmRoute)],
  exports: [RouterModule],
})
export class AlgorithmRoutingModule {}