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

jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { QuestionBaseService } from '../service/question-base.service';
import { IQuestionBase, QuestionBase } from '../question-base.model';
import { IUniversallyUniqueMapping } from 'app/entities/system/universally-unique-mapping/universally-unique-mapping.model';
import { UniversallyUniqueMappingService } from 'app/entities/system/universally-unique-mapping/service/universally-unique-mapping.service';
import { IPlaceholder } from 'app/entities/system/placeholder/placeholder.model';
import { PlaceholderService } from 'app/entities/system/placeholder/service/placeholder.service';

import { QuestionBaseUpdateComponent } from './question-base-update.component';

describe('QuestionBase Management Update Component', () => {
  let comp: QuestionBaseUpdateComponent;
  let fixture: ComponentFixture<QuestionBaseUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let questionBaseService: QuestionBaseService;
  let universallyUniqueMappingService: UniversallyUniqueMappingService;
  let placeholderService: PlaceholderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [QuestionBaseUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(QuestionBaseUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(QuestionBaseUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    questionBaseService = TestBed.inject(QuestionBaseService);
    universallyUniqueMappingService = TestBed.inject(UniversallyUniqueMappingService);
    placeholderService = TestBed.inject(PlaceholderService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call UniversallyUniqueMapping query and add missing value', () => {
      const questionBase: IQuestionBase = { id: 456 };
      const parameters: IUniversallyUniqueMapping[] = [{ id: 56557 }];
      questionBase.parameters = parameters;

      const universallyUniqueMappingCollection: IUniversallyUniqueMapping[] = [{ id: 85195 }];
      jest
        .spyOn(universallyUniqueMappingService, 'query')
        .mockReturnValue(of(new HttpResponse({ body: universallyUniqueMappingCollection })));
      const additionalUniversallyUniqueMappings = [...parameters];
      const expectedCollection: IUniversallyUniqueMapping[] = [
        ...additionalUniversallyUniqueMappings,
        ...universallyUniqueMappingCollection,
      ];
      jest.spyOn(universallyUniqueMappingService, 'addUniversallyUniqueMappingToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ questionBase });
      comp.ngOnInit();

      expect(universallyUniqueMappingService.query).toHaveBeenCalled();
      expect(universallyUniqueMappingService.addUniversallyUniqueMappingToCollectionIfMissing).toHaveBeenCalledWith(
        universallyUniqueMappingCollection,
        ...additionalUniversallyUniqueMappings
      );
      expect(comp.universallyUniqueMappingsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Placeholder query and add missing value', () => {
      const questionBase: IQuestionBase = { id: 456 };
      const placeholderItems: IPlaceholder[] = [{ id: 52896 }];
      questionBase.placeholderItems = placeholderItems;

      const placeholderCollection: IPlaceholder[] = [{ id: 32970 }];
      jest.spyOn(placeholderService, 'query').mockReturnValue(of(new HttpResponse({ body: placeholderCollection })));
      const additionalPlaceholders = [...placeholderItems];
      const expectedCollection: IPlaceholder[] = [...additionalPlaceholders, ...placeholderCollection];
      jest.spyOn(placeholderService, 'addPlaceholderToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ questionBase });
      comp.ngOnInit();

      expect(placeholderService.query).toHaveBeenCalled();
      expect(placeholderService.addPlaceholderToCollectionIfMissing).toHaveBeenCalledWith(placeholderCollection, ...additionalPlaceholders);
      expect(comp.placeholdersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const questionBase: IQuestionBase = { id: 456 };
      const parameters: IUniversallyUniqueMapping = { id: 66315 };
      questionBase.parameters = [parameters];
      const placeholderItems: IPlaceholder = { id: 16847 };
      questionBase.placeholderItems = [placeholderItems];

      activatedRoute.data = of({ questionBase });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(questionBase));
      expect(comp.universallyUniqueMappingsSharedCollection).toContain(parameters);
      expect(comp.placeholdersSharedCollection).toContain(placeholderItems);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<QuestionBase>>();
      const questionBase = { id: 123 };
      jest.spyOn(questionBaseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ questionBase });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: questionBase }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(questionBaseService.update).toHaveBeenCalledWith(questionBase);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<QuestionBase>>();
      const questionBase = new QuestionBase();
      jest.spyOn(questionBaseService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ questionBase });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: questionBase }));
      saveSubject.complete();

      // THEN
      expect(questionBaseService.create).toHaveBeenCalledWith(questionBase);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<QuestionBase>>();
      const questionBase = { id: 123 };
      jest.spyOn(questionBaseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ questionBase });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(questionBaseService.update).toHaveBeenCalledWith(questionBase);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackUniversallyUniqueMappingById', () => {
      it('Should return tracked UniversallyUniqueMapping primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackUniversallyUniqueMappingById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackPlaceholderById', () => {
      it('Should return tracked Placeholder primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackPlaceholderById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });

  describe('Getting selected relationships', () => {
    describe('getSelectedUniversallyUniqueMapping', () => {
      it('Should return option if no UniversallyUniqueMapping is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedUniversallyUniqueMapping(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected UniversallyUniqueMapping for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedUniversallyUniqueMapping(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this UniversallyUniqueMapping is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedUniversallyUniqueMapping(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });

    describe('getSelectedPlaceholder', () => {
      it('Should return option if no Placeholder is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedPlaceholder(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected Placeholder for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedPlaceholder(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this Placeholder is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedPlaceholder(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });
  });
});
