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
import { ContractMetadataComponent } from '../list/contract-metadata.component';
import { ContractMetadataDetailComponent } from '../detail/contract-metadata-detail.component';
import { ContractMetadataUpdateComponent } from '../update/contract-metadata-update.component';
import { ContractMetadataRoutingResolveService } from './contract-metadata-routing-resolve.service';

const contractMetadataRoute: Routes = [
  {
    path: '',
    component: ContractMetadataComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ContractMetadataDetailComponent,
    resolve: {
      contractMetadata: ContractMetadataRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ContractMetadataUpdateComponent,
    resolve: {
      contractMetadata: ContractMetadataRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ContractMetadataUpdateComponent,
    resolve: {
      contractMetadata: ContractMetadataRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(contractMetadataRoute)],
  exports: [RouterModule],
})
export class ContractMetadataRoutingModule {}
