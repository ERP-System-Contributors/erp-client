///
/// Erp System - Mark III No 10 (Caleb Series) Client 1.1.0
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

import { IPlaceholder } from 'app/entities/erpService/placeholder/placeholder.model';

export interface ISecurityClearance {
  id?: number;
  clearanceLevel?: string;
  grantedClearances?: ISecurityClearance[] | null;
  placeholders?: IPlaceholder[] | null;
}

export class SecurityClearance implements ISecurityClearance {
  constructor(
    public id?: number,
    public clearanceLevel?: string,
    public grantedClearances?: ISecurityClearance[] | null,
    public placeholders?: IPlaceholder[] | null
  ) {}
}

export function getSecurityClearanceIdentifier(securityClearance: ISecurityClearance): number | undefined {
  return securityClearance.id;
}