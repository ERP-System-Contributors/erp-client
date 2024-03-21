import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../../page-objects/jhi-page-objects';

import { StaffRoleTypeComponentsPage, StaffRoleTypeDeleteDialog, StaffRoleTypeUpdatePage } from './staff-role-type.page-object';

const expect = chai.expect;

describe('StaffRoleType e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let staffRoleTypeComponentsPage: StaffRoleTypeComponentsPage;
  let staffRoleTypeUpdatePage: StaffRoleTypeUpdatePage;
  let staffRoleTypeDeleteDialog: StaffRoleTypeDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load StaffRoleTypes', async () => {
    await navBarPage.goToEntity('staff-role-type');
    staffRoleTypeComponentsPage = new StaffRoleTypeComponentsPage();
    await browser.wait(ec.visibilityOf(staffRoleTypeComponentsPage.title), 5000);
    expect(await staffRoleTypeComponentsPage.getTitle()).to.eq('Staff Role Types');
    await browser.wait(
      ec.or(ec.visibilityOf(staffRoleTypeComponentsPage.entities), ec.visibilityOf(staffRoleTypeComponentsPage.noResult)),
      1000
    );
  });

  it('should load create StaffRoleType page', async () => {
    await staffRoleTypeComponentsPage.clickOnCreateButton();
    staffRoleTypeUpdatePage = new StaffRoleTypeUpdatePage();
    expect(await staffRoleTypeUpdatePage.getPageTitle()).to.eq('Create or edit a Staff Role Type');
    await staffRoleTypeUpdatePage.cancel();
  });

  it('should create and save StaffRoleTypes', async () => {
    const nbButtonsBeforeCreate = await staffRoleTypeComponentsPage.countDeleteButtons();

    await staffRoleTypeComponentsPage.clickOnCreateButton();

    await promise.all([
      staffRoleTypeUpdatePage.setStaffRoleTypeCodeInput('staffRoleTypeCode'),
      staffRoleTypeUpdatePage.setStaffRoleTypeInput('staffRoleType'),
      staffRoleTypeUpdatePage.setStaffRoleTypeDetailsInput('staffRoleTypeDetails'),
    ]);

    await staffRoleTypeUpdatePage.save();
    expect(await staffRoleTypeUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await staffRoleTypeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last StaffRoleType', async () => {
    const nbButtonsBeforeDelete = await staffRoleTypeComponentsPage.countDeleteButtons();
    await staffRoleTypeComponentsPage.clickOnLastDeleteButton();

    staffRoleTypeDeleteDialog = new StaffRoleTypeDeleteDialog();
    expect(await staffRoleTypeDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Staff Role Type?');
    await staffRoleTypeDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(staffRoleTypeComponentsPage.title), 5000);

    expect(await staffRoleTypeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
