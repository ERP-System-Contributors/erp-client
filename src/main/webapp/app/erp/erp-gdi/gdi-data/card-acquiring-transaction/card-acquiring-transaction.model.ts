///
/// Erp System - Mark VII No 4 (Gideon Series) Client 1.5.6
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
import { IIsoCurrencyCode } from '../../master/iso-currency-code/iso-currency-code.model';
import { IInstitutionCode } from '../../master/institution-code/institution-code.model';
import { ICardCategoryType } from '../../master/card-category-type/card-category-type.model';
import { IChannelType } from '../../master/channel-type/channel-type.model';
import { ICardBrandType } from '../../master/card-brand-type/card-brand-type.model';

export interface ICardAcquiringTransaction {
  id?: number;
  reportingDate?: dayjs.Dayjs;
  terminalId?: string;
  numberOfTransactions?: number;
  valueOfTransactionsInLCY?: number;
  bankCode?: IInstitutionCode;
  channelType?: IChannelType;
  cardBrandType?: ICardBrandType;
  currencyOfTransaction?: IIsoCurrencyCode;
  cardIssuerCategory?: ICardCategoryType;
}

export class CardAcquiringTransaction implements ICardAcquiringTransaction {
  constructor(
    public id?: number,
    public reportingDate?: dayjs.Dayjs,
    public terminalId?: string,
    public numberOfTransactions?: number,
    public valueOfTransactionsInLCY?: number,
    public bankCode?: IInstitutionCode,
    public channelType?: IChannelType,
    public cardBrandType?: ICardBrandType,
    public currencyOfTransaction?: IIsoCurrencyCode,
    public cardIssuerCategory?: ICardCategoryType
  ) {}
}

export function getCardAcquiringTransactionIdentifier(cardAcquiringTransaction: ICardAcquiringTransaction): number | undefined {
  return cardAcquiringTransaction.id;
}
