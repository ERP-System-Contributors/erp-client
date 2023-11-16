///
/// Erp System - Mark VII No 5 (Gideon Series) Client 1.5.8
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
import { DepreciationJobNoticeComponent } from './list/depreciation-job-notice.component';
import { DepreciationJobNoticeDetailComponent } from './detail/depreciation-job-notice-detail.component';
import { DepreciationJobNoticeUpdateComponent } from './update/depreciation-job-notice-update.component';
import { DepreciationJobNoticeDeleteDialogComponent } from './delete/depreciation-job-notice-delete-dialog.component';
import { DepreciationJobNoticeRoutingModule } from './route/depreciation-job-notice-routing.module';

@NgModule({
  imports: [SharedModule, DepreciationJobNoticeRoutingModule],
  declarations: [
    DepreciationJobNoticeComponent,
    DepreciationJobNoticeDetailComponent,
    DepreciationJobNoticeUpdateComponent,
    DepreciationJobNoticeDeleteDialogComponent,
  ],
  entryComponents: [DepreciationJobNoticeDeleteDialogComponent],
})
export class DepreciationJobNoticeModule {}
