jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { KenyanCurrencyDenominationService } from '../service/kenyan-currency-denomination.service';
import { IKenyanCurrencyDenomination, KenyanCurrencyDenomination } from '../kenyan-currency-denomination.model';

import { KenyanCurrencyDenominationUpdateComponent } from './kenyan-currency-denomination-update.component';

describe('KenyanCurrencyDenomination Management Update Component', () => {
  let comp: KenyanCurrencyDenominationUpdateComponent;
  let fixture: ComponentFixture<KenyanCurrencyDenominationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let kenyanCurrencyDenominationService: KenyanCurrencyDenominationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [KenyanCurrencyDenominationUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(KenyanCurrencyDenominationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(KenyanCurrencyDenominationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    kenyanCurrencyDenominationService = TestBed.inject(KenyanCurrencyDenominationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const kenyanCurrencyDenomination: IKenyanCurrencyDenomination = { id: 456 };

      activatedRoute.data = of({ kenyanCurrencyDenomination });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(kenyanCurrencyDenomination));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<KenyanCurrencyDenomination>>();
      const kenyanCurrencyDenomination = { id: 123 };
      jest.spyOn(kenyanCurrencyDenominationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ kenyanCurrencyDenomination });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: kenyanCurrencyDenomination }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(kenyanCurrencyDenominationService.update).toHaveBeenCalledWith(kenyanCurrencyDenomination);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<KenyanCurrencyDenomination>>();
      const kenyanCurrencyDenomination = new KenyanCurrencyDenomination();
      jest.spyOn(kenyanCurrencyDenominationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ kenyanCurrencyDenomination });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: kenyanCurrencyDenomination }));
      saveSubject.complete();

      // THEN
      expect(kenyanCurrencyDenominationService.create).toHaveBeenCalledWith(kenyanCurrencyDenomination);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<KenyanCurrencyDenomination>>();
      const kenyanCurrencyDenomination = { id: 123 };
      jest.spyOn(kenyanCurrencyDenominationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ kenyanCurrencyDenomination });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(kenyanCurrencyDenominationService.update).toHaveBeenCalledWith(kenyanCurrencyDenomination);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
