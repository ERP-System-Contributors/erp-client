///
/// Erp System - Mark X No 6 (Jehoiada Series) Client 1.7.4
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

import { entityItemSelector } from '../../support/commands';
import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('MonthlyPrepaymentReportRequisition e2e test', () => {
  const monthlyPrepaymentReportRequisitionPageUrl = '/monthly-prepayment-report-requisition';
  const monthlyPrepaymentReportRequisitionPageUrlPattern = new RegExp('/monthly-prepayment-report-requisition(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'admin';
  const password = Cypress.env('E2E_PASSWORD') ?? 'admin';
  const monthlyPrepaymentReportRequisitionSample = {};

  let monthlyPrepaymentReportRequisition: any;
  let fiscalYear: any;

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
    cy.visit('');
    cy.login(username, password);
    cy.get(entityItemSelector).should('exist');
  });

  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/fiscal-years',
      body: { fiscalYearCode: 'withdrawal', startDate: '2023-08-15', endDate: '2023-08-15', fiscalYearStatus: 'IN_PROGRESS' },
    }).then(({ body }) => {
      fiscalYear = body;
    });
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/monthly-prepayment-report-requisitions+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/monthly-prepayment-report-requisitions').as('postEntityRequest');
    cy.intercept('DELETE', '/api/monthly-prepayment-report-requisitions/*').as('deleteEntityRequest');
  });

  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/fiscal-years', {
      statusCode: 200,
      body: [fiscalYear],
    });
  });

  afterEach(() => {
    if (monthlyPrepaymentReportRequisition) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/monthly-prepayment-report-requisitions/${monthlyPrepaymentReportRequisition.id}`,
      }).then(() => {
        monthlyPrepaymentReportRequisition = undefined;
      });
    }
  });

  afterEach(() => {
    if (fiscalYear) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/fiscal-years/${fiscalYear.id}`,
      }).then(() => {
        fiscalYear = undefined;
      });
    }
  });

  it('MonthlyPrepaymentReportRequisitions menu should load MonthlyPrepaymentReportRequisitions page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('monthly-prepayment-report-requisition');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('MonthlyPrepaymentReportRequisition').should('exist');
    cy.url().should('match', monthlyPrepaymentReportRequisitionPageUrlPattern);
  });

  describe('MonthlyPrepaymentReportRequisition page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(monthlyPrepaymentReportRequisitionPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create MonthlyPrepaymentReportRequisition page', () => {
        cy.get(entityCreateButtonSelector).click({ force: true });
        cy.url().should('match', new RegExp('/monthly-prepayment-report-requisition/new$'));
        cy.getEntityCreateUpdateHeading('MonthlyPrepaymentReportRequisition');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', monthlyPrepaymentReportRequisitionPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/monthly-prepayment-report-requisitions',

          body: {
            ...monthlyPrepaymentReportRequisitionSample,
            fiscalYear: fiscalYear,
          },
        }).then(({ body }) => {
          monthlyPrepaymentReportRequisition = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/monthly-prepayment-report-requisitions+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [monthlyPrepaymentReportRequisition],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(monthlyPrepaymentReportRequisitionPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details MonthlyPrepaymentReportRequisition page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('monthlyPrepaymentReportRequisition');
        cy.get(entityDetailsBackButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', monthlyPrepaymentReportRequisitionPageUrlPattern);
      });

      it('edit button click should load edit MonthlyPrepaymentReportRequisition page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('MonthlyPrepaymentReportRequisition');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', monthlyPrepaymentReportRequisitionPageUrlPattern);
      });

      it('last delete button click should delete instance of MonthlyPrepaymentReportRequisition', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('monthlyPrepaymentReportRequisition').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', monthlyPrepaymentReportRequisitionPageUrlPattern);

        monthlyPrepaymentReportRequisition = undefined;
      });
    });
  });

  describe('new MonthlyPrepaymentReportRequisition page', () => {
    beforeEach(() => {
      cy.visit(`${monthlyPrepaymentReportRequisitionPageUrl}`);
      cy.get(entityCreateButtonSelector).click({ force: true });
      cy.getEntityCreateUpdateHeading('MonthlyPrepaymentReportRequisition');
    });

    it('should create an instance of MonthlyPrepaymentReportRequisition', () => {
      cy.get(`[data-cy="fiscalYear"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        monthlyPrepaymentReportRequisition = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', monthlyPrepaymentReportRequisitionPageUrlPattern);
    });
  });
});
