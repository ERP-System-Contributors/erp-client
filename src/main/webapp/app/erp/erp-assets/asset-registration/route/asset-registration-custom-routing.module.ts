///
/// Erp System - Mark V No 1 (Ehud Series) Client 1.5.1
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
import { AssetRegistrationUpdateComponent } from '../update/asset-registration-update.component';
import { NgModule } from '@angular/core';
import { AssetRegistrationCopyRoutingResolveService } from './asset-registration-copy-routing-resolve.service';
import { AssetRegistrationCreationRoutingResolveService } from './asset-registration-creation-routing-resolve.service';

const assetRegistrationRoute: Routes = [
  {
    path: ':id/copy',
    component: AssetRegistrationUpdateComponent,
    resolve: {
      assetRegistration: AssetRegistrationCopyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AssetRegistrationUpdateComponent,
    resolve: {
      assetRegistration: AssetRegistrationCreationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(assetRegistrationRoute)],
  exports: [RouterModule],
})
export class AssetRegistrationCustomRoutingModule {

}
