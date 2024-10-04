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

import { element, by, ElementFinder } from 'protractor';

export class GenderTypeComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-gender-type div table .btn-danger'));
  title = element.all(by.css('jhi-gender-type div h2#page-heading span')).first();
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

export class GenderTypeUpdatePage {
  pageTitle = element(by.id('jhi-gender-type-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  genderCodeInput = element(by.id('field_genderCode'));
  genderTypeSelect = element(by.id('field_genderType'));
  genderDescriptionInput = element(by.id('field_genderDescription'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setGenderCodeInput(genderCode: string): Promise<void> {
    await this.genderCodeInput.sendKeys(genderCode);
  }

  async getGenderCodeInput(): Promise<string> {
    return await this.genderCodeInput.getAttribute('value');
  }

  async setGenderTypeSelect(genderType: string): Promise<void> {
    await this.genderTypeSelect.sendKeys(genderType);
  }

  async getGenderTypeSelect(): Promise<string> {
    return await this.genderTypeSelect.element(by.css('option:checked')).getText();
  }

  async genderTypeSelectLastOption(): Promise<void> {
    await this.genderTypeSelect.all(by.tagName('option')).last().click();
  }

  async setGenderDescriptionInput(genderDescription: string): Promise<void> {
    await this.genderDescriptionInput.sendKeys(genderDescription);
  }

  async getGenderDescriptionInput(): Promise<string> {
    return await this.genderDescriptionInput.getAttribute('value');
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

export class GenderTypeDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-genderType-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-genderType'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getText();
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
