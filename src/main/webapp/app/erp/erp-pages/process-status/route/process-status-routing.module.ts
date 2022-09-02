///
/// Erp System - Mark II No 28 (Baruch Series) Client 0.1.9-SNAPSHOT
/// Copyright © 2021 - 2022 Edwin Njeru (mailnjeru@gmail.com)
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
import { ProcessStatusComponent } from '../list/process-status.component';
import { ProcessStatusDetailComponent } from '../detail/process-status-detail.component';
import { ProcessStatusUpdateComponent } from '../update/process-status-update.component';
import { ProcessStatusRoutingResolveService } from './process-status-routing-resolve.service';

const processStatusRoute: Routes = [
  {
    path: '',
    component: ProcessStatusComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProcessStatusDetailComponent,
    resolve: {
      processStatus: ProcessStatusRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProcessStatusUpdateComponent,
    resolve: {
      processStatus: ProcessStatusRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProcessStatusUpdateComponent,
    resolve: {
      processStatus: ProcessStatusRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(processStatusRoute)],
  exports: [RouterModule],
})
export class ProcessStatusRoutingModule {}
