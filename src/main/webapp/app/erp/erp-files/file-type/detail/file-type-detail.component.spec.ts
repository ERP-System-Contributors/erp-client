///
/// Erp System - Mark VII No 4 (Gideon Series) Client 1.5.6
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

import { DataUtils } from 'app/core/util/data-util.service';

import { FileTypeDetailComponent } from './file-type-detail.component';

describe('Component Tests', () => {
  describe('FileType Management Detail Component', () => {
    let comp: FileTypeDetailComponent;
    let fixture: ComponentFixture<FileTypeDetailComponent>;
    let dataUtils: DataUtils;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [FileTypeDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ fileType: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(FileTypeDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(FileTypeDetailComponent);
      comp = fixture.componentInstance;
      dataUtils = TestBed.inject(DataUtils);
      jest.spyOn(window, 'open').mockImplementation(() => null);
    });

    describe('OnInit', () => {
      it('Should load fileType on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.fileType).toEqual(expect.objectContaining({ id: 123 }));
      });
    });

    describe('byteSize', () => {
      it('Should call byteSize from DataUtils', () => {
        // GIVEN
        jest.spyOn(dataUtils, 'byteSize');
        const fakeBase64 = 'fake base64';

        // WHEN
        comp.byteSize(fakeBase64);

        // THEN
        expect(dataUtils.byteSize).toBeCalledWith(fakeBase64);
      });
    });

    describe('openFile', () => {
      it('Should call openFile from DataUtils', () => {
        const newWindow = { ...window };
        newWindow.document.write = jest.fn();
        window.open = jest.fn(() => newWindow);
        window.onload = jest.fn(() => newWindow);
        window.URL.createObjectURL = jest.fn();
        // GIVEN
        jest.spyOn(dataUtils, 'openFile');
        const fakeContentType = 'fake content type';
        const fakeBase64 = 'fake base64';

        // WHEN
        comp.openFile(fakeBase64, fakeContentType);

        // THEN
        expect(dataUtils.openFile).toBeCalledWith(fakeBase64, fakeContentType);
      });
    });
  });
});
