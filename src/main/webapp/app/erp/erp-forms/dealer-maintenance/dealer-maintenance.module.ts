///
/// Erp System - Mark III No 3 (Caleb Series) Client 0.2.0-SNAPSHOT
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
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErpMaterialModule } from '../../../erp-material.module';
import { UserRouteAccessService } from '../../../core/auth/user-route-access.service';
import { RouterModule, Routes } from '@angular/router';
import { DealerMaintenanceFormComponent } from './dealer-maintenance-form.component';
import { ErpCommonModule } from '../../erp-common/erp-common.module';

const dealerMaintenanceRoute: Routes = [
  {
    path: 'dealer-maintenance',
    component: DealerMaintenanceFormComponent,
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [
    DealerMaintenanceFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ErpMaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild(dealerMaintenanceRoute),
    ErpCommonModule
  ]
})
export class DealerMaintenanceModule {}
