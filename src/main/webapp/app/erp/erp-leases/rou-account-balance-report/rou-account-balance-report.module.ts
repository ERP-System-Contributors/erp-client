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
import { RouAccountBalanceReportComponent } from './list/rou-account-balance-report.component';
import { RouAccountBalanceReportDetailComponent } from './detail/rou-account-balance-report-detail.component';
import { RouAccountBalanceReportUpdateComponent } from './update/rou-account-balance-report-update.component';
import { RouAccountBalanceReportDeleteDialogComponent } from './delete/rou-account-balance-report-delete-dialog.component';
import { RouAccountBalanceReportRoutingModule } from './route/rou-account-balance-report-routing.module';
import { ErpCommonModule } from '../../erp-common/erp-common.module';

@NgModule({
  imports: [SharedModule, RouAccountBalanceReportRoutingModule, ErpCommonModule],
  declarations: [
    RouAccountBalanceReportComponent,
    RouAccountBalanceReportDetailComponent,
    RouAccountBalanceReportUpdateComponent,
    RouAccountBalanceReportDeleteDialogComponent,
  ],
  entryComponents: [RouAccountBalanceReportDeleteDialogComponent],
})
export class RouAccountBalanceReportModule {}