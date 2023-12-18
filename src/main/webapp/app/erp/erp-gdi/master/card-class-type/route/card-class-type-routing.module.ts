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
import { CardClassTypeComponent } from '../list/card-class-type.component';
import { CardClassTypeDetailComponent } from '../detail/card-class-type-detail.component';
import { CardClassTypeUpdateComponent } from '../update/card-class-type-update.component';
import { CardClassTypeRoutingResolveService } from './card-class-type-routing-resolve.service';

const cardClassTypeRoute: Routes = [
  {
    path: '',
    component: CardClassTypeComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CardClassTypeDetailComponent,
    resolve: {
      cardClassType: CardClassTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CardClassTypeUpdateComponent,
    resolve: {
      cardClassType: CardClassTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CardClassTypeUpdateComponent,
    resolve: {
      cardClassType: CardClassTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(cardClassTypeRoute)],
  exports: [RouterModule],
})
export class CardClassTypeRoutingModule {}
