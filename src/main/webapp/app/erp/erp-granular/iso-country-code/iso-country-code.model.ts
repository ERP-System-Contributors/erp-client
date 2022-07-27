///
/// Erp System - Mark II No 21 (Baruch Series) Client v 0.1.0-SNAPSHOT
/// Copyright © 2021 - 2022 Edwin Njeru (mailnjeru@gmail.com)
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

import { IPlaceholder } from '../../erp-common/models/placeholder.model';

export interface IIsoCountryCode {
  id?: number;
  countryCode?: string | null;
  countryDescription?: string | null;
  placeholders?: IPlaceholder[] | null;
}

export class IsoCountryCode implements IIsoCountryCode {
  constructor(
    public id?: number,
    public countryCode?: string | null,
    public countryDescription?: string | null,
    public placeholders?: IPlaceholder[] | null
  ) {}
}

export function getIsoCountryCodeIdentifier(isoCountryCode: IIsoCountryCode): number | undefined {
  return isoCountryCode.id;
}
