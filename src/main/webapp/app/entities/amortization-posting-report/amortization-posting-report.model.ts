///
/// Erp System - Mark IX No 3 (Iddo Series) Client 1.6.4
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

export interface IAmortizationPostingReport {
  id?: number;
  catalogueNumber?: string | null;
  debitAccount?: string | null;
  creditAccount?: string | null;
  description?: string | null;
  amortizationAmount?: number | null;
}

export class AmortizationPostingReport implements IAmortizationPostingReport {
  constructor(
    public id?: number,
    public catalogueNumber?: string | null,
    public debitAccount?: string | null,
    public creditAccount?: string | null,
    public description?: string | null,
    public amortizationAmount?: number | null
  ) {}
}

export function getAmortizationPostingReportIdentifier(amortizationPostingReport: IAmortizationPostingReport): number | undefined {
  return amortizationPostingReport.id;
}
