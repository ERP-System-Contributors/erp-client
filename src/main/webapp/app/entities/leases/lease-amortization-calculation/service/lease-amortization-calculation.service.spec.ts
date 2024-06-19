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

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILeaseAmortizationCalculation, LeaseAmortizationCalculation } from '../lease-amortization-calculation.model';

import { LeaseAmortizationCalculationService } from './lease-amortization-calculation.service';

describe('LeaseAmortizationCalculation Service', () => {
  let service: LeaseAmortizationCalculationService;
  let httpMock: HttpTestingController;
  let elemDefault: ILeaseAmortizationCalculation;
  let expectedResult: ILeaseAmortizationCalculation | ILeaseAmortizationCalculation[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LeaseAmortizationCalculationService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      interestRate: 0,
      periodicity: 'AAAAAAA',
      leaseAmount: 0,
      numberOfPeriods: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a LeaseAmortizationCalculation', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new LeaseAmortizationCalculation()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a LeaseAmortizationCalculation', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          interestRate: 1,
          periodicity: 'BBBBBB',
          leaseAmount: 1,
          numberOfPeriods: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a LeaseAmortizationCalculation', () => {
      const patchObject = Object.assign(
        {
          interestRate: 1,
        },
        new LeaseAmortizationCalculation()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of LeaseAmortizationCalculation', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          interestRate: 1,
          periodicity: 'BBBBBB',
          leaseAmount: 1,
          numberOfPeriods: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a LeaseAmortizationCalculation', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addLeaseAmortizationCalculationToCollectionIfMissing', () => {
      it('should add a LeaseAmortizationCalculation to an empty array', () => {
        const leaseAmortizationCalculation: ILeaseAmortizationCalculation = { id: 123 };
        expectedResult = service.addLeaseAmortizationCalculationToCollectionIfMissing([], leaseAmortizationCalculation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(leaseAmortizationCalculation);
      });

      it('should not add a LeaseAmortizationCalculation to an array that contains it', () => {
        const leaseAmortizationCalculation: ILeaseAmortizationCalculation = { id: 123 };
        const leaseAmortizationCalculationCollection: ILeaseAmortizationCalculation[] = [
          {
            ...leaseAmortizationCalculation,
          },
          { id: 456 },
        ];
        expectedResult = service.addLeaseAmortizationCalculationToCollectionIfMissing(
          leaseAmortizationCalculationCollection,
          leaseAmortizationCalculation
        );
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a LeaseAmortizationCalculation to an array that doesn't contain it", () => {
        const leaseAmortizationCalculation: ILeaseAmortizationCalculation = { id: 123 };
        const leaseAmortizationCalculationCollection: ILeaseAmortizationCalculation[] = [{ id: 456 }];
        expectedResult = service.addLeaseAmortizationCalculationToCollectionIfMissing(
          leaseAmortizationCalculationCollection,
          leaseAmortizationCalculation
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(leaseAmortizationCalculation);
      });

      it('should add only unique LeaseAmortizationCalculation to an array', () => {
        const leaseAmortizationCalculationArray: ILeaseAmortizationCalculation[] = [{ id: 123 }, { id: 456 }, { id: 22062 }];
        const leaseAmortizationCalculationCollection: ILeaseAmortizationCalculation[] = [{ id: 123 }];
        expectedResult = service.addLeaseAmortizationCalculationToCollectionIfMissing(
          leaseAmortizationCalculationCollection,
          ...leaseAmortizationCalculationArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const leaseAmortizationCalculation: ILeaseAmortizationCalculation = { id: 123 };
        const leaseAmortizationCalculation2: ILeaseAmortizationCalculation = { id: 456 };
        expectedResult = service.addLeaseAmortizationCalculationToCollectionIfMissing(
          [],
          leaseAmortizationCalculation,
          leaseAmortizationCalculation2
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(leaseAmortizationCalculation);
        expect(expectedResult).toContain(leaseAmortizationCalculation2);
      });

      it('should accept null and undefined values', () => {
        const leaseAmortizationCalculation: ILeaseAmortizationCalculation = { id: 123 };
        expectedResult = service.addLeaseAmortizationCalculationToCollectionIfMissing([], null, leaseAmortizationCalculation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(leaseAmortizationCalculation);
      });

      it('should return initial array if no LeaseAmortizationCalculation is added', () => {
        const leaseAmortizationCalculationCollection: ILeaseAmortizationCalculation[] = [{ id: 123 }];
        expectedResult = service.addLeaseAmortizationCalculationToCollectionIfMissing(
          leaseAmortizationCalculationCollection,
          undefined,
          null
        );
        expect(expectedResult).toEqual(leaseAmortizationCalculationCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
