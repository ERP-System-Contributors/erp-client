jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ICollateralInformation, CollateralInformation } from '../collateral-information.model';
import { CollateralInformationService } from '../service/collateral-information.service';

import { CollateralInformationRoutingResolveService } from './collateral-information-routing-resolve.service';

describe('CollateralInformation routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: CollateralInformationRoutingResolveService;
  let service: CollateralInformationService;
  let resultCollateralInformation: ICollateralInformation | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(CollateralInformationRoutingResolveService);
    service = TestBed.inject(CollateralInformationService);
    resultCollateralInformation = undefined;
  });

  describe('resolve', () => {
    it('should return ICollateralInformation returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCollateralInformation = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultCollateralInformation).toEqual({ id: 123 });
    });

    it('should return new ICollateralInformation if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCollateralInformation = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultCollateralInformation).toEqual(new CollateralInformation());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as CollateralInformation })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCollateralInformation = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultCollateralInformation).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
