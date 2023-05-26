///
/// Erp System - Mark III No 15 (Caleb Series) Client 1.3.5
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

import { SubCountyCodeDetailComponent } from './sub-county-code-detail.component';

describe('SubCountyCode Management Detail Component', () => {
  let comp: SubCountyCodeDetailComponent;
  let fixture: ComponentFixture<SubCountyCodeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubCountyCodeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ subCountyCode: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SubCountyCodeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SubCountyCodeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load subCountyCode on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.subCountyCode).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
