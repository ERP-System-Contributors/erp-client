///
/// Erp System - Mark X No 5 (Jehoiada Series) Client 1.7.3
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


import { IIFRS16LeaseContract } from '../ifrs-16-lease-contract/ifrs-16-lease-contract.model';
import { IAssetCategory } from '../../erp-assets/asset-category/asset-category.model';
import { IBusinessDocument } from '../../erp-pages/business-document/business-document.model';
import { ITransactionAccount } from '../../erp-accounts/transaction-account/transaction-account.model';

export interface IRouModelMetadata {
  id?: number;
  modelTitle?: string;
  modelVersion?: number;
  description?: string | null;
  leaseTermPeriods?: number;
  leaseAmount?: number;
  rouModelReference?: string;
  ifrs16LeaseContract?: IIFRS16LeaseContract;
  assetAccount?: ITransactionAccount;
  depreciationAccount?: ITransactionAccount;
  accruedDepreciationAccount?: ITransactionAccount;
  assetCategory?: IAssetCategory | null;
  documentAttachments?: IBusinessDocument[] | null;
}

export class RouModelMetadata implements IRouModelMetadata {
  constructor(
    public id?: number,
    public modelTitle?: string,
    public modelVersion?: number,
    public description?: string | null,
    public leaseTermPeriods?: number,
    public leaseAmount?: number,
    public rouModelReference?: string,
    public ifrs16LeaseContract?: IIFRS16LeaseContract,
    public assetAccount?: ITransactionAccount,
    public depreciationAccount?: ITransactionAccount,
    public accruedDepreciationAccount?: ITransactionAccount,
    public assetCategory?: IAssetCategory | null,
    public documentAttachments?: IBusinessDocument[] | null
  ) {}
}

export function getRouModelMetadataIdentifier(rouModelMetadata: IRouModelMetadata): number | undefined {
  return rouModelMetadata.id;
}
