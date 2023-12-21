///
/// Erp System - Mark IX No 5 (Iddo Series) Client 1.6.4
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
import { CardBrandTypeComponent } from '../list/card-brand-type.component';
import { CardBrandTypeDetailComponent } from '../detail/card-brand-type-detail.component';
import { CardBrandTypeUpdateComponent } from '../update/card-brand-type-update.component';
import { CardBrandTypeRoutingResolveService } from './card-brand-type-routing-resolve.service';

const cardBrandTypeRoute: Routes = [
  {
    path: '',
    component: CardBrandTypeComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CardBrandTypeDetailComponent,
    resolve: {
      cardBrandType: CardBrandTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CardBrandTypeUpdateComponent,
    resolve: {
      cardBrandType: CardBrandTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CardBrandTypeUpdateComponent,
    resolve: {
      cardBrandType: CardBrandTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(cardBrandTypeRoute)],
  exports: [RouterModule],
})
export class CardBrandTypeRoutingModule {}
