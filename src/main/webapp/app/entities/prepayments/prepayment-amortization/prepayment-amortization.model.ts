///
/// Erp System - Mark V No 1 (Ehud Series) Client 1.4.2
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

import * as dayjs from 'dayjs';
import { IPrepaymentAccount } from 'app/entities/prepayments/prepayment-account/prepayment-account.model';
import { ISettlementCurrency } from 'app/entities/settlement/settlement-currency/settlement-currency.model';
import { ITransactionAccount } from 'app/entities/accounting/transaction-account/transaction-account.model';
import { IPlaceholder } from 'app/entities/system/placeholder/placeholder.model';

export interface IPrepaymentAmortization {
  id?: number;
  description?: string | null;
  prepaymentPeriod?: dayjs.Dayjs | null;
  prepaymentAmount?: number | null;
  inactive?: boolean | null;
  prepaymentAccount?: IPrepaymentAccount | null;
  settlementCurrency?: ISettlementCurrency | null;
  debitAccount?: ITransactionAccount | null;
  creditAccount?: ITransactionAccount | null;
  placeholders?: IPlaceholder[] | null;
}

export class PrepaymentAmortization implements IPrepaymentAmortization {
  constructor(
    public id?: number,
    public description?: string | null,
    public prepaymentPeriod?: dayjs.Dayjs | null,
    public prepaymentAmount?: number | null,
    public inactive?: boolean | null,
    public prepaymentAccount?: IPrepaymentAccount | null,
    public settlementCurrency?: ISettlementCurrency | null,
    public debitAccount?: ITransactionAccount | null,
    public creditAccount?: ITransactionAccount | null,
    public placeholders?: IPlaceholder[] | null
  ) {
    this.inactive = this.inactive ?? false;
  }
}

export function getPrepaymentAmortizationIdentifier(prepaymentAmortization: IPrepaymentAmortization): number | undefined {
  return prepaymentAmortization.id;
}
