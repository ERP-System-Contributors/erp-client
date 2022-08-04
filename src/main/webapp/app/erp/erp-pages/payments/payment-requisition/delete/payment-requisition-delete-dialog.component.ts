import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { PaymentRequisitionService } from '../service/payment-requisition.service';
import { IPaymentRequisition } from '../payment-requisition.model';

@Component({
  templateUrl: './payment-requisition-delete-dialog.component.html',
})
export class PaymentRequisitionDeleteDialogComponent {
  paymentRequisition?: IPaymentRequisition;

  constructor(protected paymentRequisitionService: PaymentRequisitionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.paymentRequisitionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
