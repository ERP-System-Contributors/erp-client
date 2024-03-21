import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../../page-objects/jhi-page-objects';

import {
  CounterPartyDealTypeComponentsPage,
  CounterPartyDealTypeDeleteDialog,
  CounterPartyDealTypeUpdatePage,
} from './counter-party-deal-type.page-object';

const expect = chai.expect;

describe('CounterPartyDealType e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let counterPartyDealTypeComponentsPage: CounterPartyDealTypeComponentsPage;
  let counterPartyDealTypeUpdatePage: CounterPartyDealTypeUpdatePage;
  let counterPartyDealTypeDeleteDialog: CounterPartyDealTypeDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load CounterPartyDealTypes', async () => {
    await navBarPage.goToEntity('counter-party-deal-type');
    counterPartyDealTypeComponentsPage = new CounterPartyDealTypeComponentsPage();
    await browser.wait(ec.visibilityOf(counterPartyDealTypeComponentsPage.title), 5000);
    expect(await counterPartyDealTypeComponentsPage.getTitle()).to.eq('Counter Party Deal Types');
    await browser.wait(
      ec.or(ec.visibilityOf(counterPartyDealTypeComponentsPage.entities), ec.visibilityOf(counterPartyDealTypeComponentsPage.noResult)),
      1000
    );
  });

  it('should load create CounterPartyDealType page', async () => {
    await counterPartyDealTypeComponentsPage.clickOnCreateButton();
    counterPartyDealTypeUpdatePage = new CounterPartyDealTypeUpdatePage();
    expect(await counterPartyDealTypeUpdatePage.getPageTitle()).to.eq('Create or edit a Counter Party Deal Type');
    await counterPartyDealTypeUpdatePage.cancel();
  });

  it('should create and save CounterPartyDealTypes', async () => {
    const nbButtonsBeforeCreate = await counterPartyDealTypeComponentsPage.countDeleteButtons();

    await counterPartyDealTypeComponentsPage.clickOnCreateButton();

    await promise.all([
      counterPartyDealTypeUpdatePage.setCounterpartyDealCodeInput('counterpartyDealCode'),
      counterPartyDealTypeUpdatePage.setCounterpartyDealTypeDetailsInput('counterpartyDealTypeDetails'),
      counterPartyDealTypeUpdatePage.setCounterpartyDealTypeDescriptionInput('counterpartyDealTypeDescription'),
    ]);

    await counterPartyDealTypeUpdatePage.save();
    expect(await counterPartyDealTypeUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await counterPartyDealTypeComponentsPage.countDeleteButtons()).to.eq(
      nbButtonsBeforeCreate + 1,
      'Expected one more entry in the table'
    );
  });

  it('should delete last CounterPartyDealType', async () => {
    const nbButtonsBeforeDelete = await counterPartyDealTypeComponentsPage.countDeleteButtons();
    await counterPartyDealTypeComponentsPage.clickOnLastDeleteButton();

    counterPartyDealTypeDeleteDialog = new CounterPartyDealTypeDeleteDialog();
    expect(await counterPartyDealTypeDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Counter Party Deal Type?');
    await counterPartyDealTypeDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(counterPartyDealTypeComponentsPage.title), 5000);

    expect(await counterPartyDealTypeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
