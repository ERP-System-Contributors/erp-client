///
/// Erp System - Mark X No 5 (Jehoiada Series) Client 1.7.3
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
import { SharedModule } from 'app/shared/shared.module';
import { RouAssetNBVReportComponent } from './list/rou-asset-nbv-report.component';
import { RouAssetNBVReportDetailComponent } from './detail/rou-asset-nbv-report-detail.component';
import { RouAssetNBVReportUpdateComponent } from './update/rou-asset-nbv-report-update.component';
import { RouAssetNBVReportDeleteDialogComponent } from './delete/rou-asset-nbv-report-delete-dialog.component';
import { RouAssetNBVReportRoutingModule } from './route/rou-asset-nbv-report-routing.module';

@NgModule({
  imports: [SharedModule, RouAssetNBVReportRoutingModule],
  declarations: [
    RouAssetNBVReportComponent,
    RouAssetNBVReportDetailComponent,
    RouAssetNBVReportUpdateComponent,
    RouAssetNBVReportDeleteDialogComponent,
  ],
  entryComponents: [RouAssetNBVReportDeleteDialogComponent],
})
export class RouAssetNBVReportModule {}
