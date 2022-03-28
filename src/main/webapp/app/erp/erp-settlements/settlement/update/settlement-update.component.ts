import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, finalize, map, switchMap, tap } from 'rxjs/operators';

import { ISettlement, Settlement } from '../settlement.model';
import { SettlementService } from '../service/settlement.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IPlaceholder } from '../../../erp-common/models/placeholder.model';
import { PlaceholderService } from '../../../erp-common/services/placeholder.service';
import { ISettlementCurrency } from 'app/erp/erp-settlements/settlement-currency/settlement-currency.model';
import { SettlementCurrencyService } from 'app/erp/erp-settlements/settlement-currency/service/settlement-currency.service';
import { IPaymentLabel } from '../../../erp-common/models/payment-label.model';
import { PaymentLabelService } from '../../../erp-common/services/payment-label.service';
import { IPaymentCategory } from 'app/erp/erp-settlements/payments/payment-category/payment-category.model';
import { PaymentCategoryService } from 'app/erp/erp-settlements/payments/payment-category/service/payment-category.service';
import { IPaymentInvoice } from 'app/erp/erp-settlements/payment-invoice/payment-invoice.model';
import { PaymentInvoiceService } from 'app/erp/erp-settlements/payment-invoice/service/payment-invoice.service';
import { DealerService } from '../../../erp-common/services/dealer.service';
import { IDealer } from '../../../erp-common/models/dealer.model';
import { IPayment } from '../../../erp-common/models/payment.model';
import { CategorySuggestionService } from '../../../erp-common/suggestion/category-suggestion.service';
import { LabelSuggestionService } from '../../../erp-common/suggestion/label-suggestion.service';
import { PlaceholderSuggestionService } from '../../../erp-common/suggestion/placeholder-suggestion.service';
import { SettlementSuggestionService } from '../../../erp-common/suggestion/settlement-suggestion.service';
import { SettlementCurrencySuggestionService } from '../../../erp-common/suggestion/settlement-currency-suggestion.service';
import { DealerSuggestionService } from '../../../erp-common/suggestion/dealer-suggestion.service';
import { PaymentInvoiceSuggestionService } from '../../../erp-common/suggestion/payment-invoice-suggestion.service';

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

  minAccountLengthTerm = 3;

  placeholdersLoading = false;
  placeholderControlInput$ = new Subject<string>();
  placeholderLookups$: Observable<IPlaceholder[]> = of([]);

  categoriesLoading = false;
  categoryControlInput$ = new Subject<string>();
  categoryLookups$: Observable<IPaymentCategory[]> = of([]);

  labelsLoading = false;
  labelControlInput$ = new Subject<string>();
  labelLookups$: Observable<IPaymentLabel[]> = of([]);

  settlementsLoading = false;
  settlementControlInput$ = new Subject<string>();
  settlementLookups$: Observable<ISettlement[]> = of([]);

  settlementCurrenciesLoading = false;
  settlementCurrencyControlInput$ = new Subject<string>();
  settlementCurrencyLookups$: Observable<ISettlementCurrency[]> = of([]);

  billersLoading = false;
  billersInput$ = new Subject<string>();
  billerLookups$: Observable<IDealer[]> = of([]);

  signatoriesLoading = false;
  signatoryControlInput$ = new Subject<string>();
  signatoryLookups$: Observable<IDealer[]> = of([]);

  paymentInvoicesLoading = false;
  paymentInvoiceControlInput$ = new Subject<string>();
  paymentInvoiceLookups$: Observable<IPaymentInvoice[]> = of([]);

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
    protected categorySuggestionService: CategorySuggestionService,
    protected labelSuggestionService: LabelSuggestionService,
    protected placeholderSuggestionService: PlaceholderSuggestionService,
    protected settlementSuggestionService: SettlementSuggestionService,
    protected settlementCurrencySuggestionService: SettlementCurrencySuggestionService,
    protected dealerSuggestionService: DealerSuggestionService,
    protected paymentInvoiceSuggestionService: PaymentInvoiceSuggestionService,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ settlement }) => {
      this.updateForm(settlement);

      this.loadRelationshipsOptions();
    });

    // fire-up typeahead items
    this.loadLabels();
    this.loadPlaceholders();
    this.loadCategories();
    this.loadSettlements();
    this.loadCurrencies();
    this.loadBillers();
    this.loadSignatories();
    this.loadPaymentInvoices();
  }

  loadPaymentInvoices(): void {
    this.paymentInvoiceLookups$ = concat(
      of([]), // default items
      this.paymentInvoiceControlInput$.pipe(
        /* filter(res => res.length >= this.minAccountLengthTerm), */
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        filter(res => res !== null),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.paymentInvoicesLoading = true),
        switchMap(term => this.paymentInvoiceSuggestionService.search(term).pipe(
          catchError(() => of([])),
          tap(() => this.paymentInvoicesLoading = false)
        ))
      ),
      of([...this.paymentInvoicesSharedCollection])
    );
  }

  loadSignatories(): void {
    this.signatoryLookups$ = concat(
      of([]), // default items
      this.signatoryControlInput$.pipe(
        /* filter(res => res.length >= this.minAccountLengthTerm), */
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        filter(res => res !== null),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.signatoriesLoading = true),
        switchMap(term => this.dealerSuggestionService.search(term).pipe(
          catchError(() => of([])),
          tap(() => this.signatoriesLoading = false)
        ))
      ),
      of([...this.dealersSharedCollection])
    );
  }

  loadBillers(): void {
    this.billerLookups$ = concat(
      of([]), // default items
      this.billersInput$.pipe(
        /* filter(res => res.length >= this.minAccountLengthTerm), */
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        filter(res => res !== null),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.billersLoading = true),
        switchMap(term => this.dealerSuggestionService.search(term).pipe(
          catchError(() => of([])),
          tap(() => this.billersLoading = false)
        ))
      ),
      of([...this.dealersSharedCollection])
    );
  }

  loadCurrencies(): void {
    this.settlementCurrencyLookups$ = concat(
      of([]), // default items
      this.settlementCurrencyControlInput$.pipe(
        /* filter(res => res.length >= this.minAccountLengthTerm), */
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        filter(res => res !== null),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.settlementCurrenciesLoading = true),
        switchMap(term => this.settlementCurrencySuggestionService.search(term).pipe(
          catchError(() => of([])),
          tap(() => this.settlementCurrenciesLoading = false)
        ))
      ),
      of([...this.settlementCurrenciesSharedCollection])
    );
  }

  loadCategories(): void {
    this.categoryLookups$ = concat(
      of([]), // default items
      this.categoryControlInput$.pipe(
        /* filter(res => res.length >= this.minAccountLengthTerm), */
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        filter(res => res !== null),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.categoriesLoading = true),
        switchMap(term => this.categorySuggestionService.search(term).pipe(
          catchError(() => of([])),
          tap(() => this.categoriesLoading = false)
        ))
      ),
      of([...this.paymentCategoriesSharedCollection])
    );
  }

  loadLabels(): void {
    this.labelLookups$ = concat(
      of([]), // default items
      this.labelControlInput$.pipe(
        /* filter(res => res.length >= this.minAccountLengthTerm), */
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        filter(res => res !== null),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.labelsLoading = true),
        switchMap(term => this.labelSuggestionService.search(term).pipe(
          catchError(() => of([])),
          tap(() => this.labelsLoading = false)
        ))
      ),
      of([...this.paymentLabelsSharedCollection])
    );
  }

  loadPlaceholders(): void {
    this.placeholderLookups$ = concat(
      of([]), // default items
      this.placeholderControlInput$.pipe(
        /* filter(res => res.length >= this.minAccountLengthTerm), */
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        filter(res => res !== null),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.placeholdersLoading = true),
        switchMap(term => this.placeholderSuggestionService.search(term).pipe(
          catchError(() => of([])),
          tap(() => this.placeholdersLoading = false)
        ))
      ),
      of([...this.placeholdersSharedCollection])
    );
  }

  loadSettlements(): void {
    this.settlementLookups$ = concat(
      of([]), // default items
      this.settlementControlInput$.pipe(
        /* filter(res => res.length >= this.minAccountLengthTerm), */
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        filter(res => res !== null),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.settlementsLoading = true),
        switchMap(term => this.settlementSuggestionService.search(term).pipe(
          catchError(() => of([])),
          tap(() => this.settlementsLoading = false)
        ))
      ),
      of([...this.settlementsSharedCollection])
    );
  }

  trackPaymentInvoiceByFn(item: IPaymentInvoice): number {
    return item.id!;
  }

  trackBillerByFn(item: IDealer): number {
    return item.id!;
  }

  trackCurrencyByFn(item: ISettlementCurrency): number {
    return item.id!;
  }

  trackPaymentByFn(item: IPayment): number {
    return item.id!;
  }

  trackPlaceholdersByFn(item: IPaymentLabel): number {
    return item.id!;
  }

  trackCategoryByFn(item: IPaymentCategory): number {
    return item.id!;
  }

  trackLabelByFn(item: IPaymentLabel): number {
    return item.id!;
  }


  trackSettlementByFn(item: ISettlement): number {
    return item.id!;
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

  trackPlaceholderById(index: number, item: IPlaceholder): number {
    return item.id!;
  }

  trackSettlementCurrencyById(index: number, item: ISettlementCurrency): number {
    return item.id!;
  }

  trackPaymentLabelById(index: number, item: IPaymentLabel): number {
    return item.id!;
  }

  trackPaymentCategoryById(index: number, item: IPaymentCategory): number {
    return item.id!;
  }

  trackSettlementById(index: number, item: ISettlement): number {
    return item.id!;
  }

  trackDealerById(index: number, item: IDealer): number {
    return item.id!;
  }

  trackPaymentInvoiceById(index: number, item: IPaymentInvoice): number {
    return item.id!;
  }

  getSelectedPlaceholder(option: IPlaceholder, selectedVals?: IPlaceholder[]): IPlaceholder {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  getSelectedPaymentLabel(option: IPaymentLabel, selectedVals?: IPaymentLabel[]): IPaymentLabel {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  getSelectedDealer(option: IDealer, selectedVals?: IDealer[]): IDealer {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  getSelectedPaymentInvoice(option: IPaymentInvoice, selectedVals?: IPaymentInvoice[]): IPaymentInvoice {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
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
