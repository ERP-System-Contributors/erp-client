///
/// Erp System - Mark VII No 4 (Gideon Series) Client 1.5.6
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

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ISystemContentType, SystemContentType } from '../system-content-type.model';
import { SystemContentTypeService } from '../service/system-content-type.service';

import { SystemContentTypeRoutingResolveService } from './system-content-type-routing-resolve.service';

describe('SystemContentType routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: SystemContentTypeRoutingResolveService;
  let service: SystemContentTypeService;
  let resultSystemContentType: ISystemContentType | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(SystemContentTypeRoutingResolveService);
    service = TestBed.inject(SystemContentTypeService);
    resultSystemContentType = undefined;
  });

  describe('resolve', () => {
    it('should return ISystemContentType returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSystemContentType = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultSystemContentType).toEqual({ id: 123 });
    });

    it('should return new ISystemContentType if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSystemContentType = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultSystemContentType).toEqual(new SystemContentType());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as SystemContentType })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSystemContentType = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultSystemContentType).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
