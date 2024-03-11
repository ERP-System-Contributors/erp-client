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
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRouModelMetadata } from '../rou-model-metadata.model';

import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { RouModelMetadataService } from '../service/rou-model-metadata.service';
import { RouModelMetadataDeleteDialogComponent } from '../delete/rou-model-metadata-delete-dialog.component';
import {
  rouMetadataCopyWorkflowInitiatedFromList,
  rouMetadataCopyWorkflowInitiatedFromView,
  rouMetadataCreationInitiatedFromList, rouMetadataCreationWorkflowInitiatedFromList,
  rouMetadataEditWorkflowInitiatedFromList,
  rouMetadataEditWorkflowInitiatedFromView
} from '../../../store/actions/rou-model-metadata-update-status.actions';
import { Store } from '@ngrx/store';
import { State } from '../../../store/global-store.definition';
import { prepaymentMarshallingCreationWorkflowInitiatedFromList } from '../../../store/actions/prepayment-marshalling-update-status.actions';

@Component({
  selector: 'jhi-rou-model-metadata',
  templateUrl: './rou-model-metadata.component.html',
})
export class RouModelMetadataComponent implements OnInit {
  rouModelMetadata?: IRouModelMetadata[];
  currentSearch: string;
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  constructor(
    protected rouModelMetadataService: RouModelMetadataService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
    protected store: Store<State>
  ) {
    this.currentSearch = this.activatedRoute.snapshot.queryParams['search'] ?? '';
  }

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    if (this.currentSearch) {
      this.rouModelMetadataService
        .search({
          page: pageToLoad - 1,
          query: this.currentSearch,
          size: this.itemsPerPage,
          sort: this.sort(),
        })
        .subscribe(
          (res: HttpResponse<IRouModelMetadata[]>) => {
            this.isLoading = false;
            this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
          },
          () => {
            this.isLoading = false;
            this.onError();
          }
        );
      return;
    }

    this.rouModelMetadataService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<IRouModelMetadata[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
        },
        () => {
          this.isLoading = false;
          this.onError();
        }
      );
  }

  search(query: string): void {
    if (query && ['modelTitle', 'description', 'rouModelReference'].includes(this.predicate)) {
      this.predicate = 'id';
      this.ascending = true;
    }
    this.currentSearch = query;
    this.loadPage(1);
  }

  ngOnInit(): void {
    this.handleNavigation();
  }

  createButtonEvent(): void {
    this.store.dispatch(rouMetadataCreationWorkflowInitiatedFromList())
  }

  editButtonEvent(instance: IRouModelMetadata): void {
    this.store.dispatch(rouMetadataEditWorkflowInitiatedFromList({editedInstance: instance}))
  }

  copyButtonEvent(instance: IRouModelMetadata): void {
    this.store.dispatch(rouMetadataCopyWorkflowInitiatedFromList({copiedInstance: instance}))
  }

  trackId(index: number, item: IRouModelMetadata): number {
    return item.id!;
  }

  delete(rouModelMetadata: IRouModelMetadata): void {
    const modalRef = this.modalService.open(RouModelMetadataDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.rouModelMetadata = rouModelMetadata;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? ASC : DESC)];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected handleNavigation(): void {
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]) => {
      const page = params.get('page');
      const pageNumber = +(page ?? 1);
      const sort = (params.get(SORT) ?? data['defaultSort']).split(',');
      const predicate = sort[0];
      const ascending = sort[1] === ASC;
      if (pageNumber !== this.page || predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
        this.loadPage(pageNumber, true);
      }
    });
  }

  protected onSuccess(data: IRouModelMetadata[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    this.ngbPaginationPage = this.page;
    if (navigate) {
      this.router.navigate(['/rou-model-metadata'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          search: this.currentSearch,
          sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.rouModelMetadata = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
