///
/// Erp System - Mark X No 5 (Jehoiada Series) Client 1.7.3
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

import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IRouDepreciationPostingReport, RouDepreciationPostingReport } from '../rou-depreciation-posting-report.model';
import { RouDepreciationPostingReportService } from '../service/rou-depreciation-posting-report.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IFiscalMonth } from 'app/entities/system/fiscal-month/fiscal-month.model';
import { FiscalMonthService } from 'app/entities/system/fiscal-month/service/fiscal-month.service';
import { IApplicationUser } from 'app/entities/people/application-user/application-user.model';
import { ApplicationUserService } from 'app/entities/people/application-user/service/application-user.service';

@Component({
  selector: 'jhi-rou-depreciation-posting-report-update',
  templateUrl: './rou-depreciation-posting-report-update.component.html',
})
export class RouDepreciationPostingReportUpdateComponent implements OnInit {
  isSaving = false;

  fiscalMonthsSharedCollection: IFiscalMonth[] = [];
  applicationUsersSharedCollection: IApplicationUser[] = [];

  editForm = this.fb.group({
    id: [],
    requestId: [null, [Validators.required]],
    timeOfRequest: [],
    reportIsCompiled: [],
    fileChecksum: [],
    tampered: [],
    filename: [null, []],
    reportParameters: [],
    reportFile: [],
    reportFileContentType: [],
    fiscalMonth: [null, Validators.required],
    requestedBy: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected rouDepreciationPostingReportService: RouDepreciationPostingReportService,
    protected fiscalMonthService: FiscalMonthService,
    protected applicationUserService: ApplicationUserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ rouDepreciationPostingReport }) => {
      if (rouDepreciationPostingReport.id === undefined) {
        const today = dayjs().startOf('day');
        rouDepreciationPostingReport.timeOfRequest = today;
      }

      this.updateForm(rouDepreciationPostingReport);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('erpSystemApp.error', { message: err.message })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const rouDepreciationPostingReport = this.createFromForm();
    if (rouDepreciationPostingReport.id !== undefined) {
      this.subscribeToSaveResponse(this.rouDepreciationPostingReportService.update(rouDepreciationPostingReport));
    } else {
      this.subscribeToSaveResponse(this.rouDepreciationPostingReportService.create(rouDepreciationPostingReport));
    }
  }

  trackFiscalMonthById(index: number, item: IFiscalMonth): number {
    return item.id!;
  }

  trackApplicationUserById(index: number, item: IApplicationUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRouDepreciationPostingReport>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(rouDepreciationPostingReport: IRouDepreciationPostingReport): void {
    this.editForm.patchValue({
      id: rouDepreciationPostingReport.id,
      requestId: rouDepreciationPostingReport.requestId,
      timeOfRequest: rouDepreciationPostingReport.timeOfRequest
        ? rouDepreciationPostingReport.timeOfRequest.format(DATE_TIME_FORMAT)
        : null,
      reportIsCompiled: rouDepreciationPostingReport.reportIsCompiled,
      fileChecksum: rouDepreciationPostingReport.fileChecksum,
      tampered: rouDepreciationPostingReport.tampered,
      filename: rouDepreciationPostingReport.filename,
      reportParameters: rouDepreciationPostingReport.reportParameters,
      reportFile: rouDepreciationPostingReport.reportFile,
      reportFileContentType: rouDepreciationPostingReport.reportFileContentType,
      fiscalMonth: rouDepreciationPostingReport.fiscalMonth,
      requestedBy: rouDepreciationPostingReport.requestedBy,
    });

    this.fiscalMonthsSharedCollection = this.fiscalMonthService.addFiscalMonthToCollectionIfMissing(
      this.fiscalMonthsSharedCollection,
      rouDepreciationPostingReport.fiscalMonth
    );
    this.applicationUsersSharedCollection = this.applicationUserService.addApplicationUserToCollectionIfMissing(
      this.applicationUsersSharedCollection,
      rouDepreciationPostingReport.requestedBy
    );
  }

  protected loadRelationshipsOptions(): void {
    this.fiscalMonthService
      .query()
      .pipe(map((res: HttpResponse<IFiscalMonth[]>) => res.body ?? []))
      .pipe(
        map((fiscalMonths: IFiscalMonth[]) =>
          this.fiscalMonthService.addFiscalMonthToCollectionIfMissing(fiscalMonths, this.editForm.get('fiscalMonth')!.value)
        )
      )
      .subscribe((fiscalMonths: IFiscalMonth[]) => (this.fiscalMonthsSharedCollection = fiscalMonths));

    this.applicationUserService
      .query()
      .pipe(map((res: HttpResponse<IApplicationUser[]>) => res.body ?? []))
      .pipe(
        map((applicationUsers: IApplicationUser[]) =>
          this.applicationUserService.addApplicationUserToCollectionIfMissing(applicationUsers, this.editForm.get('requestedBy')!.value)
        )
      )
      .subscribe((applicationUsers: IApplicationUser[]) => (this.applicationUsersSharedCollection = applicationUsers));
  }

  protected createFromForm(): IRouDepreciationPostingReport {
    return {
      ...new RouDepreciationPostingReport(),
      id: this.editForm.get(['id'])!.value,
      requestId: this.editForm.get(['requestId'])!.value,
      timeOfRequest: this.editForm.get(['timeOfRequest'])!.value
        ? dayjs(this.editForm.get(['timeOfRequest'])!.value, DATE_TIME_FORMAT)
        : undefined,
      reportIsCompiled: this.editForm.get(['reportIsCompiled'])!.value,
      fileChecksum: this.editForm.get(['fileChecksum'])!.value,
      tampered: this.editForm.get(['tampered'])!.value,
      filename: this.editForm.get(['filename'])!.value,
      reportParameters: this.editForm.get(['reportParameters'])!.value,
      reportFileContentType: this.editForm.get(['reportFileContentType'])!.value,
      reportFile: this.editForm.get(['reportFile'])!.value,
      fiscalMonth: this.editForm.get(['fiscalMonth'])!.value,
      requestedBy: this.editForm.get(['requestedBy'])!.value,
    };
  }
}
