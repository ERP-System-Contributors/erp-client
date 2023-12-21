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

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISecurityTenure, SecurityTenure } from '../security-tenure.model';

import { SecurityTenureService } from './security-tenure.service';

describe('SecurityTenure Service', () => {
  let service: SecurityTenureService;
  let httpMock: HttpTestingController;
  let elemDefault: ISecurityTenure;
  let expectedResult: ISecurityTenure | ISecurityTenure[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SecurityTenureService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      securityTenureCode: 'AAAAAAA',
      securityTenureType: 'AAAAAAA',
      securityTenureDetails: 'AAAAAAA',
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

    it('should create a SecurityTenure', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new SecurityTenure()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SecurityTenure', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          securityTenureCode: 'BBBBBB',
          securityTenureType: 'BBBBBB',
          securityTenureDetails: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SecurityTenure', () => {
      const patchObject = Object.assign(
        {
          securityTenureDetails: 'BBBBBB',
        },
        new SecurityTenure()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SecurityTenure', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          securityTenureCode: 'BBBBBB',
          securityTenureType: 'BBBBBB',
          securityTenureDetails: 'BBBBBB',
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

    it('should delete a SecurityTenure', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSecurityTenureToCollectionIfMissing', () => {
      it('should add a SecurityTenure to an empty array', () => {
        const securityTenure: ISecurityTenure = { id: 123 };
        expectedResult = service.addSecurityTenureToCollectionIfMissing([], securityTenure);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(securityTenure);
      });

      it('should not add a SecurityTenure to an array that contains it', () => {
        const securityTenure: ISecurityTenure = { id: 123 };
        const securityTenureCollection: ISecurityTenure[] = [
          {
            ...securityTenure,
          },
          { id: 456 },
        ];
        expectedResult = service.addSecurityTenureToCollectionIfMissing(securityTenureCollection, securityTenure);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SecurityTenure to an array that doesn't contain it", () => {
        const securityTenure: ISecurityTenure = { id: 123 };
        const securityTenureCollection: ISecurityTenure[] = [{ id: 456 }];
        expectedResult = service.addSecurityTenureToCollectionIfMissing(securityTenureCollection, securityTenure);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(securityTenure);
      });

      it('should add only unique SecurityTenure to an array', () => {
        const securityTenureArray: ISecurityTenure[] = [{ id: 123 }, { id: 456 }, { id: 47898 }];
        const securityTenureCollection: ISecurityTenure[] = [{ id: 123 }];
        expectedResult = service.addSecurityTenureToCollectionIfMissing(securityTenureCollection, ...securityTenureArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const securityTenure: ISecurityTenure = { id: 123 };
        const securityTenure2: ISecurityTenure = { id: 456 };
        expectedResult = service.addSecurityTenureToCollectionIfMissing([], securityTenure, securityTenure2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(securityTenure);
        expect(expectedResult).toContain(securityTenure2);
      });

      it('should accept null and undefined values', () => {
        const securityTenure: ISecurityTenure = { id: 123 };
        expectedResult = service.addSecurityTenureToCollectionIfMissing([], null, securityTenure, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(securityTenure);
      });

      it('should return initial array if no SecurityTenure is added', () => {
        const securityTenureCollection: ISecurityTenure[] = [{ id: 123 }];
        expectedResult = service.addSecurityTenureToCollectionIfMissing(securityTenureCollection, undefined, null);
        expect(expectedResult).toEqual(securityTenureCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
