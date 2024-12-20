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

import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IReportingEntity, ReportingEntity } from '../reporting-entity.model';
import { ReportingEntityService } from '../service/reporting-entity.service';

@Component({
  selector: 'jhi-reporting-entity-update',
  templateUrl: './reporting-entity-update.component.html',
})
export class ReportingEntityUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    entityName: [null, [Validators.required]],
  });

  constructor(
    protected reportingEntityService: ReportingEntityService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reportingEntity }) => {
      this.updateForm(reportingEntity);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const reportingEntity = this.createFromForm();
    if (reportingEntity.id !== undefined) {
      this.subscribeToSaveResponse(this.reportingEntityService.update(reportingEntity));
    } else {
      this.subscribeToSaveResponse(this.reportingEntityService.create(reportingEntity));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReportingEntity>>): void {
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

  protected updateForm(reportingEntity: IReportingEntity): void {
    this.editForm.patchValue({
      id: reportingEntity.id,
      entityName: reportingEntity.entityName,
    });
  }

  protected createFromForm(): IReportingEntity {
    return {
      ...new ReportingEntity(),
      id: this.editForm.get(['id'])!.value,
      entityName: this.editForm.get(['entityName'])!.value,
    };
  }
}
