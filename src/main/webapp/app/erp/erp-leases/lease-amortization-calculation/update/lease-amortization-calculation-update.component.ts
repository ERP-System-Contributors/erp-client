///
/// Erp System - Mark X No 9 (Jehoiada Series) Client 1.7.7
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

import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ILeaseAmortizationCalculation, LeaseAmortizationCalculation } from '../lease-amortization-calculation.model';
import { LeaseAmortizationCalculationService } from '../service/lease-amortization-calculation.service';
import { IIFRS16LeaseContract } from '../../ifrs-16-lease-contract/ifrs-16-lease-contract.model';
import { IFRS16LeaseContractService } from '../../ifrs-16-lease-contract/service/ifrs-16-lease-contract.service';

@Component({
  selector: 'jhi-lease-amortization-calculation-update',
  templateUrl: './lease-amortization-calculation-update.component.html',
})
export class LeaseAmortizationCalculationUpdateComponent implements OnInit {
  isSaving = false;

  iFRS16LeaseContractsCollection: IIFRS16LeaseContract[] = [];

  editForm = this.fb.group({
    id: [],
    interestRate: [],
    periodicity: [],
    leaseAmount: [],
    numberOfPeriods: [],
    leaseContract: [null, Validators.required],
  });

  constructor(
    protected leaseAmortizationCalculationService: LeaseAmortizationCalculationService,
    protected iFRS16LeaseContractService: IFRS16LeaseContractService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ leaseAmortizationCalculation }) => {
      this.updateForm(leaseAmortizationCalculation);
    });

    this.updateDetailsGivenTransferSettlement();
  }

  updateDetailsGivenTransferSettlement(): void {
    this.editForm.get(['leaseContract'])?.valueChanges.subscribe((leaseContractChange) => {
      this.iFRS16LeaseContractService.find(leaseContractChange.id).subscribe((ifrs16Response) => {
        if (ifrs16Response.body) {
          const ifrs16 = ifrs16Response.body;

          this.editForm.patchValue({

          });
        }
      });
    });
  }

  updateIFRS16LeaseContract(value: IIFRS16LeaseContract): void {
    this.editForm.patchValue({
      leaseContract: value
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const leaseAmortizationCalculation = this.createFromForm();
    if (leaseAmortizationCalculation.id !== undefined) {
      this.subscribeToSaveResponse(this.leaseAmortizationCalculationService.update(leaseAmortizationCalculation));
    } else {
      this.subscribeToSaveResponse(this.leaseAmortizationCalculationService.create(leaseAmortizationCalculation));
    }
  }

  trackIFRS16LeaseContractById(index: number, item: IIFRS16LeaseContract): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILeaseAmortizationCalculation>>): void {
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

  protected updateForm(leaseAmortizationCalculation: ILeaseAmortizationCalculation): void {
    this.editForm.patchValue({
      id: leaseAmortizationCalculation.id,
      interestRate: leaseAmortizationCalculation.interestRate,
      periodicity: leaseAmortizationCalculation.periodicity,
      leaseAmount: leaseAmortizationCalculation.leaseAmount,
      numberOfPeriods: leaseAmortizationCalculation.numberOfPeriods,
      leaseContract: leaseAmortizationCalculation.leaseContract,
    });

  }

  protected createFromForm(): ILeaseAmortizationCalculation {
    return {
    ...new LeaseAmortizationCalculation(),
        id: this.editForm.get(['id'])!.value,
        interestRate: this.editForm.get(['interestRate'])!.value,
        periodicity: this.editForm.get(['periodicity'])!.value,
        leaseAmount: this.editForm.get(['leaseAmount'])!.value,
        numberOfPeriods: this.editForm.get(['numberOfPeriods'])!.value,
        leaseContract: this.editForm.get(['leaseContract'])!.value,
    };
  }
}
