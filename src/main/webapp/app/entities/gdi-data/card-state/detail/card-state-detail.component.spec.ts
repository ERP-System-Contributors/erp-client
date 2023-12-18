///
/// Erp System - Mark IX No 3 (Iddo Series) Client 1.6.4
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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CardStateDetailComponent } from './card-state-detail.component';

describe('CardState Management Detail Component', () => {
  let comp: CardStateDetailComponent;
  let fixture: ComponentFixture<CardStateDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardStateDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ cardState: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CardStateDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CardStateDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load cardState on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.cardState).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
