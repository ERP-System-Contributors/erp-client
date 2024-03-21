import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IRouAssetNBVReport, RouAssetNBVReport } from '../rou-asset-nbv-report.model';
import { RouAssetNBVReportService } from '../service/rou-asset-nbv-report.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IFiscalMonth } from 'app/entities/system/fiscal-month/fiscal-month.model';
import { FiscalMonthService } from 'app/entities/system/fiscal-month/service/fiscal-month.service';
import { IApplicationUser } from 'app/entities/people/application-user/application-user.model';
import { ApplicationUserService } from 'app/entities/people/application-user/service/application-user.service';

@Component({
  selector: 'jhi-rou-asset-nbv-report-update',
  templateUrl: './rou-asset-nbv-report-update.component.html',
})
export class RouAssetNBVReportUpdateComponent implements OnInit {
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
    fiscalReportingMonth: [null, Validators.required],
    requestedBy: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected rouAssetNBVReportService: RouAssetNBVReportService,
    protected fiscalMonthService: FiscalMonthService,
    protected applicationUserService: ApplicationUserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ rouAssetNBVReport }) => {
      if (rouAssetNBVReport.id === undefined) {
        const today = dayjs().startOf('day');
        rouAssetNBVReport.timeOfRequest = today;
      }

      this.updateForm(rouAssetNBVReport);

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
    const rouAssetNBVReport = this.createFromForm();
    if (rouAssetNBVReport.id !== undefined) {
      this.subscribeToSaveResponse(this.rouAssetNBVReportService.update(rouAssetNBVReport));
    } else {
      this.subscribeToSaveResponse(this.rouAssetNBVReportService.create(rouAssetNBVReport));
    }
  }

  trackFiscalMonthById(index: number, item: IFiscalMonth): number {
    return item.id!;
  }

  trackApplicationUserById(index: number, item: IApplicationUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRouAssetNBVReport>>): void {
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

  protected updateForm(rouAssetNBVReport: IRouAssetNBVReport): void {
    this.editForm.patchValue({
      id: rouAssetNBVReport.id,
      requestId: rouAssetNBVReport.requestId,
      timeOfRequest: rouAssetNBVReport.timeOfRequest ? rouAssetNBVReport.timeOfRequest.format(DATE_TIME_FORMAT) : null,
      reportIsCompiled: rouAssetNBVReport.reportIsCompiled,
      fileChecksum: rouAssetNBVReport.fileChecksum,
      tampered: rouAssetNBVReport.tampered,
      filename: rouAssetNBVReport.filename,
      reportParameters: rouAssetNBVReport.reportParameters,
      reportFile: rouAssetNBVReport.reportFile,
      reportFileContentType: rouAssetNBVReport.reportFileContentType,
      fiscalReportingMonth: rouAssetNBVReport.fiscalReportingMonth,
      requestedBy: rouAssetNBVReport.requestedBy,
    });

    this.fiscalMonthsSharedCollection = this.fiscalMonthService.addFiscalMonthToCollectionIfMissing(
      this.fiscalMonthsSharedCollection,
      rouAssetNBVReport.fiscalReportingMonth
    );
    this.applicationUsersSharedCollection = this.applicationUserService.addApplicationUserToCollectionIfMissing(
      this.applicationUsersSharedCollection,
      rouAssetNBVReport.requestedBy
    );
  }

  protected loadRelationshipsOptions(): void {
    this.fiscalMonthService
      .query()
      .pipe(map((res: HttpResponse<IFiscalMonth[]>) => res.body ?? []))
      .pipe(
        map((fiscalMonths: IFiscalMonth[]) =>
          this.fiscalMonthService.addFiscalMonthToCollectionIfMissing(fiscalMonths, this.editForm.get('fiscalReportingMonth')!.value)
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

  protected createFromForm(): IRouAssetNBVReport {
    return {
      ...new RouAssetNBVReport(),
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
      fiscalReportingMonth: this.editForm.get(['fiscalReportingMonth'])!.value,
      requestedBy: this.editForm.get(['requestedBy'])!.value,
    };
  }
}
