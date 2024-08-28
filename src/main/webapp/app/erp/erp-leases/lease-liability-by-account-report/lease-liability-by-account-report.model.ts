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

import * as dayjs from 'dayjs';
import { IApplicationUser } from '../../erp-pages/application-user/application-user.model';
import { ILeasePeriod } from '../lease-period/lease-period.model';

export interface ILeaseLiabilityByAccountReport {
  id?: number;
  reportId?: string;
  timeOfRequest?: dayjs.Dayjs | null;
  fileChecksum?: string | null;
  tampered?: boolean | null;
  filename?: string | null;
  reportParameters?: string | null;
  reportFileContentType?: string | null;
  reportFile?: string | null;
  requestedBy?: IApplicationUser | null;
  leasePeriod?: ILeasePeriod;
}

export class LeaseLiabilityByAccountReport implements ILeaseLiabilityByAccountReport {
  constructor(
    public id?: number,
    public reportId?: string,
    public timeOfRequest?: dayjs.Dayjs | null,
    public fileChecksum?: string | null,
    public tampered?: boolean | null,
    public filename?: string | null,
    public reportParameters?: string | null,
    public reportFileContentType?: string | null,
    public reportFile?: string | null,
    public requestedBy?: IApplicationUser | null,
    public leasePeriod?: ILeasePeriod
  ) {
    this.tampered = this.tampered ?? false;
  }
}

export function getLeaseLiabilityByAccountReportIdentifier(
  leaseLiabilityByAccountReport: ILeaseLiabilityByAccountReport
): number | undefined {
  return leaseLiabilityByAccountReport.id;
}
