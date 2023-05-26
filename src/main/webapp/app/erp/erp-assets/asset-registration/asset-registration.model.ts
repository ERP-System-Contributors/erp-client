///
/// Erp System - Mark III No 15 (Caleb Series) Client 1.3.4
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

import { IPlaceholder } from '../../erp-pages/placeholder/placeholder.model';
import { IAssetCategory } from '../asset-category/asset-category.model';
import { IJobSheet } from '../../erp-settlements/job-sheet/job-sheet.model';
import { IDeliveryNote } from '../../erp-settlements/delivery-note/delivery-note.model';
import { IServiceOutlet } from '../../erp-granular/service-outlet/service-outlet.model';
import { IDealer } from '../../erp-pages/dealers/dealer/dealer.model';
import { IPaymentInvoice } from '../../erp-settlements/payment-invoice/payment-invoice.model';
import { ISettlement } from '../../erp-settlements/settlement/settlement.model';
import { IPurchaseOrder } from '../../erp-settlements/purchase-order/purchase-order.model';
import { IAssetWarranty } from '../asset-warranty/asset-warranty.model';
import { IBusinessDocument } from '../../erp-pages/business-document/business-document.model';
import { IAssetAccessory } from '../asset-accessory/asset-accessory.model';
import { IUniversallyUniqueMapping } from '../../erp-pages/universally-unique-mapping/universally-unique-mapping.model';
import { ISettlementCurrency } from '../../erp-settlements/settlement-currency/settlement-currency.model';

export interface IAssetRegistration {
  id?: number;
  assetNumber?: string;
  assetTag?: string;
  assetDetails?: string | null;
  assetCost?: number;
  commentsContentType?: string | null;
  comments?: string | null;
  modelNumber?: string | null;
  serialNumber?: string | null;
  placeholders?: IPlaceholder[] | null;
  paymentInvoices?: IPaymentInvoice[] | null;
  serviceOutlets?: IServiceOutlet[];
  settlements?: ISettlement[];
  assetCategory?: IAssetCategory;
  purchaseOrders?: IPurchaseOrder[] | null;
  deliveryNotes?: IDeliveryNote[] | null;
  jobSheets?: IJobSheet[] | null;
  dealer?: IDealer;
  designatedUsers?: IDealer[] | null;
  settlementCurrency?: ISettlementCurrency | null;
  businessDocuments?: IBusinessDocument[] | null;
  assetWarranties?: IAssetWarranty[] | null;
  universallyUniqueMappings?: IUniversallyUniqueMapping[] | null;
  assetAccessories?: IAssetAccessory[] | null;
}

export class AssetRegistration implements IAssetRegistration {
  constructor(
    public id?: number,
    public assetNumber?: string,
    public assetTag?: string,
    public assetDetails?: string | null,
    public assetCost?: number,
    public commentsContentType?: string | null,
    public comments?: string | null,
    public modelNumber?: string | null,
    public serialNumber?: string | null,
    public placeholders?: IPlaceholder[] | null,
    public paymentInvoices?: IPaymentInvoice[] | null,
    public serviceOutlets?: IServiceOutlet[],
    public settlements?: ISettlement[],
    public assetCategory?: IAssetCategory,
    public purchaseOrders?: IPurchaseOrder[] | null,
    public deliveryNotes?: IDeliveryNote[] | null,
    public jobSheets?: IJobSheet[] | null,
    public dealer?: IDealer,
    public designatedUsers?: IDealer[] | null,
    public settlementCurrency?: ISettlementCurrency | null,
    public businessDocuments?: IBusinessDocument[] | null,
    public assetWarranties?: IAssetWarranty[] | null,
    public universallyUniqueMappings?: IUniversallyUniqueMapping[] | null,
    public assetAccessories?: IAssetAccessory[] | null
  ) {}
}

export function getAssetRegistrationIdentifier(assetRegistration: IAssetRegistration): number | undefined {
  return assetRegistration.id;
}
