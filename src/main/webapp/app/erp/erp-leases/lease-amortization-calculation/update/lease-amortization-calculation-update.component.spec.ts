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

import { IFRS16LeaseContractService } from '../../ifrs-16-lease-contract/service/ifrs-16-lease-contract.service';

jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { LeaseAmortizationCalculationService } from '../service/lease-amortization-calculation.service';
import { ILeaseAmortizationCalculation, LeaseAmortizationCalculation } from '../lease-amortization-calculation.model';

import { LeaseAmortizationCalculationUpdateComponent } from './lease-amortization-calculation-update.component';
import { IIFRS16LeaseContract } from '../../ifrs-16-lease-contract/ifrs-16-lease-contract.model';

describe('LeaseAmortizationCalculation Management Update Component', () => {
  let comp: LeaseAmortizationCalculationUpdateComponent;
  let fixture: ComponentFixture<LeaseAmortizationCalculationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let leaseAmortizationCalculationService: LeaseAmortizationCalculationService;
  let iFRS16LeaseContractService: IFRS16LeaseContractService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [LeaseAmortizationCalculationUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(LeaseAmortizationCalculationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LeaseAmortizationCalculationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    leaseAmortizationCalculationService = TestBed.inject(LeaseAmortizationCalculationService);
    iFRS16LeaseContractService = TestBed.inject(IFRS16LeaseContractService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call IFRS16LeaseContract query and add missing value', () => {
      const leaseAmortizationCalculation: ILeaseAmortizationCalculation = { id: 456 };
      const IFRS16LeaseContract: IIFRS16LeaseContract = { id: 93095 };
      leaseAmortizationCalculation.iFRS16LeaseContract = IFRS16LeaseContract;

      const IFRS16LeaseContractCollection: IIFRS16LeaseContract[] = [{ id: 408 }];
      jest.spyOn(iFRS16LeaseContractService, 'query').mockReturnValue(of(new HttpResponse({ body: IFRS16LeaseContractCollection })));
      const expectedCollection: IIFRS16LeaseContract[] = [IFRS16LeaseContract, ...IFRS16LeaseContractCollection];
      jest.spyOn(iFRS16LeaseContractService, 'addIFRS16LeaseContractToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ leaseAmortizationCalculation });
      comp.ngOnInit();

      expect(iFRS16LeaseContractService.query).toHaveBeenCalled();
      expect(iFRS16LeaseContractService.addIFRS16LeaseContractToCollectionIfMissing).toHaveBeenCalledWith(
        IFRS16LeaseContractCollection,
        IFRS16LeaseContract
      );
      expect(comp.iFRS16LeaseContractsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const leaseAmortizationCalculation: ILeaseAmortizationCalculation = { id: 456 };
      const IFRS16LeaseContract: IIFRS16LeaseContract = { id: 77160 };
      leaseAmortizationCalculation.IFRS16LeaseContract = IFRS16LeaseContract;

      activatedRoute.data = of({ leaseAmortizationCalculation });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(leaseAmortizationCalculation));
      expect(comp.iFRS16LeaseContractsCollection).toContain(IFRS16LeaseContract);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<LeaseAmortizationCalculation>>();
      const leaseAmortizationCalculation = { id: 123 };
      jest.spyOn(leaseAmortizationCalculationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ leaseAmortizationCalculation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: leaseAmortizationCalculation }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(leaseAmortizationCalculationService.update).toHaveBeenCalledWith(leaseAmortizationCalculation);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<LeaseAmortizationCalculation>>();
      const leaseAmortizationCalculation = new LeaseAmortizationCalculation();
      jest.spyOn(leaseAmortizationCalculationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ leaseAmortizationCalculation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: leaseAmortizationCalculation }));
      saveSubject.complete();

      // THEN
      expect(leaseAmortizationCalculationService.create).toHaveBeenCalledWith(leaseAmortizationCalculation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<LeaseAmortizationCalculation>>();
      const leaseAmortizationCalculation = { id: 123 };
      jest.spyOn(leaseAmortizationCalculationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ leaseAmortizationCalculation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(leaseAmortizationCalculationService.update).toHaveBeenCalledWith(leaseAmortizationCalculation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackIFRS16LeaseContractById', () => {
      it('Should return tracked IFRS16LeaseContract primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackIFRS16LeaseContractById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
