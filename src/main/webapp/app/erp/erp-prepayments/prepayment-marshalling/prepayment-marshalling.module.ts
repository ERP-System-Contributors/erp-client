///
/// Erp System - Mark VIII No 2 (Hilkiah Series) Client 1.6.1
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
import { PrepaymentMarshallingComponent } from './list/prepayment-marshalling.component';
import { PrepaymentMarshallingDetailComponent } from './detail/prepayment-marshalling-detail.component';
import { PrepaymentMarshallingUpdateComponent } from './update/prepayment-marshalling-update.component';
import { PrepaymentMarshallingDeleteDialogComponent } from './delete/prepayment-marshalling-delete-dialog.component';
import { PrepaymentMarshallingRoutingModule } from './route/prepayment-marshalling-routing.module';
import { ErpCommonModule } from '../../erp-common/erp-common.module';

@NgModule({
  imports: [SharedModule, PrepaymentMarshallingRoutingModule, ErpCommonModule],
  declarations: [
    PrepaymentMarshallingComponent,
    PrepaymentMarshallingDetailComponent,
    PrepaymentMarshallingUpdateComponent,
    PrepaymentMarshallingDeleteDialogComponent,
  ],
  entryComponents: [PrepaymentMarshallingDeleteDialogComponent],
})
export class PrepaymentMarshallingModule {}
