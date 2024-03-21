import * as dayjs from 'dayjs';
import { IFiscalMonth } from 'app/entities/system/fiscal-month/fiscal-month.model';
import { IApplicationUser } from 'app/entities/people/application-user/application-user.model';

export interface IRouDepreciationPostingReport {
  id?: number;
  requestId?: string;
  timeOfRequest?: dayjs.Dayjs | null;
  reportIsCompiled?: boolean | null;
  fileChecksum?: string | null;
  tampered?: boolean | null;
  filename?: string | null;
  reportParameters?: string | null;
  reportFileContentType?: string | null;
  reportFile?: string | null;
  fiscalMonth?: IFiscalMonth;
  requestedBy?: IApplicationUser | null;
}

export class RouDepreciationPostingReport implements IRouDepreciationPostingReport {
  constructor(
    public id?: number,
    public requestId?: string,
    public timeOfRequest?: dayjs.Dayjs | null,
    public reportIsCompiled?: boolean | null,
    public fileChecksum?: string | null,
    public tampered?: boolean | null,
    public filename?: string | null,
    public reportParameters?: string | null,
    public reportFileContentType?: string | null,
    public reportFile?: string | null,
    public fiscalMonth?: IFiscalMonth,
    public requestedBy?: IApplicationUser | null
  ) {
    this.reportIsCompiled = this.reportIsCompiled ?? false;
    this.tampered = this.tampered ?? false;
  }
}

export function getRouDepreciationPostingReportIdentifier(rouDepreciationPostingReport: IRouDepreciationPostingReport): number | undefined {
  return rouDepreciationPostingReport.id;
}
