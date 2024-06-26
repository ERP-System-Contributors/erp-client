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
import { ActivatedRoute } from '@angular/router';

import { ILeaseAmortizationCalculation } from '../lease-amortization-calculation.model';
import { Store } from '@ngrx/store';
import { State } from '../../../store/global-store.definition';
import {
  leaseAmortizationCalculationCopyWorkflowInitiatedFromView,
  leaseAmortizationCalculationEditWorkflowInitiatedFromView
} from '../../../store/actions/lease-amortization-calculation.actions';

@Component({
  selector: 'jhi-lease-amortization-calculation-detail',
  templateUrl: './lease-amortization-calculation-detail.component.html',
})
export class LeaseAmortizationCalculationDetailComponent implements OnInit {
  leaseAmortizationCalculation: ILeaseAmortizationCalculation | null = null;

  constructor(protected activatedRoute: ActivatedRoute, protected store: Store<State>) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ leaseAmortizationCalculation }) => {
      this.leaseAmortizationCalculation = leaseAmortizationCalculation;
    });
  }

  editButtonEvent(instance: ILeaseAmortizationCalculation): void {
    this.store.dispatch(leaseAmortizationCalculationEditWorkflowInitiatedFromView({editedInstance: instance}))
  }

  copyButtonEvent(instance: ILeaseAmortizationCalculation): void {
    this.store.dispatch(leaseAmortizationCalculationCopyWorkflowInitiatedFromView({copiedInstance: instance}))
  }

  previousState(): void {
    window.history.back();
  }
}
