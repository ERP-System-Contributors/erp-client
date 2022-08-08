///
/// Erp System - Mark II No 23 (Baruch Series) Client v 0.1.1-SNAPSHOT
/// Copyright © 2021 - 2022 Edwin Njeru (mailnjeru@gmail.com)
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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PrepaymentMappingDetailComponent } from './prepayment-mapping-detail.component';

describe('PrepaymentMapping Management Detail Component', () => {
  let comp: PrepaymentMappingDetailComponent;
  let fixture: ComponentFixture<PrepaymentMappingDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrepaymentMappingDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ prepaymentMapping: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PrepaymentMappingDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PrepaymentMappingDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load prepaymentMapping on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.prepaymentMapping).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});