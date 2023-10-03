///
/// Erp System - Mark VI No 1 (Phoebe Series) Client 1.5.3
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

import { genderTypes } from 'app/entities/enumerations/gender-types.model';

export interface IGenderType {
  id?: number;
  genderCode?: string;
  genderType?: genderTypes;
  genderDescription?: string | null;
}

export class GenderType implements IGenderType {
  constructor(public id?: number, public genderCode?: string, public genderType?: genderTypes, public genderDescription?: string | null) {}
}

export function getGenderTypeIdentifier(genderType: IGenderType): number | undefined {
  return genderType.id;
}
