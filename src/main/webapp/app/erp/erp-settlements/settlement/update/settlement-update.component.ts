///
/// Erp System - Mark III No 7 (Caleb Series) Client 0.8.0
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

import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map,} from 'rxjs/operators';

import { ISettlement, Settlement } from '../settlement.model';
import { SettlementService } from '../service/settlement.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IPlaceholder } from '../../../erp-pages/placeholder/placeholder.model';
import { PlaceholderService } from '../../../erp-pages/placeholder/service/placeholder.service';
import { ISettlementCurrency } from 'app/erp/erp-settlements/settlement-currency/settlement-currency.model';
import { SettlementCurrencyService } from 'app/erp/erp-settlements/settlement-currency/service/settlement-currency.service';
import { IPaymentLabel } from '../../../erp-pages/payment-label/payment-label.model';
import { PaymentLabelService } from '../../../erp-pages/payment-label/service/payment-label.service';
import { IPaymentCategory } from 'app/erp/erp-settlements/payments/payment-category/payment-category.model';
import { PaymentCategoryService } from 'app/erp/erp-settlements/payments/payment-category/service/payment-category.service';
import { IPaymentInvoice } from 'app/erp/erp-settlements/payment-invoice/payment-invoice.model';
import { PaymentInvoiceService } from 'app/erp/erp-settlements/payment-invoice/service/payment-invoice.service';
import { DealerService } from '../../../erp-pages/dealers/dealer/service/dealer.service';
import { IDealer } from '../../../erp-pages/dealers/dealer/dealer.model';
import { SearchWithPagination } from '../../../../core/request/request.model';
import { UniversallyUniqueMappingService } from '../../../erp-pages/universally-unique-mapping/service/universally-unique-mapping.service';
import * as dayjs from 'dayjs';
import { PaymentCalculatorService } from '../service/payment-calculator.service';

@Component({
  selector: 'jhi-settlement-update',
  templateUrl: './settlement-update.component.html',
})
export class SettlementUpdateComponent implements OnInit {
  isSaving = false;

  placeholdersSharedCollection: IPlaceholder[] = [];
  settlementCurrenciesSharedCollection: ISettlementCurrency[] = [];
  paymentLabelsSharedCollection: IPaymentLabel[] = [];
  paymentCategoriesSharedCollection: IPaymentCategory[] = [];
  settlementsSharedCollection: ISettlement[] = [];
  dealersSharedCollection: IDealer[] = [];
  paymentInvoicesSharedCollection: IPaymentInvoice[] = [];

