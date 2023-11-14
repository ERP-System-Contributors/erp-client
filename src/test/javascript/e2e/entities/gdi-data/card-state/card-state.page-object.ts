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

import { element, by, ElementFinder } from 'protractor';

export class CardStateComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-card-state div table .btn-danger'));
  title = element.all(by.css('jhi-card-state div h2#page-heading span')).first();
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

export class CardStateUpdatePage {
  pageTitle = element(by.id('jhi-card-state-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  cardStateFlagSelect = element(by.id('field_cardStateFlag'));
  cardStateFlagDetailsInput = element(by.id('field_cardStateFlagDetails'));
  cardStateFlagDescriptionInput = element(by.id('field_cardStateFlagDescription'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setCardStateFlagSelect(cardStateFlag: string): Promise<void> {
    await this.cardStateFlagSelect.sendKeys(cardStateFlag);
  }

  async getCardStateFlagSelect(): Promise<string> {
    return await this.cardStateFlagSelect.element(by.css('option:checked')).getText();
  }

  async cardStateFlagSelectLastOption(): Promise<void> {
    await this.cardStateFlagSelect.all(by.tagName('option')).last().click();
  }

  async setCardStateFlagDetailsInput(cardStateFlagDetails: string): Promise<void> {
    await this.cardStateFlagDetailsInput.sendKeys(cardStateFlagDetails);
  }

  async getCardStateFlagDetailsInput(): Promise<string> {
    return await this.cardStateFlagDetailsInput.getAttribute('value');
  }

  async setCardStateFlagDescriptionInput(cardStateFlagDescription: string): Promise<void> {
    await this.cardStateFlagDescriptionInput.sendKeys(cardStateFlagDescription);
  }

  async getCardStateFlagDescriptionInput(): Promise<string> {
    return await this.cardStateFlagDescriptionInput.getAttribute('value');
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

export class CardStateDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-cardState-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-cardState'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getText();
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
