///
/// Erp System - Mark III No 17 (Caleb Series) Client 1.3.9
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

import { IDealer } from '../../erp-pages/dealers/dealer/dealer.model';
import { ISettlementCurrency } from '../../erp-settlements/settlement-currency/settlement-currency.model';
import { IPlaceholder } from '../../erp-pages/placeholder/placeholder.model';

export interface IWorkProjectRegister {
  id?: number;
  catalogueNumber?: string;
  description?: string;
  detailsContentType?: string | null;
  details?: string | null;
  totalProjectCost?: number | null;
  additionalNotesContentType?: string | null;
  additionalNotes?: string | null;
  dealers?: IDealer[];
  settlementCurrency?: ISettlementCurrency | null;
  placeholders?: IPlaceholder[] | null;
}

export class WorkProjectRegister implements IWorkProjectRegister {
  constructor(
    public id?: number,
    public catalogueNumber?: string,
    public description?: string,
    public detailsContentType?: string | null,
    public details?: string | null,
    public totalProjectCost?: number | null,
    public additionalNotesContentType?: string | null,
    public additionalNotes?: string | null,
    public dealers?: IDealer[],
    public settlementCurrency?: ISettlementCurrency | null,
    public placeholders?: IPlaceholder[] | null
  ) {}
}

export function getWorkProjectRegisterIdentifier(workProjectRegister: IWorkProjectRegister): number | undefined {
  return workProjectRegister.id;
}
