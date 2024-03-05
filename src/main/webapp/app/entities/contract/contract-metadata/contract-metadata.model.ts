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

import * as dayjs from 'dayjs';
import { IDealer } from 'app/entities/people/dealer/dealer.model';
import { IApplicationUser } from 'app/entities/people/application-user/application-user.model';
import { ISecurityClearance } from 'app/entities/people/security-clearance/security-clearance.model';
import { IPlaceholder } from 'app/entities/system/placeholder/placeholder.model';
import { IBusinessDocument } from 'app/entities/documentation/business-document/business-document.model';
import { IUniversallyUniqueMapping } from 'app/entities/gdi/universally-unique-mapping/universally-unique-mapping.model';
import { ContractType } from 'app/entities/enumerations/contract-type.model';
import { ContractStatus } from 'app/entities/enumerations/contract-status.model';

export interface IContractMetadata {
  id?: number;
  description?: string | null;
  typeOfContract?: ContractType;
  contractStatus?: ContractStatus;
  startDate?: dayjs.Dayjs;
  terminationDate?: dayjs.Dayjs;
  commentsAndAttachment?: string | null;
  contractTitle?: string;
  contractIdentifier?: string;
  contractIdentifierShort?: string;
  relatedContracts?: IContractMetadata[] | null;
  department?: IDealer | null;
  contractPartner?: IDealer | null;
  responsiblePerson?: IApplicationUser | null;
  signatories?: IApplicationUser[] | null;
  securityClearance?: ISecurityClearance | null;
  placeholders?: IPlaceholder[] | null;
  contractDocumentFiles?: IBusinessDocument[] | null;
  contractMappings?: IUniversallyUniqueMapping[] | null;
}

export class ContractMetadata implements IContractMetadata {
  constructor(
    public id?: number,
    public description?: string | null,
    public typeOfContract?: ContractType,
    public contractStatus?: ContractStatus,
    public startDate?: dayjs.Dayjs,
    public terminationDate?: dayjs.Dayjs,
    public commentsAndAttachment?: string | null,
    public contractTitle?: string,
    public contractIdentifier?: string,
    public contractIdentifierShort?: string,
    public relatedContracts?: IContractMetadata[] | null,
    public department?: IDealer | null,
    public contractPartner?: IDealer | null,
    public responsiblePerson?: IApplicationUser | null,
    public signatories?: IApplicationUser[] | null,
    public securityClearance?: ISecurityClearance | null,
    public placeholders?: IPlaceholder[] | null,
    public contractDocumentFiles?: IBusinessDocument[] | null,
    public contractMappings?: IUniversallyUniqueMapping[] | null
  ) {}
}

export function getContractMetadataIdentifier(contractMetadata: IContractMetadata): number | undefined {
  return contractMetadata.id;
}
