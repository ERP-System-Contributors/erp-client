jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IPaymentRequisition, PaymentRequisition } from '../payment-requisition.model';
import { PaymentRequisitionService } from '../service/payment-requisition.service';

import { PaymentRequisitionRoutingResolveService } from './payment-requisition-routing-resolve.service';

describe('Service Tests', () => {
  describe('PaymentRequisition routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: PaymentRequisitionRoutingResolveService;
    let service: PaymentRequisitionService;
    let resultPaymentRequisition: IPaymentRequisition | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(PaymentRequisitionRoutingResolveService);
      service = TestBed.inject(PaymentRequisitionService);
      resultPaymentRequisition = undefined;
    });

    describe('resolve', () => {
      it('should return IPaymentRequisition returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPaymentRequisition = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPaymentRequisition).toEqual({ id: 123 });
      });

      it('should return new IPaymentRequisition if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPaymentRequisition = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultPaymentRequisition).toEqual(new PaymentRequisition());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as PaymentRequisition })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPaymentRequisition = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPaymentRequisition).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});