///
/// Erp System - Mark IX No 5 (Iddo Series) Client 1.6.4
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
import { IApplicationUser } from 'app/entities/people/application-user/application-user.model';
import { IDealer } from 'app/entities/people/dealer/dealer.model';
import { IUniversallyUniqueMapping } from 'app/entities/gdi/universally-unique-mapping/universally-unique-mapping.model';
import { IPlaceholder } from 'app/entities/system/placeholder/placeholder.model';
import { IAlgorithm } from 'app/entities/system/algorithm/algorithm.model';
import { ISecurityClearance } from 'app/entities/people/security-clearance/security-clearance.model';

export interface IBusinessDocument {
  id?: number;
  documentTitle?: string;
  description?: string | null;
  documentSerial?: string;
  lastModified?: dayjs.Dayjs | null;
  attachmentFilePath?: string;
  documentFileContentType?: string;
  documentFile?: string;
  fileTampered?: boolean | null;
  documentFileChecksum?: string;
  createdBy?: IApplicationUser;
  lastModifiedBy?: IApplicationUser | null;
  originatingDepartment?: IDealer;
  applicationMappings?: IUniversallyUniqueMapping[] | null;
  placeholders?: IPlaceholder[] | null;
  fileChecksumAlgorithm?: IAlgorithm;
  securityClearance?: ISecurityClearance;
}

export class BusinessDocument implements IBusinessDocument {
  constructor(
    public id?: number,
    public documentTitle?: string,
    public description?: string | null,
    public documentSerial?: string,
    public lastModified?: dayjs.Dayjs | null,
    public attachmentFilePath?: string,
    public documentFileContentType?: string,
    public documentFile?: string,
    public fileTampered?: boolean | null,
    public documentFileChecksum?: string,
    public createdBy?: IApplicationUser,
    public lastModifiedBy?: IApplicationUser | null,
    public originatingDepartment?: IDealer,
    public applicationMappings?: IUniversallyUniqueMapping[] | null,
    public placeholders?: IPlaceholder[] | null,
    public fileChecksumAlgorithm?: IAlgorithm,
    public securityClearance?: ISecurityClearance
  ) {
    this.fileTampered = this.fileTampered ?? false;
  }
}

export function getBusinessDocumentIdentifier(businessDocument: IBusinessDocument): number | undefined {
  return businessDocument.id;
}
