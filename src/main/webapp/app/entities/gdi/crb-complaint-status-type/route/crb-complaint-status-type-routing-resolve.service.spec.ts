jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ICrbComplaintStatusType, CrbComplaintStatusType } from '../crb-complaint-status-type.model';
import { CrbComplaintStatusTypeService } from '../service/crb-complaint-status-type.service';

import { CrbComplaintStatusTypeRoutingResolveService } from './crb-complaint-status-type-routing-resolve.service';

describe('CrbComplaintStatusType routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: CrbComplaintStatusTypeRoutingResolveService;
  let service: CrbComplaintStatusTypeService;
  let resultCrbComplaintStatusType: ICrbComplaintStatusType | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(CrbComplaintStatusTypeRoutingResolveService);
    service = TestBed.inject(CrbComplaintStatusTypeService);
    resultCrbComplaintStatusType = undefined;
  });

  describe('resolve', () => {
    it('should return ICrbComplaintStatusType returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCrbComplaintStatusType = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultCrbComplaintStatusType).toEqual({ id: 123 });
    });

    it('should return new ICrbComplaintStatusType if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCrbComplaintStatusType = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultCrbComplaintStatusType).toEqual(new CrbComplaintStatusType());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as CrbComplaintStatusType })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCrbComplaintStatusType = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultCrbComplaintStatusType).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
