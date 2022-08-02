import { IPlaceholder } from '../../erp-pages/placeholder/placeholder.model';
import { IProcessStatus } from '../../erp-common/process-status/process-status.model';

export interface IReportStatus {
  id?: number;
  reportName?: string;
  reportId?: string;
  placeholders?: IPlaceholder[] | null;
  processStatus?: IProcessStatus | null;
}

export class ReportStatus implements IReportStatus {
  constructor(
    public id?: number,
    public reportName?: string,
    public reportId?: string,
    public placeholders?: IPlaceholder[] | null,
    public processStatus?: IProcessStatus | null
  ) {}
}

export function getReportStatusIdentifier(reportStatus: IReportStatus): number | undefined {
  return reportStatus.id;
}
