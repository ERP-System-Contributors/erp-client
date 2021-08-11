import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {AccountService} from "../../../core/auth/account.service";
import {ProfileService} from "../../../layouts/profiles/profile.service";
import {Account} from "../../../core/auth/account.model";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {NgxWebstorageModule} from "ngx-webstorage";
import {Router} from "@angular/router";
import {LoginService} from "../../../login/login.service";
import {of} from "rxjs";
import {ProfileInfo} from "../../../layouts/profiles/profile-info.model";
import {PaymentMenuComponent} from "./payment-menu.component";
import {BespokeNavigationService} from "../service/bespoke-navigation.service";

describe('Component Tests', () => {
  describe('Navbar Component', () => {
    let comp: PaymentMenuComponent;
    let fixture: ComponentFixture<PaymentMenuComponent>;
    let accountService: AccountService;
    let profileService: ProfileService;
    const account: Account = {
      activated: true,
      authorities: [],
      email: '',
      firstName: 'John',
      langKey: '',
      lastName: 'Doe',
      login: 'john.doe',
      imageUrl: '',
    };

    beforeEach(
      waitForAsync(() => {
        TestBed.configureTestingModule({
          imports: [HttpClientTestingModule, NgxWebstorageModule.forRoot()],
          declarations: [PaymentMenuComponent],
          providers: [Router, LoginService, BespokeNavigationService],
        })
          .overrideTemplate(PaymentMenuComponent, '')
          .compileComponents();
      })
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(PaymentMenuComponent);
      comp = fixture.componentInstance;
      accountService = TestBed.inject(AccountService);
      profileService = TestBed.inject(ProfileService);
    });

    it('Should call profileService.getProfileInfo on init', () => {
      // GIVEN
      jest.spyOn(profileService, 'getProfileInfo').mockReturnValue(of(new ProfileInfo()));

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(profileService.getProfileInfo).toHaveBeenCalled();
    });

    it('Should hold current authenticated user in variable account', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.account).toBeNull();

      // WHEN
      accountService.authenticate(account);

      // THEN
      expect(comp.account).toEqual(account);

      // WHEN
      accountService.authenticate(null);

      // THEN
      expect(comp.account).toBeNull();
    });

    it('Should hold current authenticated user in variable account if user is authenticated before page load', () => {
      // GIVEN
      accountService.authenticate(account);

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.account).toEqual(account);

      // WHEN
      accountService.authenticate(null);

      // THEN
      expect(comp.account).toBeNull();
    });
  });
});