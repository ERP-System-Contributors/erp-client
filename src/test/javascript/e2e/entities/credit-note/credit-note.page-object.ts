import { element, by, ElementFinder } from 'protractor';

export class CreditNoteComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-credit-note div table .btn-danger'));
  title = element.all(by.css('jhi-credit-note div h2#page-heading span')).first();
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

export class CreditNoteUpdatePage {
  pageTitle = element(by.id('jhi-credit-note-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  creditNumberInput = element(by.id('field_creditNumber'));
  creditNoteDateInput = element(by.id('field_creditNoteDate'));
  creditAmountInput = element(by.id('field_creditAmount'));
  remarksInput = element(by.id('field_remarks'));

  purchaseOrdersSelect = element(by.id('field_purchaseOrders'));
  invoicesSelect = element(by.id('field_invoices'));
  paymentLabelSelect = element(by.id('field_paymentLabel'));
  placeholderSelect = element(by.id('field_placeholder'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setCreditNumberInput(creditNumber: string): Promise<void> {
    await this.creditNumberInput.sendKeys(creditNumber);
  }

  async getCreditNumberInput(): Promise<string> {
    return await this.creditNumberInput.getAttribute('value');
  }

  async setCreditNoteDateInput(creditNoteDate: string): Promise<void> {
    await this.creditNoteDateInput.sendKeys(creditNoteDate);
  }

  async getCreditNoteDateInput(): Promise<string> {
    return await this.creditNoteDateInput.getAttribute('value');
  }

  async setCreditAmountInput(creditAmount: string): Promise<void> {
    await this.creditAmountInput.sendKeys(creditAmount);
  }

  async getCreditAmountInput(): Promise<string> {
    return await this.creditAmountInput.getAttribute('value');
  }

  async setRemarksInput(remarks: string): Promise<void> {
    await this.remarksInput.sendKeys(remarks);
  }

  async getRemarksInput(): Promise<string> {
    return await this.remarksInput.getAttribute('value');
  }

  async purchaseOrdersSelectLastOption(): Promise<void> {
    await this.purchaseOrdersSelect.all(by.tagName('option')).last().click();
  }

  async purchaseOrdersSelectOption(option: string): Promise<void> {
    await this.purchaseOrdersSelect.sendKeys(option);
  }

  getPurchaseOrdersSelect(): ElementFinder {
    return this.purchaseOrdersSelect;
  }

  async getPurchaseOrdersSelectedOption(): Promise<string> {
    return await this.purchaseOrdersSelect.element(by.css('option:checked')).getText();
  }

  async invoicesSelectLastOption(): Promise<void> {
    await this.invoicesSelect.all(by.tagName('option')).last().click();
  }

  async invoicesSelectOption(option: string): Promise<void> {
    await this.invoicesSelect.sendKeys(option);
  }

  getInvoicesSelect(): ElementFinder {
    return this.invoicesSelect;
  }

  async getInvoicesSelectedOption(): Promise<string> {
    return await this.invoicesSelect.element(by.css('option:checked')).getText();
  }

  async paymentLabelSelectLastOption(): Promise<void> {
    await this.paymentLabelSelect.all(by.tagName('option')).last().click();
  }

  async paymentLabelSelectOption(option: string): Promise<void> {
    await this.paymentLabelSelect.sendKeys(option);
  }

  getPaymentLabelSelect(): ElementFinder {
    return this.paymentLabelSelect;
  }

  async getPaymentLabelSelectedOption(): Promise<string> {
    return await this.paymentLabelSelect.element(by.css('option:checked')).getText();
  }

  async placeholderSelectLastOption(): Promise<void> {
    await this.placeholderSelect.all(by.tagName('option')).last().click();
  }

  async placeholderSelectOption(option: string): Promise<void> {
    await this.placeholderSelect.sendKeys(option);
  }

  getPlaceholderSelect(): ElementFinder {
    return this.placeholderSelect;
  }

  async getPlaceholderSelectedOption(): Promise<string> {
    return await this.placeholderSelect.element(by.css('option:checked')).getText();
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

export class CreditNoteDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-creditNote-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-creditNote'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getText();
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
