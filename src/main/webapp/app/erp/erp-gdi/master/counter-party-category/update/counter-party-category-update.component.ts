///
/// Erp System - Mark IX No 5 (Iddo Series) Client 1.6.4
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
import { finalize } from 'rxjs/operators';

import { ICounterPartyCategory, CounterPartyCategory } from '../counter-party-category.model';
import { CounterPartyCategoryService } from '../service/counter-party-category.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { CounterpartyCategory } from 'app/entities/enumerations/counterparty-category.model';

@Component({
  selector: 'jhi-counter-party-category-update',
  templateUrl: './counter-party-category-update.component.html',
})
export class CounterPartyCategoryUpdateComponent implements OnInit {
  isSaving = false;
  counterpartyCategoryValues = Object.keys(CounterpartyCategory);

  editForm = this.fb.group({
    id: [],
    counterpartyCategoryCode: [null, [Validators.required]],
    counterpartyCategoryCodeDetails: [null, [Validators.required]],
    counterpartyCategoryDescription: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected counterPartyCategoryService: CounterPartyCategoryService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ counterPartyCategory }) => {
      this.updateForm(counterPartyCategory);
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
    const counterPartyCategory = this.createFromForm();
    if (counterPartyCategory.id !== undefined) {
      this.subscribeToSaveResponse(this.counterPartyCategoryService.update(counterPartyCategory));
    } else {
      this.subscribeToSaveResponse(this.counterPartyCategoryService.create(counterPartyCategory));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICounterPartyCategory>>): void {
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

  protected updateForm(counterPartyCategory: ICounterPartyCategory): void {
    this.editForm.patchValue({
      id: counterPartyCategory.id,
      counterpartyCategoryCode: counterPartyCategory.counterpartyCategoryCode,
      counterpartyCategoryCodeDetails: counterPartyCategory.counterpartyCategoryCodeDetails,
      counterpartyCategoryDescription: counterPartyCategory.counterpartyCategoryDescription,
    });
  }

  protected createFromForm(): ICounterPartyCategory {
    return {
      ...new CounterPartyCategory(),
      id: this.editForm.get(['id'])!.value,
      counterpartyCategoryCode: this.editForm.get(['counterpartyCategoryCode'])!.value,
      counterpartyCategoryCodeDetails: this.editForm.get(['counterpartyCategoryCodeDetails'])!.value,
      counterpartyCategoryDescription: this.editForm.get(['counterpartyCategoryDescription'])!.value,
    };
  }
}
