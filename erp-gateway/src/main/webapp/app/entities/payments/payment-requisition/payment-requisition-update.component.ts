import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IPaymentRequisition, PaymentRequisition } from 'app/shared/model/payments/payment-requisition.model';
import { PaymentRequisitionService } from './payment-requisition.service';

@Component({
  selector: 'jhi-payment-requisition-update',
  templateUrl: './payment-requisition-update.component.html',
})
export class PaymentRequisitionUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    dealerName: [],
    invoicedAmount: [],
    disbursementCost: [],
    vatableAmount: [],
  });

  constructor(
    protected paymentRequisitionService: PaymentRequisitionService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paymentRequisition }) => {
      this.updateForm(paymentRequisition);
    });
  }

  updateForm(paymentRequisition: IPaymentRequisition): void {
    this.editForm.patchValue({
      id: paymentRequisition.id,
      dealerName: paymentRequisition.dealerName,
      invoicedAmount: paymentRequisition.invoicedAmount,
      disbursementCost: paymentRequisition.disbursementCost,
      vatableAmount: paymentRequisition.vatableAmount,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const paymentRequisition = this.createFromForm();
    if (paymentRequisition.id !== undefined) {
      this.subscribeToSaveResponse(this.paymentRequisitionService.update(paymentRequisition));
    } else {
      this.subscribeToSaveResponse(this.paymentRequisitionService.create(paymentRequisition));
    }
  }

  private createFromForm(): IPaymentRequisition {
    return {
      ...new PaymentRequisition(),
      id: this.editForm.get(['id'])!.value,
      dealerName: this.editForm.get(['dealerName'])!.value,
      invoicedAmount: this.editForm.get(['invoicedAmount'])!.value,
      disbursementCost: this.editForm.get(['disbursementCost'])!.value,
      vatableAmount: this.editForm.get(['vatableAmount'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPaymentRequisition>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }
}
