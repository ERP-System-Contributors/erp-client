jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ILeaseModelMetadata, LeaseModelMetadata } from '../lease-model-metadata.model';
import { LeaseModelMetadataService } from '../service/lease-model-metadata.service';

import { LeaseModelMetadataRoutingResolveService } from './lease-model-metadata-routing-resolve.service';

describe('LeaseModelMetadata routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: LeaseModelMetadataRoutingResolveService;
  let service: LeaseModelMetadataService;
  let resultLeaseModelMetadata: ILeaseModelMetadata | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(LeaseModelMetadataRoutingResolveService);
    service = TestBed.inject(LeaseModelMetadataService);
    resultLeaseModelMetadata = undefined;
  });

  describe('resolve', () => {
    it('should return ILeaseModelMetadata returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultLeaseModelMetadata = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultLeaseModelMetadata).toEqual({ id: 123 });
    });

    it('should return new ILeaseModelMetadata if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultLeaseModelMetadata = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultLeaseModelMetadata).toEqual(new LeaseModelMetadata());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as LeaseModelMetadata })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultLeaseModelMetadata = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultLeaseModelMetadata).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});