  editForm = this.fb.group({
    id: [],
    paymentNumber: [],
    paymentDate: [],
    paymentAmount: [],
    description: [],
    notes: [],
    calculationFile: [],
    calculationFileContentType: [],
    remarks: [],
    fileUploadToken: [],
    compilationToken: [],
    placeholders: [],
    settlementCurrency: [null, Validators.required],
    paymentLabels: [],
    paymentCategory: [null, Validators.required],
    groupSettlement: [],
    biller: [null, Validators.required],
    paymentInvoices: [],
    signatories: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected settlementService: SettlementService,
    protected placeholderService: PlaceholderService,
    protected settlementCurrencyService: SettlementCurrencyService,
    protected paymentLabelService: PaymentLabelService,
    protected paymentCategoryService: PaymentCategoryService,
    protected dealerService: DealerService,
    protected paymentInvoiceService: PaymentInvoiceService,
    protected activatedRoute: ActivatedRoute,
    protected universallyUniqueMappingService: UniversallyUniqueMappingService,
    protected paymentCalculatorService: PaymentCalculatorService,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ settlement }) => {
      if (settlement.id) {
        this.updateForm(settlement);
      } else  {
        this.editForm.patchValue({
          paymentDate: dayjs().startOf('day')
        });
      }
      this.loadRelationshipsOptions();
    });

    this.updatePreferredCurrency();
    this.updatePreferredCategory();
    this.updatePreferredSignatories();
    this.updatePreferredPaymentLabels();
    this.updatePreferredBillerGivenInvoice();
    this.updatePreferredPaymentAmountGivenInvoice();
    this.updatePreferredCurrencyGivenInvoice();
    this.updatePreferredPaymentLabelsGivenInvoice();
    this.updatePaymentAmountGivenPaymentCategory();
    this.updateDescriptionGivenInvoicePurchaseOrder();
  }

  updatePreferredCurrency(): void {
    if (this.editForm.get(['id'])?.value === null ) {
    this.universallyUniqueMappingService.findMap("globallyPreferredSettlementIso4217CurrencyCode")
      .subscribe(mapped => {
          this.settlementCurrencyService.search(<SearchWithPagination>{ page: 0, size: 0, sort: [], query: mapped.body?.mappedValue })
            .subscribe(({ body: currencies }) => {
              if (currencies) {
                this.editForm.get(['settlementCurrency'])?.setValue(currencies[0]);
              }
            });
        }
      );
    }
  }

  updatePreferredCategory(): void {
    if (this.editForm.get(['id'])?.value === null ) {
    this.universallyUniqueMappingService.findMap("globallyPreferredSettlementUpdatePaymentCategoryName")
      .subscribe((mapped) => {
          this.paymentCategoryService.search(<SearchWithPagination>{ page: 0, size: 0, sort: [], query: mapped.body?.mappedValue })
            .subscribe(({ body: categories }) => {
              if (categories) {
                this.editForm.get(['paymentCategory'])?.setValue(categories[0]);
              }
            });
      });
    }
  }

  updatePreferredSignatories(): void {
    if (this.editForm.get(['id'])?.value === null ) {
    this.universallyUniqueMappingService.findMap("globallyPreferredSettlementUpdateSignatoryName")
      .subscribe((mapped) => {
          this.dealerService.search(<SearchWithPagination>{ page: 0, size: 0, sort: [], query: mapped.body?.mappedValue })
            .subscribe(({ body: vals }) => {
              if (vals) {
                this.editForm.get(['signatories'])?.valueChanges.subscribe((signatories) => {
                  const p_signatories: IDealer[] = [];
                  signatories.forEach((sign: IDealer) => {
                    p_signatories.push(sign);
                  })
                  this.editForm.get(['signatories'])?.setValue(p_signatories)
                });
              }
            });
      });
    }
  }

  updatePreferredBillerGivenInvoice(): void {
    if (this.editForm.get(['id'])?.value === null ) {
      this.editForm.get(['paymentInvoices'])?.valueChanges.subscribe((invoices) => {
        const p_dealers: IDealer[] = [];
        invoices.forEach((inv: { biller: IDealer; }) => {
          p_dealers.push(inv.biller);
        })
        this.editForm.get(['biller'])?.setValue(p_dealers[0])
      });
    }
  }

  updatePreferredCurrencyGivenInvoice(): void {
    if (this.editForm.get(['id'])?.value === null ) {
      this.editForm.get(['paymentInvoices'])?.valueChanges.subscribe((invoices) => {
        const p_crn: ISettlementCurrency[] = [];
        invoices.forEach((inv: { settlementCurrency: ISettlementCurrency; }) => {
          p_crn.push(inv.settlementCurrency);
        })
        this.editForm.get(['settlementCurrency'])?.setValue(p_crn[0])
      });
    }
  }

  updateDescriptionGivenInvoicePurchaseOrder(): void {
    if (this.editForm.get(['id'])?.value === null ) {
      this.editForm.get(['paymentInvoices'])?.valueChanges.subscribe((invoices) => {
        const description = invoices[0].purchaseOrder.description;

        this.editForm.patchValue({
          description,
          remarks: description,
        })

      });
    }
  }

  updatePreferredPaymentLabelsGivenInvoice(): void {
    if (this.editForm.get(['id'])?.value === null ) {
      this.editForm.get(['paymentInvoices'])?.valueChanges.subscribe((invoices) => {
        const p_labels: IPaymentLabel[] = [];
        invoices.forEach((inv: { paymentLabels: IPaymentLabel[]; }) => {
          p_labels.push(...inv.paymentLabels);
        });
        const labels = [...this.editForm.get(['paymentLabels'])?.value, ...p_labels];
        this.editForm.get(['paymentLabels'])?.setValue(labels)
      });
    }
  }

  updatePreferredPaymentAmountGivenInvoice(): void {
    if (this.editForm.get(['id'])?.value === null ) {
      this.editForm.get(['paymentInvoices'])?.valueChanges.subscribe((invoices) => {
        let settlementAmount = 0;
        invoices.forEach(({ invoiceAmount }: IPaymentInvoice) => {
          settlementAmount += invoiceAmount ?? 0;
        })

        this.paymentCalculatorService.calculatePayableAmount(settlementAmount, this.editForm.get(['paymentCategory'])?.value)
          .subscribe(calculatedAmount => {
            this.editForm.patchValue({ paymentAmount: calculatedAmount })
          });
      });
    }
  }

  updatePaymentAmountGivenPaymentCategory(): void {
    if (this.editForm.get(['id'])?.value === null ) {
      this.editForm.get(['paymentCategory'])?.valueChanges.subscribe(cat => {

        let settlementAmount = 0;
        this.editForm.get(['paymentInvoices'])?.value.forEach(({ invoiceAmount }: IPaymentInvoice) => {
          settlementAmount += invoiceAmount ?? 0;
        })

        this.paymentCalculatorService.calculatePayableAmount(settlementAmount, cat)
          .subscribe(calculatedAmount => {
            this.editForm.patchValue({ paymentAmount: calculatedAmount })
          });
      });
    }
  }

  updatePreferredPaymentLabels(): void {
    if (this.editForm.get(['id'])?.value === null ) {
      this.universallyUniqueMappingService.findMap("globallyPreferredSettlementUpdatePaymentLabel")
        .subscribe((mapped) => {
          this.paymentLabelService.search(<SearchWithPagination>{ page: 0, size: 0, sort: [], query: mapped.body?.mappedValue })
            .subscribe(({ body: vals }) => {
              if (vals) {
                this.editForm.patchValue({
                  paymentLabels: [...vals]
                });
              }
            });
        });
    }
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  updateDealer(dealerUpdate: IDealer): void {
    this.editForm.patchValue({
      biller: dealerUpdate,
    });
  }

  updateSignatories(dealerUpdate: IDealer[]): void {
    this.editForm.patchValue({
      signatories: [...dealerUpdate]
    });
  }

  updatePlaceholders(update: IPlaceholder[]): void {
    this.editForm.patchValue({
      placeholders: [...update]
    });
  }

  updatePaymentLabels(update: IPaymentLabel[]): void {
    this.editForm.patchValue({
      paymentLabels: [...update]
    });
  }

  updateSettlementGroup(update: ISettlement): void {
    this.editForm.patchValue({
      groupSettlement: update
    });
  }

  updateCurrencies(update: ISettlementCurrency): void {
    this.editForm.patchValue({
      settlementCurrency: update
    });
  }

  updatePaymentCategory(update: IPaymentCategory): void {
    this.editForm.patchValue({
      paymentCategory: update
    });
  }

  updatePaymentInvoices(update: IPaymentInvoice[]): void {
    this.editForm.patchValue({
      paymentInvoices: update
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('erpSystemApp.error', { message: err.message })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const settlement = this.createFromForm();
    if (settlement.id !== undefined) {
      this.subscribeToSaveResponse(this.settlementService.update(settlement));
    } else {
      this.subscribeToSaveResponse(this.settlementService.create(settlement));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISettlement>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(settlement: ISettlement): void {
    this.editForm.patchValue({
      id: settlement.id,
      paymentNumber: settlement.paymentNumber,
      paymentDate: settlement.paymentDate,
      paymentAmount: settlement.paymentAmount,
      description: settlement.description,
      notes: settlement.notes,
      remarks: settlement.remarks,
      calculationFile: settlement.calculationFile,
      calculationFileContentType: settlement.calculationFileContentType,
      fileUploadToken: settlement.fileUploadToken,
      compilationToken: settlement.compilationToken,
      placeholders: settlement.placeholders,
      settlementCurrency: settlement.settlementCurrency,
      paymentLabels: settlement.paymentLabels,
      paymentCategory: settlement.paymentCategory,
      groupSettlement: settlement.groupSettlement,
      biller: settlement.biller,
      paymentInvoices: settlement.paymentInvoices,
      signatories: settlement.signatories,
    });

    this.placeholdersSharedCollection = this.placeholderService.addPlaceholderToCollectionIfMissing(
      this.placeholdersSharedCollection,
      ...(settlement.placeholders ?? [])
    );
    this.settlementCurrenciesSharedCollection = this.settlementCurrencyService.addSettlementCurrencyToCollectionIfMissing(
      this.settlementCurrenciesSharedCollection,
      settlement.settlementCurrency
    );
    this.paymentLabelsSharedCollection = this.paymentLabelService.addPaymentLabelToCollectionIfMissing(
      this.paymentLabelsSharedCollection,
      ...(settlement.paymentLabels ?? [])
    );
    this.paymentCategoriesSharedCollection = this.paymentCategoryService.addPaymentCategoryToCollectionIfMissing(
      this.paymentCategoriesSharedCollection,
      settlement.paymentCategory
    );
    this.settlementsSharedCollection = this.settlementService.addSettlementToCollectionIfMissing(
      this.settlementsSharedCollection,
      settlement.groupSettlement
    );
    this.dealersSharedCollection = this.dealerService.addDealerToCollectionIfMissing(
      this.dealersSharedCollection,
      settlement.biller,
      ...(settlement.signatories ?? [])
    );
    this.paymentInvoicesSharedCollection = this.paymentInvoiceService.addPaymentInvoiceToCollectionIfMissing(
      this.paymentInvoicesSharedCollection,
      ...(settlement.paymentInvoices ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.placeholderService
      .query()
      .pipe(map((res: HttpResponse<IPlaceholder[]>) => res.body ?? []))
      .pipe(
        map((placeholders: IPlaceholder[]) =>
          this.placeholderService.addPlaceholderToCollectionIfMissing(placeholders, ...(this.editForm.get('placeholders')!.value ?? []))
        )
      )
      .subscribe((placeholders: IPlaceholder[]) => (this.placeholdersSharedCollection = placeholders));

    this.settlementCurrencyService
      .query()
      .pipe(map((res: HttpResponse<ISettlementCurrency[]>) => res.body ?? []))
      .pipe(
        map((settlementCurrencies: ISettlementCurrency[]) =>
          this.settlementCurrencyService.addSettlementCurrencyToCollectionIfMissing(
            settlementCurrencies,
            this.editForm.get('settlementCurrency')!.value
          )
        )
      )
      .subscribe((settlementCurrencies: ISettlementCurrency[]) => (this.settlementCurrenciesSharedCollection = settlementCurrencies));

    this.paymentLabelService
      .query()
      .pipe(map((res: HttpResponse<IPaymentLabel[]>) => res.body ?? []))
      .pipe(
        map((paymentLabels: IPaymentLabel[]) =>
          this.paymentLabelService.addPaymentLabelToCollectionIfMissing(paymentLabels, ...(this.editForm.get('paymentLabels')!.value ?? []))
        )
      )
      .subscribe((paymentLabels: IPaymentLabel[]) => (this.paymentLabelsSharedCollection = paymentLabels));

    this.paymentCategoryService
      .query()
      .pipe(map((res: HttpResponse<IPaymentCategory[]>) => res.body ?? []))
      .pipe(
        map((paymentCategories: IPaymentCategory[]) =>
          this.paymentCategoryService.addPaymentCategoryToCollectionIfMissing(
            paymentCategories,
            this.editForm.get('paymentCategory')!.value
          )
        )
      )
      .subscribe((paymentCategories: IPaymentCategory[]) => (this.paymentCategoriesSharedCollection = paymentCategories));

    this.settlementService
      .query()
      .pipe(map((res: HttpResponse<ISettlement[]>) => res.body ?? []))
      .pipe(
        map((settlements: ISettlement[]) =>
          this.settlementService.addSettlementToCollectionIfMissing(settlements, this.editForm.get('groupSettlement')!.value)
        )
      )
      .subscribe((settlements: ISettlement[]) => (this.settlementsSharedCollection = settlements));

    this.dealerService
      .query()
      .pipe(map((res: HttpResponse<IDealer[]>) => res.body ?? []))
      .pipe(
        map((dealers: IDealer[]) =>
          this.dealerService.addDealerToCollectionIfMissing(
            dealers,
            this.editForm.get('biller')!.value,
            ...(this.editForm.get('signatories')!.value ?? [])
          )
        )
      )
      .subscribe((dealers: IDealer[]) => (this.dealersSharedCollection = dealers));

    this.paymentInvoiceService
      .query()
      .pipe(map((res: HttpResponse<IPaymentInvoice[]>) => res.body ?? []))
      .pipe(
        map((paymentInvoices: IPaymentInvoice[]) =>
          this.paymentInvoiceService.addPaymentInvoiceToCollectionIfMissing(
            paymentInvoices,
            ...(this.editForm.get('paymentInvoices')!.value ?? [])
          )
        )
      )
      .subscribe((paymentInvoices: IPaymentInvoice[]) => (this.paymentInvoicesSharedCollection = paymentInvoices));
  }

  protected createFromForm(): ISettlement {
    return {
      ...new Settlement(),
      id: this.editForm.get(['id'])!.value,
      paymentNumber: this.editForm.get(['paymentNumber'])!.value,
      paymentDate: this.editForm.get(['paymentDate'])!.value,
      paymentAmount: this.editForm.get(['paymentAmount'])!.value,
      description: this.editForm.get(['description'])!.value,
      notes: this.editForm.get(['notes'])!.value,
      remarks: this.editForm.get(['remarks'])!.value,
      calculationFileContentType: this.editForm.get(['calculationFileContentType'])!.value,
      calculationFile: this.editForm.get(['calculationFile'])!.value,
      fileUploadToken: this.editForm.get(['fileUploadToken'])!.value,
      compilationToken: this.editForm.get(['compilationToken'])!.value,
      placeholders: this.editForm.get(['placeholders'])!.value,
      settlementCurrency: this.editForm.get(['settlementCurrency'])!.value,
      paymentLabels: this.editForm.get(['paymentLabels'])!.value,
      paymentCategory: this.editForm.get(['paymentCategory'])!.value,
      groupSettlement: this.editForm.get(['groupSettlement'])!.value,
      biller: this.editForm.get(['biller'])!.value,
      paymentInvoices: this.editForm.get(['paymentInvoices'])!.value,
      signatories: this.editForm.get(['signatories'])!.value,
    };
  }
}
