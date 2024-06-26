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

import { Component, Input, OnInit } from '@angular/core';
import { ILeaseAmortizationCalculation } from '../../../erp-leases/lease-amortization-calculation/lease-amortization-calculation.model';
import { LeaseLiabilityService } from '../../../erp-leases/lease-liability/service/lease-liability.service';

@Component({
  selector: 'jhi-lease-amortization-calculation-option-view',
  template: `
    # {{item.id}} # {{ leaseId }} | No. Of Periods: {{ item.numberOfPeriods }} Periodicity: {{ item.periodicity }} Amount: {{ item.leaseAmount | currency }}
  `
})
export class LeaseAmortizationCalculationOptionViewComponent implements OnInit{

  leaseId = "";

  @Input() item: ILeaseAmortizationCalculation = {};

  constructor(protected leaseLiabilityService: LeaseLiabilityService) {
  }

  ngOnInit(): void {

    this.leaseLiabilityService.find(<number>this.item.leaseLiability?.id).subscribe(lease => {
      if (lease.body) {
        this.leaseId = <string>lease.body.leaseId;
      }
    });
  }

}
