///
/// Erp System - Mark III No 1 (Caleb Series) Client 0.1.9-SNAPSHOT
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
import { SharedModule } from 'app/shared/shared.module';
import { PaymentInvoiceComponent } from './list/payment-invoice.component';
import { PaymentInvoiceDetailComponent } from './detail/payment-invoice-detail.component';
import { PaymentInvoiceUpdateComponent } from './update/payment-invoice-update.component';
import { PaymentInvoiceDeleteDialogComponent } from './delete/payment-invoice-delete-dialog.component';
import { PaymentInvoiceRoutingModule } from './route/payment-invoice-routing.module';
import { ErpCommonModule } from '../../erp-common/erp-common.module';

@NgModule({
  imports: [SharedModule, PaymentInvoiceRoutingModule, ErpCommonModule],
  declarations: [
    PaymentInvoiceComponent,
    PaymentInvoiceDetailComponent,
    PaymentInvoiceUpdateComponent,
    PaymentInvoiceDeleteDialogComponent,
  ],
  entryComponents: [PaymentInvoiceDeleteDialogComponent],
})
export class PaymentInvoiceModule {}
