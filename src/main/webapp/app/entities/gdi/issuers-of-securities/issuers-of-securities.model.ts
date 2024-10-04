///
/// Erp System - Mark X No 10 (Jehoiada Series) Client 1.7.8
/// Copyright © 2021 - 2024 Edwin Njeru (mailnjeru@gmail.com)
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

export interface IIssuersOfSecurities {
  id?: number;
  issuerOfSecuritiesCode?: string;
  issuerOfSecurities?: string;
  issuerOfSecuritiesDescription?: string | null;
}

export class IssuersOfSecurities implements IIssuersOfSecurities {
  constructor(
    public id?: number,
    public issuerOfSecuritiesCode?: string,
    public issuerOfSecurities?: string,
    public issuerOfSecuritiesDescription?: string | null
  ) {}
}

export function getIssuersOfSecuritiesIdentifier(issuersOfSecurities: IIssuersOfSecurities): number | undefined {
  return issuersOfSecurities.id;
}
