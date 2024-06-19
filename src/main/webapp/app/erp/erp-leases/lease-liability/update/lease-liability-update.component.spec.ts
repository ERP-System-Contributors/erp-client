///
/// Erp System - Mark X No 9 (Jehoiada Series) Client 1.7.7
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

import { LeaseAmortizationCalculationService } from '../../lease-amortization-calculation/service/lease-amortization-calculation.service';

jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { LeaseLiabilityService } from '../service/lease-liability.service';
import { ILeaseLiability, LeaseLiability } from '../lease-liability.model';

import { LeaseLiabilityUpdateComponent } from './lease-liability-update.component';
import { ILeaseAmortizationCalculation } from '../../lease-amortization-calculation/lease-amortization-calculation.model';

describe('LeaseLiability Management Update Component', () => {
  let comp: LeaseLiabilityUpdateComponent;
  let fixture: ComponentFixture<LeaseLiabilityUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let leaseLiabilityService: LeaseLiabilityService;
  let leaseAmortizationCalculationService: LeaseAmortizationCalculationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [LeaseLiabilityUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(LeaseLiabilityUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LeaseLiabilityUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    leaseLiabilityService = TestBed.inject(LeaseLiabilityService);
    leaseAmortizationCalculationService = TestBed.inject(LeaseAmortizationCalculationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call leaseAmortizationCalculation query and add missing value', () => {
      const leaseLiability: ILeaseLiability = { id: 456 };
      const leaseAmortizationCalculation: ILeaseAmortizationCalculation = { id: 74365 };
      leaseLiability.leaseAmortizationCalculation = leaseAmortizationCalculation;

      const leaseAmortizationCalculationCollection: ILeaseAmortizationCalculation[] = [{ id: 28104 }];
      jest
        .spyOn(leaseAmortizationCalculationService, 'query')
        .mockReturnValue(of(new HttpResponse({ body: leaseAmortizationCalculationCollection })));
      const expectedCollection: ILeaseAmortizationCalculation[] = [leaseAmortizationCalculation, ...leaseAmortizationCalculationCollection];
      jest
        .spyOn(leaseAmortizationCalculationService, 'addLeaseAmortizationCalculationToCollectionIfMissing')
        .mockReturnValue(expectedCollection);

      activatedRoute.data = of({ leaseLiability });
      comp.ngOnInit();

      expect(leaseAmortizationCalculationService.query).toHaveBeenCalled();
      expect(leaseAmortizationCalculationService.addLeaseAmortizationCalculationToCollectionIfMissing).toHaveBeenCalledWith(
        leaseAmortizationCalculationCollection,
        leaseAmortizationCalculation
      );
      expect(comp.leaseAmortizationCalculationsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const leaseLiability: ILeaseLiability = { id: 456 };
      const leaseAmortizationCalculation: ILeaseAmortizationCalculation = { id: 735 };
      leaseLiability.leaseAmortizationCalculation = leaseAmortizationCalculation;

      activatedRoute.data = of({ leaseLiability });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(leaseLiability));
      expect(comp.leaseAmortizationCalculationsCollection).toContain(leaseAmortizationCalculation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<LeaseLiability>>();
      const leaseLiability = { id: 123 };
      jest.spyOn(leaseLiabilityService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ leaseLiability });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: leaseLiability }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(leaseLiabilityService.update).toHaveBeenCalledWith(leaseLiability);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<LeaseLiability>>();
      const leaseLiability = new LeaseLiability();
      jest.spyOn(leaseLiabilityService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ leaseLiability });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: leaseLiability }));
      saveSubject.complete();

      // THEN
      expect(leaseLiabilityService.create).toHaveBeenCalledWith(leaseLiability);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<LeaseLiability>>();
      const leaseLiability = { id: 123 };
      jest.spyOn(leaseLiabilityService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ leaseLiability });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(leaseLiabilityService.update).toHaveBeenCalledWith(leaseLiability);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackLeaseAmortizationCalculationById', () => {
      it('Should return tracked LeaseAmortizationCalculation primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackLeaseAmortizationCalculationById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
