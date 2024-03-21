import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../../page-objects/jhi-page-objects';

import {
  CrbDataSubmittingInstitutionsComponentsPage,
  CrbDataSubmittingInstitutionsDeleteDialog,
  CrbDataSubmittingInstitutionsUpdatePage,
} from './crb-data-submitting-institutions.page-object';

const expect = chai.expect;

describe('CrbDataSubmittingInstitutions e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let crbDataSubmittingInstitutionsComponentsPage: CrbDataSubmittingInstitutionsComponentsPage;
  let crbDataSubmittingInstitutionsUpdatePage: CrbDataSubmittingInstitutionsUpdatePage;
  let crbDataSubmittingInstitutionsDeleteDialog: CrbDataSubmittingInstitutionsDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load CrbDataSubmittingInstitutions', async () => {
    await navBarPage.goToEntity('crb-data-submitting-institutions');
    crbDataSubmittingInstitutionsComponentsPage = new CrbDataSubmittingInstitutionsComponentsPage();
    await browser.wait(ec.visibilityOf(crbDataSubmittingInstitutionsComponentsPage.title), 5000);
    expect(await crbDataSubmittingInstitutionsComponentsPage.getTitle()).to.eq('Crb Data Submitting Institutions');
    await browser.wait(
      ec.or(
        ec.visibilityOf(crbDataSubmittingInstitutionsComponentsPage.entities),
        ec.visibilityOf(crbDataSubmittingInstitutionsComponentsPage.noResult)
      ),
      1000
    );
  });

  it('should load create CrbDataSubmittingInstitutions page', async () => {
    await crbDataSubmittingInstitutionsComponentsPage.clickOnCreateButton();
    crbDataSubmittingInstitutionsUpdatePage = new CrbDataSubmittingInstitutionsUpdatePage();
    expect(await crbDataSubmittingInstitutionsUpdatePage.getPageTitle()).to.eq('Create or edit a Crb Data Submitting Institutions');
    await crbDataSubmittingInstitutionsUpdatePage.cancel();
  });

  it('should create and save CrbDataSubmittingInstitutions', async () => {
    const nbButtonsBeforeCreate = await crbDataSubmittingInstitutionsComponentsPage.countDeleteButtons();

    await crbDataSubmittingInstitutionsComponentsPage.clickOnCreateButton();

    await promise.all([
      crbDataSubmittingInstitutionsUpdatePage.setInstitutionCodeInput('institutionCode'),
      crbDataSubmittingInstitutionsUpdatePage.setInstitutionNameInput('institutionName'),
      crbDataSubmittingInstitutionsUpdatePage.setInstitutionCategoryInput('institutionCategory'),
    ]);

    await crbDataSubmittingInstitutionsUpdatePage.save();
    expect(await crbDataSubmittingInstitutionsUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await crbDataSubmittingInstitutionsComponentsPage.countDeleteButtons()).to.eq(
      nbButtonsBeforeCreate + 1,
      'Expected one more entry in the table'
    );
  });

  it('should delete last CrbDataSubmittingInstitutions', async () => {
    const nbButtonsBeforeDelete = await crbDataSubmittingInstitutionsComponentsPage.countDeleteButtons();
    await crbDataSubmittingInstitutionsComponentsPage.clickOnLastDeleteButton();

    crbDataSubmittingInstitutionsDeleteDialog = new CrbDataSubmittingInstitutionsDeleteDialog();
    expect(await crbDataSubmittingInstitutionsDeleteDialog.getDialogTitle()).to.eq(
      'Are you sure you want to delete this Crb Data Submitting Institutions?'
    );
    await crbDataSubmittingInstitutionsDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(crbDataSubmittingInstitutionsComponentsPage.title), 5000);

    expect(await crbDataSubmittingInstitutionsComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
