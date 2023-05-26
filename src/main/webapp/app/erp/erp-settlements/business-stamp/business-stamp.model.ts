///
/// Erp System - Mark III No 15 (Caleb Series) Client 1.3.5
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
import { IDealer } from '../../erp-pages/dealers/dealer/dealer.model';
import { IPlaceholder } from '../../erp-pages/placeholder/placeholder.model';

export interface IBusinessStamp {
  id?: number;
  stampDate?: dayjs.Dayjs | null;
  purpose?: string | null;
  details?: string | null;
  remarks?: string | null;
  stampHolder?: IDealer;
  placeholders?: IPlaceholder[] | null;
}

export class BusinessStamp implements IBusinessStamp {
  constructor(
    public id?: number,
    public stampDate?: dayjs.Dayjs | null,
    public purpose?: string | null,
    public details?: string | null,
    public remarks?: string | null,
    public stampHolder?: IDealer,
    public placeholders?: IPlaceholder[] | null
  ) {}
}

export function getBusinessStampIdentifier(businessStamp: IBusinessStamp): number | undefined {
  return businessStamp.id;
}
