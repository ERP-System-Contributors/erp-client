jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ProfessionalQualificationService } from '../service/professional-qualification.service';
import { IProfessionalQualification, ProfessionalQualification } from '../professional-qualification.model';

import { ProfessionalQualificationUpdateComponent } from './professional-qualification-update.component';

describe('ProfessionalQualification Management Update Component', () => {
  let comp: ProfessionalQualificationUpdateComponent;
  let fixture: ComponentFixture<ProfessionalQualificationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let professionalQualificationService: ProfessionalQualificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ProfessionalQualificationUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(ProfessionalQualificationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProfessionalQualificationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    professionalQualificationService = TestBed.inject(ProfessionalQualificationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const professionalQualification: IProfessionalQualification = { id: 456 };

      activatedRoute.data = of({ professionalQualification });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(professionalQualification));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProfessionalQualification>>();
      const professionalQualification = { id: 123 };
      jest.spyOn(professionalQualificationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ professionalQualification });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: professionalQualification }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(professionalQualificationService.update).toHaveBeenCalledWith(professionalQualification);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProfessionalQualification>>();
      const professionalQualification = new ProfessionalQualification();
      jest.spyOn(professionalQualificationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ professionalQualification });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: professionalQualification }));
      saveSubject.complete();

      // THEN
      expect(professionalQualificationService.create).toHaveBeenCalledWith(professionalQualification);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProfessionalQualification>>();
      const professionalQualification = { id: 123 };
      jest.spyOn(professionalQualificationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ professionalQualification });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(professionalQualificationService.update).toHaveBeenCalledWith(professionalQualification);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
