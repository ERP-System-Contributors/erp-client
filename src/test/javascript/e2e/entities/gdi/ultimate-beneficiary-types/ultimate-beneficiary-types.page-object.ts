///
/// Erp System - Mark IX No 5 (Iddo Series) Client 1.6.4
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

export class UltimateBeneficiaryTypesComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-ultimate-beneficiary-types div table .btn-danger'));
  title = element.all(by.css('jhi-ultimate-beneficiary-types div h2#page-heading span')).first();
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

export class UltimateBeneficiaryTypesUpdatePage {
  pageTitle = element(by.id('jhi-ultimate-beneficiary-types-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  ultimateBeneficiaryTypeCodeInput = element(by.id('field_ultimateBeneficiaryTypeCode'));
  ultimateBeneficiaryTypeInput = element(by.id('field_ultimateBeneficiaryType'));
  ultimateBeneficiaryTypeDetailsInput = element(by.id('field_ultimateBeneficiaryTypeDetails'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setUltimateBeneficiaryTypeCodeInput(ultimateBeneficiaryTypeCode: string): Promise<void> {
    await this.ultimateBeneficiaryTypeCodeInput.sendKeys(ultimateBeneficiaryTypeCode);
  }

  async getUltimateBeneficiaryTypeCodeInput(): Promise<string> {
    return await this.ultimateBeneficiaryTypeCodeInput.getAttribute('value');
  }

  async setUltimateBeneficiaryTypeInput(ultimateBeneficiaryType: string): Promise<void> {
    await this.ultimateBeneficiaryTypeInput.sendKeys(ultimateBeneficiaryType);
  }

  async getUltimateBeneficiaryTypeInput(): Promise<string> {
    return await this.ultimateBeneficiaryTypeInput.getAttribute('value');
  }

  async setUltimateBeneficiaryTypeDetailsInput(ultimateBeneficiaryTypeDetails: string): Promise<void> {
    await this.ultimateBeneficiaryTypeDetailsInput.sendKeys(ultimateBeneficiaryTypeDetails);
  }

  async getUltimateBeneficiaryTypeDetailsInput(): Promise<string> {
    return await this.ultimateBeneficiaryTypeDetailsInput.getAttribute('value');
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

export class UltimateBeneficiaryTypesDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-ultimateBeneficiaryTypes-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-ultimateBeneficiaryTypes'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getText();
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
