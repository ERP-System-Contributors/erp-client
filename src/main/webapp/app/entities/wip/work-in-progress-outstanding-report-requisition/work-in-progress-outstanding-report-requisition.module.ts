///
/// Erp System - Mark X No 8 (Jehoiada Series) Client 1.7.6
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
import { WorkInProgressOutstandingReportRequisitionComponent } from './list/work-in-progress-outstanding-report-requisition.component';
import { WorkInProgressOutstandingReportRequisitionDetailComponent } from './detail/work-in-progress-outstanding-report-requisition-detail.component';
import { WorkInProgressOutstandingReportRequisitionUpdateComponent } from './update/work-in-progress-outstanding-report-requisition-update.component';
import { WorkInProgressOutstandingReportRequisitionDeleteDialogComponent } from './delete/work-in-progress-outstanding-report-requisition-delete-dialog.component';
import { WorkInProgressOutstandingReportRequisitionRoutingModule } from './route/work-in-progress-outstanding-report-requisition-routing.module';

@NgModule({
  imports: [SharedModule, WorkInProgressOutstandingReportRequisitionRoutingModule],
  declarations: [
    WorkInProgressOutstandingReportRequisitionComponent,
    WorkInProgressOutstandingReportRequisitionDetailComponent,
    WorkInProgressOutstandingReportRequisitionUpdateComponent,
    WorkInProgressOutstandingReportRequisitionDeleteDialogComponent,
  ],
  entryComponents: [WorkInProgressOutstandingReportRequisitionDeleteDialogComponent],
})
export class WorkInProgressOutstandingReportRequisitionModule {}