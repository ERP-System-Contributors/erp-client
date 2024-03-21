jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IPartyRelationType, PartyRelationType } from '../party-relation-type.model';
import { PartyRelationTypeService } from '../service/party-relation-type.service';

import { PartyRelationTypeRoutingResolveService } from './party-relation-type-routing-resolve.service';

describe('PartyRelationType routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: PartyRelationTypeRoutingResolveService;
  let service: PartyRelationTypeService;
  let resultPartyRelationType: IPartyRelationType | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(PartyRelationTypeRoutingResolveService);
    service = TestBed.inject(PartyRelationTypeService);
    resultPartyRelationType = undefined;
  });

  describe('resolve', () => {
    it('should return IPartyRelationType returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPartyRelationType = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPartyRelationType).toEqual({ id: 123 });
    });

    it('should return new IPartyRelationType if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPartyRelationType = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultPartyRelationType).toEqual(new PartyRelationType());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as PartyRelationType })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPartyRelationType = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPartyRelationType).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
