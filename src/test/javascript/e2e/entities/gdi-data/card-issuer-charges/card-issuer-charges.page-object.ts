///
/// Erp System - Mark VIII No 2 (Hilkiah Series) Client 1.6.1
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

import { element, by, ElementFinder } from 'protractor';

export class CardIssuerChargesComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-card-issuer-charges div table .btn-danger'));
  title = element.all(by.css('jhi-card-issuer-charges div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getText();
  }
}

export class CardIssuerChargesUpdatePage {
  pageTitle = element(by.id('jhi-card-issuer-charges-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  reportingDateInput = element(by.id('field_reportingDate'));
  cardFeeChargeInLCYInput = element(by.id('field_cardFeeChargeInLCY'));

  bankCodeSelect = element(by.id('field_bankCode'));
  cardCategorySelect = element(by.id('field_cardCategory'));
  cardTypeSelect = element(by.id('field_cardType'));
  cardBrandSelect = element(by.id('field_cardBrand'));
  cardClassSelect = element(by.id('field_cardClass'));
  cardChargeTypeSelect = element(by.id('field_cardChargeType'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setReportingDateInput(reportingDate: string): Promise<void> {
    await this.reportingDateInput.sendKeys(reportingDate);
  }

  async getReportingDateInput(): Promise<string> {
    return await this.reportingDateInput.getAttribute('value');
  }

  async setCardFeeChargeInLCYInput(cardFeeChargeInLCY: string): Promise<void> {
    await this.cardFeeChargeInLCYInput.sendKeys(cardFeeChargeInLCY);
  }

  async getCardFeeChargeInLCYInput(): Promise<string> {
    return await this.cardFeeChargeInLCYInput.getAttribute('value');
  }

  async bankCodeSelectLastOption(): Promise<void> {
    await this.bankCodeSelect.all(by.tagName('option')).last().click();
  }

  async bankCodeSelectOption(option: string): Promise<void> {
    await this.bankCodeSelect.sendKeys(option);
  }

  getBankCodeSelect(): ElementFinder {
    return this.bankCodeSelect;
  }

  async getBankCodeSelectedOption(): Promise<string> {
    return await this.bankCodeSelect.element(by.css('option:checked')).getText();
  }

  async cardCategorySelectLastOption(): Promise<void> {
    await this.cardCategorySelect.all(by.tagName('option')).last().click();
  }

  async cardCategorySelectOption(option: string): Promise<void> {
    await this.cardCategorySelect.sendKeys(option);
  }

  getCardCategorySelect(): ElementFinder {
    return this.cardCategorySelect;
  }

  async getCardCategorySelectedOption(): Promise<string> {
    return await this.cardCategorySelect.element(by.css('option:checked')).getText();
  }

  async cardTypeSelectLastOption(): Promise<void> {
    await this.cardTypeSelect.all(by.tagName('option')).last().click();
  }

  async cardTypeSelectOption(option: string): Promise<void> {
    await this.cardTypeSelect.sendKeys(option);
  }

  getCardTypeSelect(): ElementFinder {
    return this.cardTypeSelect;
  }

  async getCardTypeSelectedOption(): Promise<string> {
    return await this.cardTypeSelect.element(by.css('option:checked')).getText();
  }

  async cardBrandSelectLastOption(): Promise<void> {
    await this.cardBrandSelect.all(by.tagName('option')).last().click();
  }

  async cardBrandSelectOption(option: string): Promise<void> {
    await this.cardBrandSelect.sendKeys(option);
  }

  getCardBrandSelect(): ElementFinder {
    return this.cardBrandSelect;
  }

  async getCardBrandSelectedOption(): Promise<string> {
    return await this.cardBrandSelect.element(by.css('option:checked')).getText();
  }

  async cardClassSelectLastOption(): Promise<void> {
    await this.cardClassSelect.all(by.tagName('option')).last().click();
  }

  async cardClassSelectOption(option: string): Promise<void> {
    await this.cardClassSelect.sendKeys(option);
  }

  getCardClassSelect(): ElementFinder {
    return this.cardClassSelect;
  }

  async getCardClassSelectedOption(): Promise<string> {
    return await this.cardClassSelect.element(by.css('option:checked')).getText();
  }

  async cardChargeTypeSelectLastOption(): Promise<void> {
    await this.cardChargeTypeSelect.all(by.tagName('option')).last().click();
  }

  async cardChargeTypeSelectOption(option: string): Promise<void> {
    await this.cardChargeTypeSelect.sendKeys(option);
  }

  getCardChargeTypeSelect(): ElementFinder {
    return this.cardChargeTypeSelect;
  }

  async getCardChargeTypeSelectedOption(): Promise<string> {
    return await this.cardChargeTypeSelect.element(by.css('option:checked')).getText();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class CardIssuerChargesDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-cardIssuerCharges-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-cardIssuerCharges'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getText();
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
