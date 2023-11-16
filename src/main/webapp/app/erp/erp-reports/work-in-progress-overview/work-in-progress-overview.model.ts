///
/// Erp System - Mark VII No 5 (Gideon Series) Client 1.5.8
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

export interface IWorkInProgressOverview {
  numberOfItems?: number | null;
  instalmentAmount?: number | null;
  totalTransferAmount?: number | null;
  outstandingAmount?: number | null;
}

export class WorkInProgressOverview implements IWorkInProgressOverview {
  constructor(
    public numberOfItems?: number | null,
    public instalmentAmount?: number | null,
    public totalTransferAmount?: number | null,
    public outstandingAmount?: number | null
  ) {}
}
