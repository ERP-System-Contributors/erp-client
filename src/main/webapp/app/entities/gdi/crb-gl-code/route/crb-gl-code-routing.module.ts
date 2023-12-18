///
/// Erp System - Mark IX No 3 (Iddo Series) Client 1.6.4
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
import { CrbGlCodeComponent } from '../list/crb-gl-code.component';
import { CrbGlCodeDetailComponent } from '../detail/crb-gl-code-detail.component';
import { CrbGlCodeUpdateComponent } from '../update/crb-gl-code-update.component';
import { CrbGlCodeRoutingResolveService } from './crb-gl-code-routing-resolve.service';

const crbGlCodeRoute: Routes = [
  {
    path: '',
    component: CrbGlCodeComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CrbGlCodeDetailComponent,
    resolve: {
      crbGlCode: CrbGlCodeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CrbGlCodeUpdateComponent,
    resolve: {
      crbGlCode: CrbGlCodeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CrbGlCodeUpdateComponent,
    resolve: {
      crbGlCode: CrbGlCodeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(crbGlCodeRoute)],
  exports: [RouterModule],
})
export class CrbGlCodeRoutingModule {}
