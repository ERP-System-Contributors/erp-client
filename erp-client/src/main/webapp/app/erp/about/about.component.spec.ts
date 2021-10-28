import {AboutComponent} from "./about.component";

jest.mock('app/core/auth/account.service');
jest.mock('@angular/router');

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';


describe('Component Tests', () => {
  describe('Home Component', () => {
    let comp: AboutComponent;
    let fixture: ComponentFixture<AboutComponent>;
    let mockAccountService: AccountService;
    let mockRouter: Router;
    const account: Account = {
      activated: true,
      authorities: [],
      email: '',
      firstName: null,
      langKey: '',
      lastName: null,
      login: 'login',
      imageUrl: null,
    };

    beforeEach(
      waitForAsync(() => {
        TestBed.configureTestingModule({
          declarations: [AboutComponent],
          providers: [AccountService, Router],
        })
          .overrideTemplate(AboutComponent, '')
          .compileComponents();
      })
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(AboutComponent);
      comp = fixture.componentInstance;
      mockAccountService = TestBed.inject(AccountService);
      mockAccountService.identity = jest.fn(() => of(null));
      mockAccountService.getAuthenticationState = jest.fn(() => of(null));
      mockRouter = TestBed.inject(Router);
    });

    describe('ngOnInit', () => {
      it('Should synchronize account variable with current account', () => {
        // GIVEN
        const authenticationState = new Subject<Account | null>();
        mockAccountService.getAuthenticationState = jest.fn(() => authenticationState.asObservable());

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.account).toBeNull();

        // WHEN
        authenticationState.next(account);

        // THEN
        expect(comp.account).toEqual(account);

        // WHEN
        authenticationState.next(null);

        // THEN
        expect(comp.account).toBeNull();
      });
    });

    describe('login', () => {
      it('Should navigate to /login on login', () => {
        // WHEN
        comp.login();

        // THEN
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
      });
    });

    describe('ngOnDestroy', () => {
      it('Should destroy authentication state subscription on component destroy', () => {
        // GIVEN
        const authenticationState = new Subject<Account | null>();
        mockAccountService.getAuthenticationState = jest.fn(() => authenticationState.asObservable());

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.account).toBeNull();

        // WHEN
        authenticationState.next(account);

        // THEN
        expect(comp.account).toEqual(account);

        // WHEN
        comp.ngOnDestroy();
        authenticationState.next(null);

        // THEN
        expect(comp.account).toEqual(account);
      });
    });
  });
});
