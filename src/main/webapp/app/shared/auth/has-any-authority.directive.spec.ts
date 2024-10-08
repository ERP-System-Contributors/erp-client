///
/// Erp System - Mark X No 10 (Jehoiada Series) Client 1.7.8
/// Copyright © 2021 - 2024 Edwin Njeru (mailnjeru@gmail.com)
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

jest.mock('app/core/auth/account.service');

import { Component, ElementRef, ViewChild } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

import { HasAnyAuthorityDirective } from './has-any-authority.directive';

@Component({
  template: ` <div *jhiHasAnyAuthority="'ROLE_ADMIN'" #content></div> `,
})
class TestHasAnyAuthorityDirectiveComponent {
  @ViewChild('content', { static: false })
  content?: ElementRef;
}

describe('HasAnyAuthorityDirective tests', () => {
  let mockAccountService: AccountService;
  const authenticationState = new Subject<Account | null>();

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [HasAnyAuthorityDirective, TestHasAnyAuthorityDirectiveComponent],
        providers: [AccountService],
      });
    })
  );

  beforeEach(() => {
    mockAccountService = TestBed.inject(AccountService);
    mockAccountService.getAuthenticationState = jest.fn(() => authenticationState.asObservable());
  });

  describe('set jhiHasAnyAuthority', () => {
    it('should show restricted content to user if user has required role', () => {
      // GIVEN
      mockAccountService.hasAnyAuthority = jest.fn(() => true);
      const fixture = TestBed.createComponent(TestHasAnyAuthorityDirectiveComponent);
      const comp = fixture.componentInstance;

      // WHEN
      fixture.detectChanges();

      // THEN
      expect(comp.content).toBeDefined();
    });

    it('should not show restricted content to user if user has not required role', () => {
      // GIVEN
      mockAccountService.hasAnyAuthority = jest.fn(() => false);
      const fixture = TestBed.createComponent(TestHasAnyAuthorityDirectiveComponent);
      const comp = fixture.componentInstance;

      // WHEN
      fixture.detectChanges();

      // THEN
      expect(comp.content).toBeUndefined();
    });
  });

  describe('change authorities', () => {
    it('should show or not show restricted content correctly if user authorities are changing', () => {
      // GIVEN
      mockAccountService.hasAnyAuthority = jest.fn(() => true);
      const fixture = TestBed.createComponent(TestHasAnyAuthorityDirectiveComponent);
      const comp = fixture.componentInstance;

      // WHEN
      fixture.detectChanges();

      // THEN
      expect(comp.content).toBeDefined();

      // GIVEN
      mockAccountService.hasAnyAuthority = jest.fn(() => false);

      // WHEN
      authenticationState.next();
      fixture.detectChanges();

      // THEN
      expect(comp.content).toBeUndefined();

      // GIVEN
      mockAccountService.hasAnyAuthority = jest.fn(() => true);

      // WHEN
      authenticationState.next();
      fixture.detectChanges();

      // THEN
      expect(comp.content).toBeDefined();
    });
  });

  describe('ngOnDestroy', () => {
    it('should destroy authentication state subscription on component destroy', () => {
      // GIVEN
      mockAccountService.hasAnyAuthority = jest.fn(() => true);
      const fixture = TestBed.createComponent(TestHasAnyAuthorityDirectiveComponent);
      const div = fixture.debugElement.queryAllNodes(By.directive(HasAnyAuthorityDirective))[0];
      const hasAnyAuthorityDirective = div.injector.get(HasAnyAuthorityDirective);

      // WHEN
      fixture.detectChanges();

      // THEN
      expect(mockAccountService.hasAnyAuthority).toHaveBeenCalled();

      // WHEN
      jest.clearAllMocks();
      authenticationState.next();

      // THEN
      expect(mockAccountService.hasAnyAuthority).toHaveBeenCalled();

      // WHEN
      jest.clearAllMocks();
      hasAnyAuthorityDirective.ngOnDestroy();
      authenticationState.next();

      // THEN
      expect(mockAccountService.hasAnyAuthority).not.toHaveBeenCalled();
    });
  });
});
